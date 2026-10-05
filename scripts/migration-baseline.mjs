#!/usr/bin/env node
// Capture a control build; findings are observations, not a launch-readiness gate.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';

const require = createRequire(import.meta.url);
const {load} = require('cheerio');
const sha256 = data => crypto.createHash('sha256').update(data).digest('hex');
const relative = (root, file) => path.relative(root, file).split(path.sep).join('/');
const sorted = values => [...values].sort((a, b) => a.localeCompare(b, 'en'));

export function walkFiles(root) {
  const files = [];
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
      const file = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Unsupported symlink: ${file}`);
      if (entry.isDirectory()) visit(file);
      else if (entry.isFile()) files.push(file);
    }
  }
  visit(root);
  return sorted(files);
}

export function parseBuildWarnings(log) {
  const text = log.replace(/\u001b\[[0-9;]*m/g, '');
  const result = {links: [], anchors: []};
  const seen = new Set();
  let section;
  let page; let pageTargets = 0; let listing = false;
  const closePage = () => {
    if (page && !pageTargets) throw new Error(`Unparsed warning block for ${page}`);
  };
  for (const line of text.split(/\r?\n/)) {
    if (line.includes('Docusaurus found broken')) {
      const header = line.match(/^(?:\[WARNING\] )?Docusaurus found broken (links|anchors)!$/);
      if (!header) throw new Error('Unrecognized broken-warning header');
      closePage(); section = header[1]; page = undefined; pageTargets = 0;
      listing = false; seen.add(section); continue;
    }
    if (/^\[(?:SUCCESS|ERROR|INFO|WARNING)\]/.test(line)) {
      closePage(); section = undefined; page = undefined; listing = false;
    }
    if (/^Exhaustive list of all broken/.test(line)) {
      if (!section || line !== `Exhaustive list of all broken ${section} found:`) throw new Error('Unrecognized warning inventory heading');
      listing = true; continue;
    }
    if (!section) continue;
    const source = line.match(/^- Broken (?:link|anchor) on source page path = (.+):$/);
    if (source) {
      if (!listing) throw new Error('Warning block outside exhaustive inventory');
      closePage(); page = source[1]; pageTargets = 0; continue;
    }
    const target = line.match(/^\s{3}-> linking to (.+)$/);
    if (target) {
      if (!page) throw new Error('Warning target has no source page');
      result[section].push({source: page, target: target[1]});
      pageTargets++; continue;
    }
    if (listing && line.trim()) throw new Error(`Unparsed warning inventory line: ${line}`);
  }
  closePage();
  for (const kind of seen) {
    if (!result[kind].length) throw new Error(`Unparsed ${kind} warning section`);
  }
  for (const kind of Object.keys(result)) {
    result[kind].sort((a, b) => `${a.source}\0${a.target}`.localeCompare(`${b.source}\0${b.target}`, 'en'));
  }
  return result;
}

export function parseCsv(text) {
  const rows = []; let row = []; let field = ''; let quoted = false; let closed = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (char === '"') { quoted = false; closed = true; }
      else field += char;
    } else if (char === '"') {
      if (field || closed) throw new Error('Quote inside unquoted CSV field');
      quoted = true;
    } else if (char === ',') {
      row.push(field); field = ''; closed = false;
    } else if (char === '\r' || char === '\n') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = ''; closed = false;
    } else {
      if (closed) throw new Error('Characters after quoted CSV field');
      field += char;
    }
  }
  if (quoted) throw new Error('Unterminated CSV quote');
  if (row.length || field || closed) { row.push(field); rows.push(row); }
  return rows;
}

export function inspectCsv(text) {
  const findings = [];
  if (/^---\r?\n/.test(text)) findings.push('unrendered_frontmatter');
  if (/\{%|\{\{\s*(?:page|site)\./.test(text)) findings.push('unrendered_liquid');
  if (findings.length) return {findings, rows: null, columns: null};
  try {
    const rows = parseCsv(text);
    const nonempty = rows.slice(1).filter(row => row.some(field => field.trim()));
    if (rows.slice(1).length !== nonempty.length) findings.push('blank_data_row');
    if (!nonempty.length) findings.push('no_data_rows');
    if (rows.some(row => row.length !== rows[0].length)) findings.push('inconsistent_column_count');
    return {findings, rows: Math.max(0, rows.length - 1), columns: rows[0] ?? []};
  } catch (error) {
    return {findings: ['csv_parse_error'], error: error.message, rows: null, columns: null};
  }
}

function pagePath(file) {
  if (file === 'index.html') return '/';
  if (file.endsWith('/index.html')) return `/${file.slice(0, -'index.html'.length)}`;
  return `/${file}`;
}

export function inspectBuild(buildDir, siteUrl) {
  const files = walkFiles(buildDir);
  const htmlFiles = files.filter(file => file.endsWith('.html'));
  if (!htmlFiles.length) throw new Error('No HTML inputs: an empty build is not a baseline');
  const origin = new URL(siteUrl).origin;
  const fileSet = new Set(files.map(file => relative(buildDir, file)));
  const documents = [];
  const csv = [];
  const missing = new Map();
  let references = 0;
  let checkedLocalReferences = 0;
  let externalReferences = 0;
  const resourceExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg', '.ico',
    '.js', '.mjs', '.css', '.map', '.json', '.csv', '.tsv', '.xml', '.txt', '.pdf', '.zip', '.gz',
    '.mp4', '.webm', '.mp3', '.wav', '.woff', '.woff2', '.ttf', '.otf']);
  function localExists(urlPath, allowPageAlternatives) {
    let decoded;
    try { decoded = decodeURIComponent(urlPath).replace(/^\/+/, ''); } catch { return false; }
    // Static-host candidates only; actual deployed host redirects remain untested.
    if (fileSet.has(decoded)) return true;
    if (!allowPageAlternatives) return false;
    return [decoded, `${decoded.replace(/\/$/, '')}/index.html`, `${decoded}.html`,
      decoded ? null : 'index.html'].some(candidate => candidate !== null && fileSet.has(candidate));
  }
  for (const file of htmlFiles) {
    const output = relative(buildDir, file);
    const route = pagePath(output);
    const $ = load(fs.readFileSync(file, 'utf8'));
    const ids = sorted(new Set($('[id]').map((_, el) => $(el).attr('id')).get()));
    const article = $('article').first();
    const content = article.length ? article : $('main').first();
    const normalized = content.text().replace(/\s+/g, ' ').trim();
    documents.push({file: output, route, title: $('title').text(),
      canonical: $('link[rel="canonical"]').attr('href') ?? null,
      robots: $('meta[name="robots"]').attr('content') ?? null,
      ids, article_text_sha256: sha256(normalized), article_text_characters: normalized.length,
      code_sha256: $('pre').map((_, el) => sha256($(el).text())).get(),
      last_updated: $('time').map((_, el) => $(el).attr('datetime')).get()});
    $('[href], [src], [poster]').each((_, el) => {
      for (const attribute of ['href', 'src', 'poster']) {
        const value = $(el).attr(attribute);
        if (value === undefined) continue;
        references++;
        if (!value || /^(?:#|mailto:|tel:|javascript:|data:|blob:)/i.test(value)) continue;
        let url;
        try { url = new URL(value, new URL(route, siteUrl)); } catch { continue; }
        if (!/^https?:$/.test(url.protocol)) continue;
        if (url.origin !== origin) { externalReferences++; continue; }
        checkedLocalReferences++;
        const extension = path.posix.extname(url.pathname).toLowerCase();
        const relation = ($(el).attr('rel') ?? '').split(/\s+/);
        const metadataPage = el.tagName === 'link' && (relation.includes('canonical')
          || (relation.includes('alternate') && $(el).attr('hreflang') !== undefined));
        const navigation = attribute === 'href' && (metadataPage
          || (['a', 'area'].includes(el.tagName) && $(el).attr('download') === undefined
            && !resourceExtensions.has(extension)));
        if (localExists(url.pathname, navigation)) continue;
        const key = `${el.tagName}\0${attribute}\0${url.pathname}`;
        if (!missing.has(key)) missing.set(key, {tag: el.tagName, attribute, target: url.pathname, sources: new Set()});
        missing.get(key).sources.add(route);
      }
    });
  }
  for (const file of files.filter(file => file.endsWith('.csv'))) {
    const bytes = fs.readFileSync(file);
    csv.push({file: relative(buildDir, file), sha256: sha256(bytes), bytes: bytes.length,
      ...inspectCsv(bytes.toString('utf8'))});
  }
  return {
    coverage: {files: files.length, html: htmlFiles.length, references,
      checked_local_references: checkedLocalReferences, external_references_not_checked: externalReferences},
    documents,
    missing_local_targets: [...missing.values()].map(row => ({...row, sources: sorted(row.sources)}))
      .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b), 'en')),
    csv,
    limitations: [
      'Static output inspection; no browser hydration, hosted redirect, or network checks.',
      'Checks href/src/poster attributes; does not parse srcset or CSS url() references.',
      'Fragments are inventoried as IDs, not independently resolved here; Docusaurus warning pairs are separate.',
      'Text/code hashes support regression comparison, not independent legacy-content fidelity.',
      'CSV checks establish syntax/template leakage only; expected field semantics require reference cases.',
      'Static path alternatives approximate common hosting layouts; deployed-host behavior remains unverified.',
    ],
  };
}

export function controlledEnvironment(inherited = process.env) {
  const forbidden = Object.keys(inherited).filter(key => key.startsWith('DOCUSAURUS_') || key === 'NODE_OPTIONS');
  if (forbidden.length) throw new Error(`Unrecorded build overrides are forbidden: ${forbidden.join(', ')}`);
  return {PATH: `${path.dirname(process.execPath)}:/usr/bin:/bin:/usr/sbin:/sbin`,
    HOME: os.homedir(), TMPDIR: os.tmpdir(), CI: 'true', NODE_ENV: 'production',
    TZ: 'UTC', LANG: 'C', LC_ALL: 'C', NO_UPDATE_NOTIFIER: '1',
    GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null'};
}

function command(cwd, executable, args, env) {
  const result = spawnSync(executable, args, {cwd, env, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024});
  if (result.status !== 0 || result.error) throw new Error(`${executable} ${args.join(' ')} failed: ${result.stderr || result.error}`);
  return result.stdout;
}
function writeJson(file, object) { fs.writeFileSync(file, `${JSON.stringify(object, null, 2)}\n`); }
function fileManifest(root, files) {
  return files.map(name => {
    const file = path.join(root, name); const stat = fs.lstatSync(file);
    if (!stat.isFile()) throw new Error(`Non-regular source/artifact: ${name}`);
    const bytes = fs.readFileSync(file);
    return {path: name, bytes: bytes.length, sha256: sha256(bytes)};
  });
}

function resolveReceiptPath(outDir, siteDir) {
  const absolute = path.resolve(outDir);
  try {
    fs.lstatSync(absolute);
    throw new Error('Output already exists; use a new receipt directory');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  let ancestor = path.dirname(absolute);
  const missing = [path.basename(absolute)];
  while (!fs.existsSync(ancestor)) {
    // A dangling symlink is not a safe missing directory to create through.
    try {
      fs.lstatSync(ancestor);
      throw new Error('Output ancestor is a dangling symlink');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    missing.unshift(path.basename(ancestor));
    ancestor = path.dirname(ancestor);
  }
  const resolved = path.join(fs.realpathSync(ancestor), ...missing);
  const relOut = path.relative(siteDir, resolved);
  if (!relOut.startsWith(`..${path.sep}`) && relOut !== '..') throw new Error('Output must be outside the control checkout');
  return resolved;
}

export function capture({siteDir, outDir, siteUrl, npmCache}) {
  const toolHash = sha256(fs.readFileSync(fileURLToPath(import.meta.url)));
  const env = controlledEnvironment();
  siteDir = fs.realpathSync(siteDir);
  outDir = resolveReceiptPath(outDir, siteDir);
  const git = (...args) => command(siteDir, 'git', args, env).trim();
  if (git('status', '--porcelain', '--untracked-files=all')) throw new Error('Control checkout must be clean, including untracked inputs');
  if (git('rev-parse', '--is-shallow-repository') !== 'false') throw new Error('Full history required for this control');
  const sha = git('rev-parse', 'HEAD');
  const sourceFiles = command(siteDir, 'git', ['ls-files', '-z'], env).split('\0').filter(Boolean).sort();
  if (!sourceFiles.length) throw new Error('No tracked source inputs');
  const source = fileManifest(siteDir, sourceFiles);
  fs.mkdirSync(outDir, {recursive: true});
  fs.copyFileSync(fileURLToPath(import.meta.url), path.join(outDir, 'capture-tool.mjs'));
  writeJson(path.join(outDir, 'source-manifest.json'), source);
  const lock = fs.readFileSync(path.join(siteDir, 'package-lock.json'));
  const installArgs = ['ci', '--offline', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund', '--cache', path.resolve(npmCache)];
  const installFd = fs.openSync(path.join(outDir, 'install.log'), 'w');
  const install = spawnSync('npm', installArgs, {cwd: siteDir, env, stdio: ['ignore', installFd, installFd]});
  fs.closeSync(installFd);
  writeJson(path.join(outDir, 'install.json'), {command: ['npm', ...installArgs], exit_code: install.status,
    policy: 'offline locked reinstall including dev dependencies; lifecycle scripts disabled; populated cache required',
    fresh_network_install: false, error: install.error?.message ?? null});
  if (install.status !== 0) throw new Error('Locked reinstall failed; inspect install.log');
  fs.writeFileSync(path.join(outDir, 'dependency-tree.json'), command(siteDir, 'npm', ['ls', '--all', '--json'], env));
  const start = new Date().toISOString();
  const stdout = fs.openSync(path.join(outDir, 'build.log'), 'w');
  const result = spawnSync(process.execPath,
    [path.join(siteDir, 'node_modules/@docusaurus/core/bin/docusaurus.mjs'), 'build'],
    {cwd: siteDir, stdio: ['ignore', stdout, stdout], env});
  fs.closeSync(stdout);
  const end = new Date().toISOString();
  const log = fs.readFileSync(path.join(outDir, 'build.log'), 'utf8');
  const sourceAfter = fileManifest(siteDir, sourceFiles);
  const statusAfter = git('status', '--porcelain', '--untracked-files=all');
  const sourceUnchanged = JSON.stringify(source) === JSON.stringify(sourceAfter) && !statusAfter;
  const execution = {schema_version: 1, source_commit: sha, source_tree: git('rev-parse', 'HEAD^{tree}'),
    source_manifest_sha256: sha256(fs.readFileSync(path.join(outDir, 'source-manifest.json'))),
    lock_sha256: sha256(lock), tool_sha256: toolHash,
    tool_unchanged: toolHash === sha256(fs.readFileSync(fileURLToPath(import.meta.url))),
    node: process.version, npm: command(siteDir, 'npm', ['--version'], env).trim(),
    platform: process.platform, architecture: process.arch, os_release: os.release(),
    full_history: true, command: ['node', 'node_modules/@docusaurus/core/bin/docusaurus.mjs', 'build'],
    environment: env, started_at: start, finished_at: end,
    exit_code: result.status, signal: result.signal, error: result.error?.message ?? null,
    source_unchanged: sourceUnchanged, status_after: statusAfter,
    success_banner: /\[SUCCESS\] Generated static files/.test(log), evidence_scope: 'local_control_build'};
  writeJson(path.join(outDir, 'execution.json'), execution);
  if (result.status !== 0 || !execution.success_banner || !sourceUnchanged || !execution.tool_unchanged) throw new Error('Control build failed or changed its source/tool; inspect execution.json');
  const warnings = parseBuildWarnings(log);
  writeJson(path.join(outDir, 'warnings.json'), warnings);
  const routeFile = path.join(siteDir, '.docusaurus/routesChunkNames.json');
  const routes = sorted(Object.keys(JSON.parse(fs.readFileSync(routeFile, 'utf8'))));
  if (!routes.length) throw new Error('No route inputs');
  writeJson(path.join(outDir, 'routes.json'), routes);
  const inspection = inspectBuild(path.join(siteDir, 'build'), siteUrl);
  writeJson(path.join(outDir, 'rendered.json'), inspection);
  const builtFiles = walkFiles(path.join(siteDir, 'build')).map(file => relative(path.join(siteDir, 'build'), file));
  writeJson(path.join(outDir, 'build-manifest.json'), fileManifest(path.join(siteDir, 'build'), builtFiles));
  const metadataPath = path.join(siteDir, '.docusaurus/site-metadata.json');
  fs.copyFileSync(metadataPath, path.join(outDir, 'site-metadata.json'));
  fs.copyFileSync(path.join(siteDir, '.docusaurus/globalData.json'), path.join(outDir, 'global-data.json'));
  const summary = {schema_version: 1, source_commit: sha, source_files: source.length,
    docusaurus: JSON.parse(fs.readFileSync(metadataPath, 'utf8')).docusaurusVersion,
    routes: routes.length, route_inventory_kind: 'internal-chunk-keys-not-public-paths', ...inspection.coverage,
    broken_link_references: warnings.links.length, broken_anchor_references: warnings.anchors.length,
    missing_local_target_groups: inspection.missing_local_targets.length,
    csv_files_with_findings: inspection.csv.filter(row => row.findings.length).length,
    capture_status: 'complete', site_readiness: 'not_assessed_by_capture', hosted_ci: 'not_run'};
  writeJson(path.join(outDir, 'summary.json'), summary);
  writeJson(path.join(outDir, 'receipt-manifest.json'), fileManifest(outDir, sorted(fs.readdirSync(outDir))));
  return summary;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const {values} = parseArgs({options: {'site-dir': {type: 'string'}, out: {type: 'string'}, 'site-url': {type: 'string'}, 'npm-cache': {type: 'string'}}});
    if (!values['site-dir'] || !values.out || !values['site-url'] || !values['npm-cache']) throw new Error('Required: --site-dir PATH --out NEW_PATH --site-url URL --npm-cache PATH');
    console.log(JSON.stringify(capture({siteDir: values['site-dir'], outDir: values.out, siteUrl: values['site-url'], npmCache: values['npm-cache']}), null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
