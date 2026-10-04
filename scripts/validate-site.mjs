#!/usr/bin/env node
// Compare independently built PR-base and candidate source. This is a regression
// gate, not evidence of legacy-content fidelity or deployed-host behavior.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';
import {parseBuildWarnings, inspectBuild, controlledEnvironment, walkFiles} from './migration-baseline.mjs';
import {compareFormatting} from './validate-authored-content.mjs';
import {sourceState, assertSourceUnchanged} from './validate-source-state.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const json = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, {flag: 'wx'});
export const MARKER = 'MIGRATION_MARKDOWN_LINK ';
const OBSERVER = 'MIGRATION_OBSERVER_V1';

export function observerConfig(configPath) {
  return `import original from ${JSON.stringify(configPath)};
if (typeof original === 'function' || typeof original.markdown?.hooks?.onBrokenMarkdownLinks === 'function') {
  throw new Error('Observer supports static config and severity-only Markdown hooks; review custom hook semantics before overriding them');
}
console.log(${JSON.stringify(OBSERVER)});
export default {...original, onBrokenLinks: 'warn', markdown: {
  ...original.markdown, hooks: {...original.markdown?.hooks,
    onBrokenMarkdownLinks: ({sourceFilePath, url, node}) => {
      console.log(${JSON.stringify(MARKER)} + JSON.stringify({source: sourceFilePath, target: url,
        line: node.position?.start.line ?? null, column: node.position?.start.column ?? null}));
    }},
}, onBrokenAnchors: 'warn'};
`;
}

export function parseMarkdownDiagnostics(log) {
  if (!log.split(/\r?\n/).some(line => line.trim() === OBSERVER)) throw new Error('Markdown observer did not execute');
  const unique = new Map();
  for (const line of log.split(/\r?\n/)) {
    if (!line.includes(MARKER)) continue;
    if (!line.startsWith(MARKER)) throw new Error('Malformed Markdown diagnostic prefix');
    const row = JSON.parse(line.slice(MARKER.length));
    if (typeof row.source !== 'string' || !row.source || typeof row.target !== 'string' || !row.target
        || !Number.isInteger(row.line) || row.line < 1 || !Number.isInteger(row.column) || row.column < 1) {
      throw new Error('Malformed Markdown diagnostic');
    }
    // Client/server compilation can repeat the same source location. Preserve
    // distinct occurrences, but ignore line shifts when comparing revisions.
    unique.set(JSON.stringify(row), row);
  }
  return [...unique.values()].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
}

export function compareRows(candidate, baseline, key) {
  const remaining = new Map();
  for (const row of baseline) { const id = key(row); remaining.set(id, (remaining.get(id) ?? 0) + 1); }
  const added = []; let existing = 0;
  for (const row of candidate) {
    const id = key(row); const count = remaining.get(id) ?? 0;
    if (count) { existing++; remaining.set(id, count - 1); } else added.push(row);
  }
  return {added, existing, resolved: [...remaining.values()].reduce((a, b) => a + b, 0)};
}

function staticRows(report) {
  return report.inspection.missing_local_targets.flatMap(row => row.sources.map(source =>
    ({source, target: row.target, tag: row.tag, attribute: row.attribute})));
}

export function compareSite(candidate, baseline) {
  for (const report of [candidate, baseline]) {
    if (report.schema_version !== 1 || !report.routes?.length || !report.inspection?.documents?.length
        || !report.inspection.coverage.checked_local_references || !Array.isArray(report.markdown)
        || !Array.isArray(report.warnings?.links) || !Array.isArray(report.warnings?.anchors)) {
      throw new Error('Empty or malformed site coverage');
    }
  }
  const pair = row => JSON.stringify([row.source, row.target]);
  const results = {
    links: compareRows(candidate.warnings.links, baseline.warnings.links, pair),
    anchors: compareRows(candidate.warnings.anchors, baseline.warnings.anchors, pair),
    markdown: compareRows(candidate.markdown, baseline.markdown, pair),
    static_targets: compareRows(staticRows(candidate), staticRows(baseline), row => JSON.stringify([row.source, row.target, row.tag, row.attribute])),
    csv: compareRows(candidate.inspection.csv.flatMap(row => row.findings.map(finding => [row.file, finding])),
      baseline.inspection.csv.flatMap(row => row.findings.map(finding => [row.file, finding])), JSON.stringify),
  };
  // Route removal must be an explicit reviewed policy change, never a way to
  // make a warning disappear. M2/M3 will define approved URL transitions.
  const removedRoutes = baseline.routes.filter(route => !candidate.routes.includes(route));
  const removedHtml = baseline.inspection.documents.map(row => row.file)
    .filter(file => !candidate.inspection.documents.some(row => row.file === file));
  const removedCsv = baseline.inspection.csv.map(row => row.file)
    .filter(file => !candidate.inspection.csv.some(row => row.file === file));
  const formatting = compareFormatting(candidate.authored, baseline.authored);
  const selected = new Set(candidate.authored.documents.map(row => `${row.instance}\0${row.path}`));
  const lostInputs = baseline.authored.documents.filter(row => !selected.has(`${row.instance}\0${row.path}`));
  return {status: Object.values(results).some(row => row.added.length) || formatting.status === 'failed'
      || removedRoutes.length || removedHtml.length || removedCsv.length || lostInputs.length ? 'failed' : 'passed',
    diagnostics: results, formatting, removed_routes: removedRoutes,
    removed_html: removedHtml, removed_csv: removedCsv, lost_authored_inputs: lostInputs,
    policy: 'Fresh base-source comparison; no mutable warning-count allowlist. Route/input removals require explicit reviewed policy changes.'};
}

