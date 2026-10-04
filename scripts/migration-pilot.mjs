#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync, spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';
import {createRequire} from 'node:module';
import {INPUT_PATHS, PILOT_SOURCES, CSV_BIDDERS, convertDocument, projectPilotCsv, applyRepair, sha256} from './migration-convert.mjs';
import {parseMetadata, validateMetadata} from './migration-metadata.mjs';
import {planStaging, applyStaging} from './migration-staging.mjs';
import {checkPilot, verifyPilotExpectations} from './migration-pilot-checks.mjs';
import {validateAuthoredContent} from './validate-authored-content.mjs';

const require = createRequire(import.meta.url);
const {validateConfig} = require('@docusaurus/core/lib/server/configValidation.js');
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const selection = JSON.parse(fs.readFileSync(path.join(repo, 'migration/m2-pilot.json'), 'utf8'));

export function pinnedSources(label) {
  const snapshot = selection.snapshots[label];
  if (!snapshot || !/^[a-f0-9]{40}$/.test(snapshot.commit)) throw new Error('Unknown immutable source selection');
  const sources = {};
  for (const name of INPUT_PATHS) {
    const text = execFileSync('git', ['show', `${snapshot.commit}:${name}`], {cwd: repo, encoding: 'utf8'});
    if (sha256(text) !== snapshot.inputs[name]) throw new Error(`Source hash mismatch: ${label}:${name}`);
    sources[name] = text;
  }
  return sources;
}

export function convertSlice(label, {sources = pinnedSources(label), repair = true} = {}) {
  const snapshot = selection.snapshots[label];
  const documents = PILOT_SOURCES.slice(0, 6).map(sourcePath => {
    const result = convertDocument({sourcePath, sources, sourceCommit: snapshot.commit, adapterHashes: snapshot.adapterHashes});
    return repair ? applyRepair(result) : result;
  });
  const csv = projectPilotCsv({sources});
  const files = [...documents.flatMap(row => row.files), {path: PILOT_SOURCES[6], content: csv}];
  const semanticFiles = inspectEmitted(files);
  const metadataPaths = [...new Set([...PILOT_SOURCES.slice(0, 6), ...CSV_BIDDERS.map(name => `dev-docs/bidders/${name}.md`)])];
  const metadata = metadataPaths.map(sourcePath => {
    const record = parseMetadata(sources[sourcePath], {sourcePath, sourceCommit: snapshot.commit});
    return {record, validation: validateMetadata(record, {source: sources[sourcePath]})};
  });
  const metadataPreservation = checkEmittedMetadata(files, metadata);
  return {files, semanticFiles, documents, metadata, metadataPreservation};
}

// Read the artifacts being compiled, not the converter's parallel semanticText.
// Only the exact, bounded wrapper composition is supported; no MDX evaluation.
export function inspectEmitted(files) {
  const byPath = new Map(files.map(file => [file.path, file.content]));
  if (byPath.size !== files.length || byPath.size !== 9) throw new Error('Expected nine unique emitted pilot files');
  const read = name => {
    const content = byPath.get(name);
    if (typeof content !== 'string' || !content.trim()) throw new Error(`Missing emitted file: ${name}`);
    return content;
  };
  const result = {};
  for (const sourcePath of PILOT_SOURCES) {
    if (sourcePath !== PILOT_SOURCES[4]) {result[sourcePath] = read(sourcePath); continue;}
    const wrapper = read(sourcePath.replace(/\.md$/, '.mdx'));
    const match = /^(---\r?\n[\s\S]*?\r?\n---\r?\n)\nimport Before from '\.\/_ios-sdk-integration-gam-before.md';\nimport After from '\.\/_ios-sdk-integration-gam-after.md';\nimport Tabs from '@theme\/Tabs';\nimport TabItem from '@theme\/TabItem';\n\n<Before \/>\n\n(<Tabs[\s\S]*<\/Tabs>)\n\n<After \/>\n$/.exec(wrapper);
    if (!match) throw new Error('Unreviewed Mobile wrapper composition: manual review required');
    const dir = path.posix.dirname(sourcePath);
    result[sourcePath] = match[1] + read(`${dir}/_ios-sdk-integration-gam-before.md`) + '\n' + match[2]
      + '\n' + read(`${dir}/_ios-sdk-integration-gam-after.md`);
  }
  return result;
}

export function checkEmittedMetadata(files, sourceRecords) {
  const emitted = inspectEmitted(files);
  return PILOT_SOURCES.slice(0, 6).map(sourcePath => {
    const source = sourceRecords.find(row => row.record.provenance.source_path === sourcePath)?.record;
    if (!source) throw new Error(`No source metadata: ${sourcePath}`);
    const actual = parseMetadata(emitted[sourcePath], {sourcePath, sourceCommit: source.provenance.source_commit});
    const preserved = ['raw', 'opening', 'closing'].every(key => actual.frontmatter[key] === source.frontmatter[key]);
    return {sourcePath, preserved};
  });
}

