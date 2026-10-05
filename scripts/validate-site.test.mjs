import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import childProcess, {spawnSync} from 'node:child_process';
import {syncBuiltinESMExports} from 'node:module';
import {fileURLToPath} from 'node:url';
import {MARKER, CLEANUP_TARGETS, parseMarkdownDiagnostics, compareSite, outputDirectory, captureSite,
  prepareSource, visibleSourceManifest, bindAuthoredInputs, assertSafeCleanupPaths, assertCleanupComplete} from './validate-site.mjs';
import {controlledEnvironment} from './migration-baseline.mjs';

const repository = fileURLToPath(new URL('../', import.meta.url));
const observer = 'MIGRATION_OBSERVER_V1';
const logRow = row => MARKER + JSON.stringify(row);
const clone = value => structuredClone(value);

function temporaryRoot(t, name) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), name)));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  return root;
}

test('Markdown diagnostics deduplicate compiler repeats but preserve distinct source occurrences', () => {
  const first = {source: 'docs/one.md', target: './missing.md', line: 5, column: 1};
  const second = {...first, line: 8};
  const third = {...first, column: 25};
  const rows = parseMarkdownDiagnostics([observer, logRow(first), logRow(first), logRow(second), logRow(third)].join('\n'));
  assert.equal(rows.length, 3);
  assert.deepEqual(rows.map(row => [row.line, row.column]).sort((a, b) => a[0] - b[0] || a[1] - b[1]),
    [[5, 1], [5, 25], [8, 1]]);
  assert.deepEqual(parseMarkdownDiagnostics(observer), []);
});

test('Markdown diagnostic parser rejects missing execution evidence, malformed rows, and prefix drift', () => {
  const row = {source: 'docs/one.md', target: './missing.md', line: 5, column: 1};
  assert.throws(() => parseMarkdownDiagnostics(logRow(row)), /observer did not execute/);
  assert.throws(() => parseMarkdownDiagnostics(`${observer}\n[WARNING] ${logRow(row)}`), /prefix/);
  assert.throws(() => parseMarkdownDiagnostics(`${observer}\n${MARKER}{`), SyntaxError);
  for (const invalid of [{...row, source: ''}, {...row, target: null}, {...row, line: 0},
    {...row, line: 1.5}, {...row, column: 0}, {...row, column: undefined}]) {
    assert.throws(() => parseMarkdownDiagnostics(`${observer}\n${logRow(invalid)}`), /Malformed Markdown diagnostic/);
  }
});

test('results directory permits external or designated ignored output and never overwrites an existing path', t => {
  const root = temporaryRoot(t, 'prebid-site-output-');
  const site = path.join(root, 'site'); fs.mkdirSync(site);
  const external = path.join(root, 'receipts', 'outside');
  assert.equal(outputDirectory(external, site), external);
  fs.writeFileSync(path.join(external, 'sentinel'), 'preserve');
  assert.throws(() => outputDirectory(external, site), /already exists/);
  assert.equal(fs.readFileSync(path.join(external, 'sentinel'), 'utf8'), 'preserve');
  const ignored = path.join(site, '.validation-results', 'run');
  assert.equal(outputDirectory(ignored, site), ignored);
  assert.equal(fs.statSync(ignored).isDirectory(), true);
  assert.throws(() => outputDirectory(path.join(site, 'docs', 'report'), site), /outside source/);
  assert.equal(fs.existsSync(path.join(site, 'docs')), false);
});

test('results directory resolves symlink ancestors and refuses dangling output endpoints', t => {
  const root = temporaryRoot(t, 'prebid-site-output-links-');
  const site = path.join(root, 'site'); fs.mkdirSync(site);
  const alias = path.join(root, 'outside-alias'); fs.symlinkSync(site, alias);
  assert.throws(() => outputDirectory(path.join(alias, 'nested', 'report'), site), /outside source/);
  assert.deepEqual(fs.readdirSync(site), []);
  const target = path.join(root, 'missing');
  const dangling = path.join(root, 'receipt-link'); fs.symlinkSync(target, dangling);
  assert.throws(() => outputDirectory(dangling, site), /already exists/);
  assert.equal(fs.existsSync(target), false);
});