function run(cwd, executable, args, env, log) {
  const fd = log ? fs.openSync(log, 'wx') : null;
  let result;
  try {
    result = spawnSync(executable, args, {cwd, env, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
      stdio: fd === null ? 'pipe' : ['ignore', fd, fd]});
  } finally { if (fd !== null) fs.closeSync(fd); }
  if (result.status !== 0 || result.error) throw new Error(`${executable} ${args.join(' ')} failed (${result.status}): ${log ?? result.stderr ?? result.error}`);
  return result.stdout?.trim();
}

function manifest(root, names) {
  return names.map(name => ({path: name, sha256: hash(fs.readFileSync(path.join(root, name)))}));
}

export function outputDirectory(requested, siteDir) {
  const absolute = path.resolve(requested);
  let ancestor = path.dirname(absolute); const suffix = [path.basename(absolute)];
  while (!fs.existsSync(ancestor)) { suffix.unshift(path.basename(ancestor)); ancestor = path.dirname(ancestor); }
  const resolved = path.join(fs.realpathSync(ancestor), ...suffix);
  // Outputs under the source are only permitted in this explicitly ignored root.
  const within = (root, file) => file === root || file.startsWith(`${root}${path.sep}`);
  if (within(siteDir, resolved) && !resolved.startsWith(`${siteDir}${path.sep}.validation-results${path.sep}`)) {
    throw new Error('Results must be outside source or inside .validation-results/');
  }
  if (fs.existsSync(resolved) || (() => { try { fs.lstatSync(resolved); return true; } catch (error) { if (error.code === 'ENOENT') return false; throw error; } })()) {
    throw new Error('Results path already exists');
  }
  fs.mkdirSync(resolved, {recursive: true});
  return resolved;
}