export async function compileSlice(root, files, label = 'B') {
  const staged = files.map(file => ({path: `content/${file.path}`, content: file.content}));
  for (const [name, hash] of Object.entries(selection.snapshots[label].assets)) {
    const bytes = execFileSync('git', ['show', `${selection.snapshots[label].commit}:${name}`], {cwd: repo});
    if (sha256(bytes) !== hash) throw new Error(`Asset hash mismatch: ${name}`);
    staged.push({path: `static/${name}`, content: bytes});
  }
  staged.push({path: '.markdownlint.json', content: '{"default":true}\n'});
  applyStaging(planStaging({root, files: staged, provenance: {kind: 'isolated-pilot-parser-fixture'}}));
  const siteConfig = validateConfig({title: 'M2 isolated pilot', url: 'https://example.test', baseUrl: '/',
    presets: [['classic', {docs: {path: 'content'}, pages: false, blog: false}]],
    markdown: {format: 'detect'}}, 'm2-pilot');
  const report = await validateAuthoredContent({siteDir: root, siteConfig});
  const emittedHashes = Object.fromEntries(staged.map(file => {
    const bytes = fs.readFileSync(path.join(root, file.path));
    if (sha256(bytes) !== sha256(file.content)) throw new Error(`Staged input changed: ${file.path}`);
    return [file.path, sha256(bytes)];
  }));
  return {...report, emitted_sha256: emittedHashes, input_bytes_unchanged: true};
}

// Compare an actual known generated A with a deliberate local repair, then B.
// Do not pretend generated A was the ancestor of the existing migration tree.
export function reconcileReplay(before, local, after, directory) {
  fs.mkdirSync(directory, {recursive: true});
  const results = {};
  const conflicts = [];
  for (const name of PILOT_SOURCES) {
    const paths = ['local', 'base', 'upstream'].map(part => path.join(directory, part));
    [local[name], before[name], after[name]].forEach((text, index) => fs.writeFileSync(paths[index], text));
    const merge = spawnSync('git', ['merge-file', '-p', ...paths], {encoding: 'utf8', maxBuffer: 4 * 1024 * 1024});
    if (merge.error || merge.status === null || merge.status > 127) throw merge.error ?? new Error(merge.stderr);
    if (merge.status !== 0) conflicts.push(name);
    results[name] = merge.stdout;
  }
  return {files: results, conflicts, selected: Object.keys(results).length};
}

function currentMigrationSources() {
  const mapped = {
    [PILOT_SOURCES[0]]: 'docs/dev-docs/prebidjs/bidders/appnexus.mdx',
    [PILOT_SOURCES[1]]: 'docs/dev-docs/prebidjs/bidders/bidsxchange.mdx',
    [PILOT_SOURCES[2]]: 'docs/dev-docs/prebidjs/modules/tcfControl.mdx',
    [PILOT_SOURCES[3]]: 'docs/dev-docs/prebidjs/modules/permutiveRtdProvider.md',
    [PILOT_SOURCES[4]]: 'docs/dev-docs/prebid-mobile/modules/rendering/ios-sdk-integration-gam.mdx',
    [PILOT_SOURCES[5]]: 'docs/dev-docs/prebidjs/examples/basic-example.mdx',
    [PILOT_SOURCES[6]]: 'dev-docs/bidder-data.csv',
  };
  return Object.fromEntries(Object.entries(mapped).map(([original, name]) => [original,
    execFileSync('git', ['show', `${selection.migration_commit}:${name}`], {cwd: repo, encoding: 'utf8'})]));
}