function fixtureRepository(t) {
  const root = temporaryRoot(t, 'prebid-site-pipeline-');
  const siteDir = path.join(root, 'source'); fs.mkdirSync(siteDir);
  const env = controlledEnvironment();
  function git(...args) {
    const result = spawnSync('git', ['-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false',
      '-c', 'user.name=Migration Test Fixture', '-c', 'user.email=migration-fixture@example.invalid', ...args],
    {cwd: siteDir, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']});
    assert.equal(result.status, 0, result.stderr || result.error?.message);
    return result.stdout.trim();
  }
  function write(name, contents) {
    const file = path.join(siteDir, name);
    fs.mkdirSync(path.dirname(file), {recursive: true}); fs.writeFileSync(file, contents);
  }
  write('.gitignore', 'node_modules/\n.docusaurus/\nbuild/\n.validation-results/\n');
  write('.markdownlint.json', '{"default":true}\n');
  for (const name of ['package.json', 'package-lock.json']) {
    write(name, fs.readFileSync(path.join(repository, name)));
  }
  write('docusaurus.config.ts', `export default {
  title: 'Site validation fixture', url: 'https://fixture.example.test', baseUrl: '/',
  onBrokenLinks: 'warn', markdown: {format: 'detect', hooks: {onBrokenMarkdownLinks: 'warn'}},
  presets: [['classic', {docs: {path: 'docs', routeBasePath: '/', sidebarPath: false}, pages: false, blog: false}]],
  themeConfig: {navbar: {title: 'Fixture', items: []}, footer: {links: []}},
};\n`);
  const one = '---\ntitle: One\nslug: /\n---\n\n# One\n\n[Second page](./two.md)\n\n<img src="/fixture.svg" alt="Fixture image" />\n';
  const two = '---\ntitle: Two\n---\n\n# Two\n\n[First page](./one.md)\n';
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" /></svg>\n';
  const csv = 'id,label\none,One\n';
  write('docs/one.md', one); write('docs/two.md', two);
  write('static/fixture.svg', svg); write('static/fixture-data.csv', csv);

  // Docusaurus clear removes node_modules/.cache. A whole-directory symlink
  // would delete the shared project's cache; keep this facade and cache local.
  const modules = path.join(siteDir, 'node_modules'); fs.mkdirSync(modules);
  for (const entry of fs.readdirSync(path.join(repository, 'node_modules'))) {
    if (entry === '.cache') continue;
    fs.symlinkSync(path.join(repository, 'node_modules', entry), path.join(modules, entry));
  }
  assert.equal(fs.lstatSync(modules).isDirectory(), true);
  assert.equal(fs.lstatSync(modules).isSymbolicLink(), false);
  git('init', '--quiet', '--initial-branch=codex/site-validation-fixture');
  let previous;
  function commit(label) {
    git('add', '--all'); git('commit', '--quiet', '-m', label);
    const sha = git('rev-parse', 'HEAD');
    assert.match(sha, /^[a-f0-9]{40}$/); assert.notEqual(sha, previous);
    assert.equal(git('status', '--porcelain', '--untracked-files=all'), '');
    previous = sha; return sha;
  }
  function capture(label) {
    const outDir = path.join(root, label);
    try {
      const report = captureSite({siteDir, outDir, env});
      assert.equal(git('status', '--porcelain', '--untracked-files=all'), '', 'capture must clean its temporary config');
      assert.deepEqual(fs.readdirSync(siteDir).filter(name => name.startsWith('.migration-observer-')), []);
      assert.ok(fs.existsSync(path.join(outDir, 'observer.config.ts')));
      return report;
    } catch (error) {
      const logs = ['authored.log', 'clear.log', 'build.log'].map(name => {
        const file = path.join(outDir, name);
        return fs.existsSync(file) ? `${name}:\n${fs.readFileSync(file, 'utf8').slice(-5000)}` : '';
      }).filter(Boolean).join('\n');
      throw new Error(`${error.message}\n${logs}`, {cause: error});
    }
  }
  return {root, siteDir, env, git, write, commit, capture, one, two, svg, csv};
}

test('clean candidate preparation clones the commit without ignored MDX, JavaScript, or assets', t => {
  const fixture = fixtureRepository(t);
  fs.appendFileSync(path.join(fixture.siteDir, '.gitignore'), 'docs/ignored.mdx\nsrc/ignored.js\nstatic/ignored.svg\n');
  const revision = fixture.commit('Source preparation fixture');
  fixture.write('docs/ignored.mdx', '# Ignored local document\n');
  fixture.write('src/ignored.js', 'export const localOnly = true;\n');
  fixture.write('static/ignored.svg', fixture.svg);
  assert.equal(fixture.git('status', '--porcelain', '--untracked-files=all'), '');
  const prepared = prepareSource({siteDir: fixture.siteDir, revision, cloneDir: path.join(fixture.root, 'clean-clone'), env: fixture.env});
  assert.equal(prepared.source_mode, 'isolated_commit');
  assert.equal(prepared.clean_acceptance_eligible, true);
  assert.notEqual(prepared.siteDir, fixture.siteDir);
  assert.equal(fs.readFileSync(path.join(prepared.siteDir, 'docs/one.md'), 'utf8'), fixture.one);
  for (const name of ['docs/ignored.mdx', 'src/ignored.js', 'static/ignored.svg', 'node_modules']) {
    assert.equal(fs.existsSync(path.join(prepared.siteDir, name)), false, name);
  }
  assert.equal(fixture.git('-C', prepared.siteDir, 'rev-parse', 'HEAD'), revision);
  assert.equal(fixture.git('-C', prepared.siteDir, 'status', '--porcelain', '--untracked-files=all'), '');
});

test('Git-visible source manifest preserves whitespace and newline paths without shadow collisions', t => {
  const fixture = fixtureRepository(t);
  fixture.commit('Whitespace path control');
  const before = visibleSourceManifest(fixture.siteDir, fixture.env);
  const files = {' leading.js': 'leading-space payload\n', 'leading.js': 'shadow payload\n',
    'trailing.js ': 'trailing-space payload\n', 'line\nbreak.js': 'newline payload\n'};
  for (const [name, contents] of Object.entries(files)) fixture.write(name, contents);
  fixture.commit('Add exact whitespace paths');
  const manifest = visibleSourceManifest(fixture.siteDir, fixture.env);
  assert.equal(manifest.length, before.length + Object.keys(files).length);
  for (const [name, contents] of Object.entries(files)) {
    const rows = manifest.filter(row => row.path === name);
    assert.equal(rows.length, 1, JSON.stringify(name));
    assert.equal(rows[0].sha256, crypto.createHash('sha256').update(contents).digest('hex'));
  }
});

test('development mode is explicitly weaker and cannot cover ignored Markdown outside its source manifest', t => {
  const fixture = fixtureRepository(t);
  fs.appendFileSync(path.join(fixture.siteDir, '.gitignore'), 'docs/ignored.mdx\n');
  const revision = fixture.commit('Development binding fixture');
  fixture.write('docs/ignored.mdx', '# Ignored but selected\n');
  assert.equal(fixture.git('status', '--porcelain', '--untracked-files=all'), '');
  const preparation = prepareSource({siteDir: fixture.siteDir, revision,
    cloneDir: path.join(fixture.root, 'unused-clone'), allowDirty: true, env: fixture.env});
  assert.equal(preparation.siteDir, fixture.siteDir);
  assert.equal(preparation.source_mode, 'working_tree_development');
  assert.equal(preparation.clean_acceptance_eligible, false);
  assert.equal(fs.existsSync(path.join(fixture.root, 'unused-clone')), false);
  const outDir = path.join(fixture.root, 'ignored-capture');
  assert.throws(() => captureSite({...preparation, outDir, env: fixture.env}), /not in the Git-visible source manifest.*docs\/ignored\.mdx/);
  const rejected = JSON.parse(fs.readFileSync(path.join(outDir, 'authored.json'), 'utf8'));
  assert.ok(rejected.documents.some(row => row.path === 'docs/ignored.mdx' && row.compiled));
  assert.equal(fs.existsSync(path.join(outDir, 'clear.log')), false, 'binding must fail before cache deletion');
  assert.equal(fs.existsSync(path.join(outDir, 'report.json')), false);

  fs.unlinkSync(path.join(fixture.siteDir, 'docs/ignored.mdx'));
  fixture.write('docs/untracked.mdx', '# Visible development document\n');
  const authoredFile = path.join(fixture.root, 'development-authored.json');
  const compiled = spawnSync(process.execPath, [path.join(repository, 'scripts/validate-authored-content.mjs'),
    '--site-dir', fixture.siteDir, '--out', authoredFile], {cwd: fixture.siteDir, env: fixture.env, encoding: 'utf8'});
  assert.equal(compiled.status, 0, compiled.stderr || compiled.stdout);
  const authored = JSON.parse(fs.readFileSync(authoredFile, 'utf8'));
  const visible = visibleSourceManifest(fixture.siteDir, fixture.env);
  assert.ok(visible.some(row => row.path === 'docs/untracked.mdx'));
  assert.equal(bindAuthoredInputs(authored, visible).documents, 3);
});

test('every pinned Docusaurus cleanup target and its ancestors reject external symlinks', t => {
  assert.deepEqual(CLEANUP_TARGETS, ['.docusaurus', 'build', 'node_modules/.cache', '.yarn/.cache']);
  for (const target of ['.docusaurus', 'build', 'node_modules', 'node_modules/.cache', '.yarn', '.yarn/.cache']) {
    const root = temporaryRoot(t, 'prebid-site-cleanup-');
    const siteDir = path.join(root, 'site'); fs.mkdirSync(siteDir);
    const external = path.join(root, 'external'); fs.mkdirSync(external);
    fs.writeFileSync(path.join(external, 'sentinel'), 'preserve external bytes');
    const file = path.join(siteDir, target); fs.mkdirSync(file, {recursive: true});
    assert.doesNotThrow(() => assertSafeCleanupPaths(siteDir));
    fs.rmSync(file, {recursive: true}); fs.symlinkSync(external, file);
    const outDir = path.join(root, 'receipt');
    assert.throws(() => captureSite({siteDir, outDir}), /symlink/);
    assert.equal(fs.readFileSync(path.join(external, 'sentinel'), 'utf8'), 'preserve external bytes');
    assert.equal(fs.existsSync(outDir), false);
  }
});

function interceptCaptureProcesses(callback, intercept) {
  const original = childProcess.spawnSync;
  childProcess.spawnSync = (executable, args, options) => intercept(original, executable, args, options);
  syncBuiltinESMExports();
  try { callback(); }
  finally { childProcess.spawnSync = original; syncBuiltinESMExports(); }
}

test('capture rechecks cleanup safety after authored configuration executes', t => {
  const fixture = fixtureRepository(t); fixture.commit('Pre-clear recheck fixture');
  const external = path.join(fixture.root, 'external'); fs.mkdirSync(external);
  fs.mkdirSync(path.join(external, '.cache')); fs.writeFileSync(path.join(external, '.cache/sentinel'), 'preserve');
  let clearCalls = 0;
  interceptCaptureProcesses(() => {
    assert.throws(() => captureSite({siteDir: fixture.siteDir, outDir: path.join(fixture.root, 'late-symlink'), env: fixture.env}), /symlink.*\.yarn/);
  }, (original, executable, args, options) => {
    if (args[0]?.endsWith('/docusaurus.mjs') && args[1] === 'clear') clearCalls++;
    const result = original(executable, args, options);
    if (args[0]?.endsWith('/validate-authored-content.mjs') && result.status === 0) {
      // Simulate a configuration/plugin creating this path after initial checks.
      fs.symlinkSync(external, path.join(fixture.siteDir, '.yarn'));
    }
    return result;
  });
  assert.equal(clearCalls, 0);
  assert.equal(fs.readFileSync(path.join(external, '.cache/sentinel'), 'utf8'), 'preserve');
});

test('zero-exit clear that leaves a cache fails before build; target absence uses lstat', t => {
  const fixture = fixtureRepository(t); fixture.commit('Incomplete clear fixture');
  assert.doesNotThrow(() => assertCleanupComplete(fixture.siteDir));
  const cache = path.join(fixture.siteDir, 'node_modules/.cache'); fs.mkdirSync(cache);
  fs.writeFileSync(path.join(cache, 'sentinel'), 'cache was not cleared');
  let clearCalls = 0, buildCalls = 0;
  interceptCaptureProcesses(() => {
    assert.throws(() => captureSite({siteDir: fixture.siteDir, outDir: path.join(fixture.root, 'incomplete-clear'), env: fixture.env}), /cleanup left a deletion target behind/);
  }, (original, executable, args, options) => {
    if (args[0]?.endsWith('/docusaurus.mjs')) {
      if (args[1] === 'clear') { clearCalls++; return {status: 0, stdout: '', stderr: ''}; }
      if (args[1] === 'build') { buildCalls++; throw new Error('Build must not start after incomplete cleanup'); }
    }
    return original(executable, args, options);
  });
  assert.equal(clearCalls, 1); assert.equal(buildCalls, 0);
  assert.equal(fs.readFileSync(path.join(cache, 'sentinel'), 'utf8'), 'cache was not cleared');
  fs.rmSync(cache, {recursive: true});
  fs.symlinkSync(path.join(fixture.root, 'missing-cache'), cache);
  assert.throws(() => assertCleanupComplete(fixture.siteDir), /cleanup left a deletion target behind/);
});

function authoredSelection(report) {
  return report.authored.documents.map(row => [row.instance, row.path]).sort();
}

test('real tiny Docusaurus captures catch link/asset/CSV regressions and recover after restoration', {timeout: 240000}, async t => {
  const fixture = fixtureRepository(t);
  const cleanSha = fixture.commit('Clean fixture');
  const clean = fixture.capture('clean');
  assert.deepEqual(clean.routes, ['/', '/two'], 'Capture must retain actual declared paths, not path/hash chunk keys');
  assert.deepEqual(clean.route_inventory.leafPaths, ['/', '/two']);
  assert.ok(clean.route_inventory.bindings.length > clean.routes.length, 'Same-path routing contexts must remain visible');
  assert.equal(clean.source_commit, cleanSha);
  assert.equal(clean.source_mode, 'working_tree_development');
  assert.equal(clean.clean_acceptance_eligible, false);
  assert.equal(clean.authored_source_binding.status, 'bound_to_git_visible_source');
  assert.deepEqual(clean.reporting_policy, clean.authored.site_reporting_policy);
  assert.equal(clean.authored.coverage.compilation_units, 2);
  assert.deepEqual(clean.authored.documents.map(row => row.path).sort(), ['docs/one.md', 'docs/two.md']);
  assert.ok(clean.routes.length >= 2);
  assert.ok(clean.inspection.coverage.checked_local_references > 0);
  assert.deepEqual(clean.markdown, []);
  assert.deepEqual(clean.warnings.links, []);
  assert.deepEqual(clean.warnings.anchors, []);
  assert.deepEqual(clean.inspection.missing_local_targets, []);
  assert.equal(clean.inspection.csv.length, 1);
  assert.equal(clean.inspection.csv[0].rows, 1);
  assert.deepEqual(clean.inspection.csv[0].findings, []);
  assert.equal(compareSite(clean, clean).status, 'passed');

  fixture.write('docs/one.md', fixture.one.replace('./two.md', './missing.md'));
  fixture.write('docs/two.md', fixture.two + '\n[Missing section](./one.md#missing-section)\n');
  fs.unlinkSync(path.join(fixture.siteDir, 'static/fixture.svg'));
  fs.unlinkSync(path.join(fixture.siteDir, 'static/fixture-data.csv'));
  const brokenSha = fixture.commit('Break link and remove raw image and CSV');
  const broken = fixture.capture('broken');
  assert.equal(broken.source_commit, brokenSha);
  assert.deepEqual(broken.routes, clean.routes);
  assert.deepEqual(authoredSelection(broken), authoredSelection(clean));
  assert.equal(broken.authored.coverage.compilation_units, 2);
  assert.ok(broken.markdown.some(row => row.target === './missing.md'));
  assert.ok(broken.inspection.missing_local_targets.some(row => row.tag === 'img' && row.target === '/fixture.svg'));
  const failed = compareSite(broken, clean);
  assert.equal(failed.status, 'failed');
  assert.ok(failed.diagnostics.markdown.added.some(row => row.target === './missing.md'));
  assert.ok(failed.diagnostics.anchors.added.some(row => row.target.includes('#missing-section')));
  assert.ok(failed.diagnostics.static_targets.added.some(row => row.tag === 'img' && row.target === '/fixture.svg'));
  assert.deepEqual(failed.removed_csv, ['fixture-data.csv']);
  assert.equal(broken.inspection.csv.length, 0);

  fixture.write('docs/one.md', fixture.one);
  fixture.write('docs/two.md', fixture.two);
  fixture.write('static/fixture.svg', fixture.svg);
  fixture.write('static/fixture-data.csv', fixture.csv);
  fixture.commit('Restore clean fixture');
  const restored = fixture.capture('restored');
  assert.deepEqual(restored.routes, clean.routes);
  assert.deepEqual(authoredSelection(restored), authoredSelection(clean));
  assert.equal(compareSite(restored, clean).status, 'passed');
  assert.equal(compareSite(restored, broken).status, 'passed');
  assert.equal(compareSite(restored, broken).diagnostics.markdown.resolved, broken.markdown.length);

  await t.test('candidate throw policies reject existing defects even when regression identities are unchanged', () => {
    const counts = {onBrokenLinks: broken.warnings.links.length, onBrokenAnchors: broken.warnings.anchors.length,
      onBrokenMarkdownLinks: broken.markdown.length};
    for (const [setting, count] of Object.entries(counts)) {
      assert.ok(count > 0, `The real fixture must exercise ${setting}`);
      const strict = clone(broken); strict.reporting_policy[setting] = 'throw';
      const comparison = compareSite(strict, broken);
      assert.equal(comparison.status, 'failed');
      assert.ok(Object.values(comparison.diagnostics).every(row => row.added.length === 0));
      assert.deepEqual(comparison.strict_reporting_failures, [{setting, severity: 'throw', observations: count}]);
      strict.reporting_policy[setting] = 'warn';
      assert.equal(compareSite(strict, broken).status, 'passed');
    }
    const strictClean = clone(clean);
    for (const setting of Object.keys(counts)) strictClean.reporting_policy[setting] = 'throw';
    assert.equal(compareSite(strictClean, clean).status, 'passed');
    for (const value of [undefined, 'unknown-policy']) {
      const invalid = clone(clean); invalid.reporting_policy.onBrokenLinks = value;
      assert.throws(() => compareSite(invalid, clean), /Missing or unsupported original reporting policy/);
    }
  });

  await t.test('authored documents and input metadata bind to observed Git-visible source hashes', () => {
    const sourceManifest = visibleSourceManifest(fixture.siteDir, fixture.env);
    assert.equal(bindAuthoredInputs(clean.authored, sourceManifest).documents, 2);
    const tamperedDocument = clone(clean.authored); tamperedDocument.documents[0].sha256 = '0'.repeat(64);
    assert.throws(() => bindAuthoredInputs(tamperedDocument, sourceManifest), /hash differs/);
    const tamperedMetadata = clone(clean.authored); tamperedMetadata.input_metadata[0].sha256 = '0'.repeat(64);
    assert.throws(() => bindAuthoredInputs(tamperedMetadata, sourceManifest), /hash differs/);
    const missingMetadata = sourceManifest.filter(row => row.path !== clean.authored.input_metadata[0].path);
    assert.throws(() => bindAuthoredInputs(clean.authored, missingMetadata), /not in the Git-visible/);
  });

  // Policy unit controls below transform actual captured reports. They do not
  // pretend the transformed records came from further builds.
  await t.test('empty observed coverage cannot pass for candidate or baseline', () => {
    const removals = [report => { report.routes = []; }, report => { report.inspection.documents = []; },
      report => { report.inspection.coverage.checked_local_references = 0; },
      report => { report.authored.documents = []; }, report => { report.authored.selection = []; }];
    for (const remove of removals) {
      const empty = clone(clean); remove(empty);
      assert.throws(() => compareSite(empty, clean), /Empty or malformed/);
      assert.throws(() => compareSite(clean, empty), /Empty or malformed/);
    }
  });

  await t.test('equal aggregate counts cannot hide source/target substitutions', () => {
    assert.ok(broken.markdown.length > 0);
    const changed = clone(broken);
    changed.markdown[0].target = './a-different-missing.md';
    assert.equal(changed.markdown.length, broken.markdown.length);
    const comparison = compareSite(changed, broken);
    assert.equal(comparison.status, 'failed');
    assert.equal(comparison.diagnostics.markdown.added.length, 1);
    assert.equal(comparison.diagnostics.markdown.resolved, 1);
    const moved = clone(broken); moved.markdown[0].source = 'docs/two.md';
    assert.equal(compareSite(moved, broken).diagnostics.markdown.added.length, 1);
    for (const kind of ['links', 'anchors']) {
      assert.ok(broken.warnings[kind].length > 0);
      const changedCompiler = clone(broken);
      changedCompiler.warnings[kind][0].target += '-changed';
      const compilerComparison = compareSite(changedCompiler, broken);
      assert.equal(compilerComparison.status, 'failed');
      assert.equal(compilerComparison.diagnostics[kind].added.length, 1);
      assert.equal(compilerComparison.diagnostics[kind].resolved, 1);
    }
    const staticTarget = clone(broken);
    staticTarget.inspection.missing_local_targets.find(row => row.tag === 'img').target = '/different.svg';
    assert.equal(compareSite(staticTarget, broken).diagnostics.static_targets.added.length, 1);
  });

  await t.test('line shifts retain existing pairs while additional occurrences fail', () => {
    const shifted = clone(broken);
    shifted.markdown = shifted.markdown.map(row => ({...row, line: row.line + 20}));
    const moved = compareSite(shifted, broken);
    assert.equal(moved.status, 'passed');
    assert.equal(moved.diagnostics.markdown.existing, broken.markdown.length);
    assert.equal(moved.diagnostics.markdown.added.length, 0);
    const repeated = clone(broken);
    repeated.markdown.push({...broken.markdown[0], line: broken.markdown[0].line + 30});
    const more = compareSite(repeated, broken);
    assert.equal(more.status, 'failed');
    assert.equal(more.diagnostics.markdown.existing, broken.markdown.length);
    assert.equal(more.diagnostics.markdown.added.length, 1);
    for (const kind of ['links', 'anchors']) {
      assert.ok(broken.warnings[kind].length > 0);
      const repeatedCompiler = clone(broken);
      repeatedCompiler.warnings[kind].push({...broken.warnings[kind][0]});
      assert.equal(compareSite(repeatedCompiler, broken).diagnostics[kind].added.length, 1);
    }
  });

  await t.test('route, authored input, HTML, and CSV deletions each fail without new diagnostics', () => {
    const removedRoute = clone(clean); const route = removedRoute.routes.pop();
    assert.ok(removedRoute.routes.length > 0);
    assert.deepEqual(compareSite(removedRoute, clean).removed_routes, [route]);
    assert.equal(compareSite(removedRoute, clean).status, 'failed');
    const removedLeaf = clone(clean); const leaf = removedLeaf.route_inventory.leafPaths.pop();
    assert.ok(removedLeaf.routes.includes(leaf));
    assert.deepEqual(compareSite(removedLeaf, clean).removed_leaf_routes, [leaf]);
    assert.equal(compareSite(removedLeaf, clean).status, 'failed');
    const removedBinding = clone(clean); removedBinding.route_inventory.bindings.pop();
    assert.equal(compareSite(removedBinding, clean).removed_route_bindings.length, 1);
    assert.equal(compareSite(removedBinding, clean).status, 'failed');
    const hashOnly = clone(clean);
    hashOnly.route_inventory.bindings.forEach(row => {row.hash = 'changed'; row.key = `${row.path}-changed`; row.chunkIds = ['changed'];});
    assert.equal(compareSite(hashOnly, clean).status, 'passed');
    const historical = clone(clean); historical.schema_version = 2;
    assert.throws(() => compareSite(historical, clean), /Empty or malformed/);
    const malformed = clone(clean); malformed.route_inventory.bindings = [{}];
    assert.throws(() => compareSite(malformed, malformed), /Empty or malformed/);
    const removedSource = clone(clean); const source = removedSource.authored.documents.pop();
    const sourceComparison = compareSite(removedSource, clean);
    assert.equal(sourceComparison.status, 'failed');
    assert.deepEqual(sourceComparison.lost_authored_inputs, [source]);
    const removedHtml = clone(clean); const html = removedHtml.inspection.documents.pop();
    assert.ok(removedHtml.inspection.documents.length > 0);
    const htmlComparison = compareSite(removedHtml, clean);
    assert.equal(htmlComparison.status, 'failed'); assert.deepEqual(htmlComparison.removed_html, [html.file]);
    const removedCsv = clone(clean); removedCsv.inspection.csv = [];
    const csvComparison = compareSite(removedCsv, clean);
    assert.equal(csvComparison.status, 'failed'); assert.deepEqual(csvComparison.removed_csv, ['fixture-data.csv']);
    for (const result of [sourceComparison, htmlComparison, csvComparison]) {
      assert.ok(Object.values(result.diagnostics).every(row => row.added.length === 0));
    }
  });
});