export function captureSite({siteDir, outDir, env = controlledEnvironment(), configPath = path.join(siteDir, 'docusaurus.config.ts')}) {
  for (const name of ['node_modules', 'node_modules/.cache', '.docusaurus', 'build']) {
    const file = path.join(siteDir, name);
    if (fs.existsSync(file) && fs.realpathSync(file) !== file) throw new Error(`Refusing cache/output symlink traversal: ${name}`);
    try { if (fs.lstatSync(file).isSymbolicLink()) throw new Error(`Refusing cache/output symlink: ${name}`); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  fs.mkdirSync(outDir);
  const git = (...args) => run(siteDir, 'git', args, env);
  const names = git('ls-files', '-z').split('\0').filter(Boolean).sort();
  const before = manifest(siteDir, names);
  json(path.join(outDir, 'source-manifest.json'), before);
  const authoredFile = path.join(outDir, 'authored.json');
  run(siteDir, process.execPath, [path.join(here, 'validate-authored-content.mjs'), '--site-dir', siteDir, '--out', authoredFile], env, path.join(outDir, 'authored.log'));
  // Clear MDX/webpack caches so every diagnostic hook executes for both builds.
  const cli = path.join(siteDir, 'node_modules/@docusaurus/core/bin/docusaurus.mjs');
  run(siteDir, process.execPath, [cli, 'clear'], env, path.join(outDir, 'clear.log'));
  const config = path.join(outDir, 'observer.config.ts');
  fs.writeFileSync(config, observerConfig(configPath), {flag: 'wx'});
  // Docusaurus resolves preset/plugin names relative to the config directory.
  // Keep the execution copy beside the original, retaining its bytes in receipts.
  const executionConfig = path.join(path.dirname(configPath), `.migration-observer-${crypto.randomUUID()}.config.ts`);
  fs.copyFileSync(config, executionConfig, fs.constants.COPYFILE_EXCL);
  const start = new Date().toISOString();
  try {
    run(siteDir, process.execPath, [cli, 'build', '--config', executionConfig], env, path.join(outDir, 'build.log'));
  } finally { fs.unlinkSync(executionConfig); }
  const log = fs.readFileSync(path.join(outDir, 'build.log'), 'utf8');
  if (!log.includes('[SUCCESS] Generated static files')) throw new Error('Missing build success marker');
  if (JSON.stringify(before) !== JSON.stringify(manifest(siteDir, names))) throw new Error('Build changed tracked source');
  const generatedConfig = fs.readFileSync(path.join(siteDir, '.docusaurus/docusaurus.config.mjs'), 'utf8');
  const siteUrl = generatedConfig.match(/"url":\s*"([^"]+)"/)?.[1];
  if (!siteUrl) throw new Error('Cannot identify built site origin');
  const report = {schema_version: 1, source_commit: git('rev-parse', 'HEAD'), source_tree: git('rev-parse', 'HEAD^{tree}'),
    source_manifest_sha256: hash(JSON.stringify(before)), lock_sha256: hash(fs.readFileSync(path.join(siteDir, 'package-lock.json'))),
    node: process.version, npm: run(siteDir, 'npm', ['--version'], env), platform: process.platform, architecture: process.arch,
    started_at: start, finished_at: new Date().toISOString(),
    observer: 'v1: warn severities and reporting-only Markdown hook; original URLs preserved; compiler caches cleared',
    warnings: parseBuildWarnings(log), markdown: parseMarkdownDiagnostics(log),
    routes: Object.keys(JSON.parse(fs.readFileSync(path.join(siteDir, '.docusaurus/routesChunkNames.json'), 'utf8'))).sort(),
    authored: JSON.parse(fs.readFileSync(authoredFile, 'utf8')),
    inspection: inspectBuild(path.join(siteDir, 'build'), siteUrl)};
  json(path.join(outDir, 'report.json'), report);
  json(path.join(outDir, 'build-manifest.json'), manifest(path.join(siteDir, 'build'),
    walkFiles(path.join(siteDir, 'build')).map(file => path.relative(path.join(siteDir, 'build'), file))));
  return report;
}

export function main(argv = process.argv.slice(2)) {
  const {values} = parseArgs({args: argv, options: {'site-dir': {type: 'string', default: process.cwd()},
    'baseline-ref': {type: 'string', default: process.env.MIGRATION_BASE_SHA}, out: {type: 'string', default: '.validation-results/site'},
    'allow-dirty': {type: 'boolean', default: false}}});
  if (!/^[a-f0-9]{40}$/.test(values['baseline-ref'] ?? '')) throw new Error('Pass an immutable 40-character baseline commit via --baseline-ref or MIGRATION_BASE_SHA');
  const siteDir = fs.realpathSync(values['site-dir']);
  const env = controlledEnvironment();
  const git = (...args) => run(siteDir, 'git', args, env);
  if (git('rev-parse', '--is-shallow-repository') !== 'false') throw new Error('Full Git history required');
  const toolNames = ['validate-site.mjs', 'validate-source-state.mjs', 'validate-authored-content.mjs', 'migration-baseline.mjs'];
  const sourceOptions = {siteDir, env, toolPaths: toolNames.map(name => path.join(here, name))};
  const initialState = sourceState(sourceOptions);
  const status = initialState.status;
  if (status && !values['allow-dirty']) throw new Error('Clean candidate required; --allow-dirty is development evidence only');
  const base = git('rev-parse', `${values['baseline-ref']}^{commit}`);
  const out = outputDirectory(path.resolve(siteDir, values.out), siteDir);
  const temp = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'prebid-base-'));
  const baseDir = path.join(temp, 'source');
  json(path.join(out, 'initial-source-state.json'), initialState);
  json(path.join(out, 'execution.json'), {schema_version: 1, head: initialState.head, baseline: base,
    initial_status: status, development_dirty_run: Boolean(status), node: process.version,
    platform: process.platform, architecture: process.arch, environment: env,
    tool_hashes: manifest(here, toolNames)});
  try {
    console.log(`Preparing baseline ${base}`);
    run(siteDir, 'git', ['clone', '--shared', '--no-checkout', '--quiet', siteDir, baseDir], env);
    run(baseDir, 'git', ['checkout', '--quiet', '--detach', base], env);
    run(baseDir, 'npm', ['ci', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund', '--cache', path.join(temp, 'npm-cache')], env, path.join(out, 'baseline-install.log'));
    console.log('Validating and building baseline');
    const baseline = captureSite({siteDir: baseDir, outDir: path.join(out, 'baseline'), env});
    json(path.join(out, 'source-before-candidate.json'), assertSourceUnchanged(initialState, sourceState(sourceOptions), 'before candidate'));
    console.log('Validating and building candidate');
    const candidate = captureSite({siteDir, outDir: path.join(out, 'candidate'), env});
    const comparison = compareSite(candidate, baseline);
    json(path.join(out, 'source-before-verdict.json'), assertSourceUnchanged(initialState, sourceState(sourceOptions), 'before verdict'));
    json(path.join(out, 'comparison.json'), comparison);
    json(path.join(out, 'receipt-manifest.json'), manifest(out, walkFiles(out).map(file => path.relative(out, file))));
    console.log(JSON.stringify({status: comparison.status, baseline: base, candidate: candidate.source_commit,
      authored: candidate.authored.coverage, routes: candidate.routes.length,
      new_diagnostics: Object.fromEntries(Object.entries(comparison.diagnostics).map(([key, row]) => [key, row.added.length])),
      new_formatting: comparison.formatting.new_findings.length, output: out}));
    if (comparison.status !== 'passed') process.exitCode = 1;
    return comparison;
  } catch (error) {
    json(path.join(out, 'failure.json'), {status: 'incomplete', error: error.message});
    throw error;
  } finally { fs.rmSync(temp, {recursive: true, force: true}); }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