export async function runPilot(out) {
  if (fs.existsSync(out)) throw new Error('Use a new output directory; historical receipts must not be overwritten');
  const parent = fs.realpathSync(path.dirname(path.resolve(out)));
  const allowed = [fs.realpathSync(os.tmpdir()), fs.realpathSync('/tmp'), path.join(repo, '.validation-results')];
  if (!allowed.some(root => parent === root || parent.startsWith(root + path.sep))) throw new Error('Pilot output must be under the system temporary directory or .validation-results');
  out = path.join(parent, path.basename(out));
  const expectationVerification = verifyPilotExpectations({repoDir: repo});
  const sourcesA = pinnedSources('A'); const sourcesB = pinnedSources('B');
  const a = convertSlice('A', {sources: sourcesA, repair: false});
  const local = convertSlice('A', {sources: sourcesA});
  const b = convertSlice('B', {sources: sourcesB, repair: false});
  const regenerated = convertSlice('B', {sources: sourcesB});
  fs.mkdirSync(out);
  const replay = reconcileReplay(a.semanticFiles, local.semanticFiles, b.semanticFiles, path.join(out, 'merge-inputs'));
  const changes = Object.fromEntries(INPUT_PATHS.filter(name => sourcesA[name] !== sourcesB[name])
    .map(name => [name, {before: sha256(sourcesA[name]), after: sha256(sourcesB[name])}]));
  const repair = ['mobile-rewarded-process-typo'];
  const baseChecks = await checkPilot({sourceCommit: selection.snapshots.A.commit, files: local.semanticFiles, migrationOverrides: repair});
  const replayChecks = await checkPilot({sourceCommit: selection.snapshots.B.commit, files: replay.files, migrationOverrides: repair});
  const regeneratedChecks = await checkPilot({sourceCommit: selection.snapshots.B.commit, files: regenerated.semanticFiles, migrationOverrides: repair});
  const currentChecks = await checkPilot({sourceCommit: selection.snapshots.B.commit, files: currentMigrationSources()});
  const changedInclude = '_includes/dev-docs/vendor-exception.md';
  const syntheticSources = {...sourcesB, [changedInclude]: sourcesB[changedInclude].replace('Prebid.org recommends', 'Synthetic replay notice: Prebid.org recommends')};
  const synthetic = convertSlice('B', {sources: syntheticSources});
  const includeChecks = await checkPilot({sourceCommit: selection.snapshots.B.commit, files: synthetic.semanticFiles,
    migrationOverrides: repair, includeOverrides: {[changedInclude]: syntheticSources[changedInclude]}});
  const includeAffected = PILOT_SOURCES.filter(name => regenerated.semanticFiles[name] !== synthetic.semanticFiles[name]);
  fs.mkdirSync(path.join(out, 'site'));
  const compiler = await compileSlice(path.join(out, 'site'), regenerated.files);
  const report = {schema_version: 1, kind: 'bounded-m2-pilot', status: 'observations',
    source_pins: selection.snapshots, migration_commit: selection.migration_commit,
    environment: {node: process.version, platform: process.platform, arch: process.arch},
    tool_hashes: Object.fromEntries(['migration-convert.mjs', 'migration-metadata.mjs', 'migration-staging.mjs', 'migration-pilot-checks.mjs', 'migration-pilot.mjs']
      .map(name => [name, sha256(fs.readFileSync(path.join(repo, 'scripts', name)))])),
    lock_sha256: sha256(fs.readFileSync(path.join(repo, 'package-lock.json'))),
    expectation_verification: expectationVerification, real_input_changes: changes,
    selection: {source_documents: 6, csv_templates: 1, csv_bidders: 5, staged_files: regenerated.files.length},
    controlled_replay: {conflicts: replay.conflicts, source_A: baseChecks, reconciliation: replayChecks, regeneration: regeneratedChecks},
    existing_migration_observation: {checks: currentChecks, limit: 'Source text only; imported components are not expanded. Not a rendered-parity verdict or a fabricated three-way ancestor.'},
    synthetic_shared_include: {affected: includeAffected, checks: includeChecks},
    compiler, metadata: regenerated.metadata, emitted_metadata: regenerated.metadataPreservation,
    decision: 'Use staged regeneration for the reviewed pilot-owned source outputs, with explicit repairs and manual reconciliation against existing migration work. Both controlled methods are viable; this does not authorize wholesale regeneration.',
    limits: ['Full M2 policy acceptance remains pending', 'No public-route or asset-resolution proof',
      'No Jekyll runtime comparison, browser hydration, service/backend calls, deployment, or full-corpus selection',
      'Git merge-file conflict count measures textual conflicts, not reviewer time or semantic correctness']};
  const checks = [baseChecks, replayChecks, regeneratedChecks, includeChecks];
  report.status = checks.every(check => check.status === 'passed') && !replay.conflicts.length
    && regenerated.metadata.length === 9 && regenerated.metadata.every(row => row.validation.valid)
    && regenerated.metadataPreservation.length === 6 && regenerated.metadataPreservation.every(row => row.preserved)
    && compiler.compilation_failures === 0 && compiler.coverage.compilation_units === 8
    && JSON.stringify(includeAffected) === JSON.stringify(PILOT_SOURCES.slice(2, 4)) ? 'passed_bounded_pilot' : 'failed';
  if (report.status === 'failed') report.decision = 'Pending: failed pilot evidence does not establish a usable reconciliation mechanism.';
  fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  fs.writeFileSync(path.join(out, 'semantic-files.json'), JSON.stringify(regenerated.semanticFiles, null, 2) + '\n');
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const {values} = parseArgs({options: {out: {type: 'string'}}, strict: true});
    if (!values.out) throw new Error('--out is required');
    const report = await runPilot(values.out);
    console.log(JSON.stringify({status: report.status, selection: report.selection, report: path.resolve(values.out, 'report.json')}, null, 2));
    if (report.status === 'failed') process.exitCode = 1;
  } catch (error) { console.error(error.stack); process.exitCode = 1; }
}
