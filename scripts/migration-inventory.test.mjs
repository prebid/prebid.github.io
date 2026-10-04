import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildInventory } from './migration-inventory.mjs';

const script = fileURLToPath(new URL('./migration-inventory.mjs', import.meta.url));
const referenceSha = 'a'.repeat(40);
const siteSha = 'b'.repeat(40);
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

function fixture(t, legacyFiles, migrationFiles) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'migration-inventory-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const legacyRoot = path.join(root, 'legacy');
  const migrationRoot = path.join(root, 'migration');
  for (const [directory, files] of [[legacyRoot, legacyFiles], [migrationRoot, migrationFiles]]) {
    fs.mkdirSync(directory);
    for (const [name, contents] of Object.entries(files)) {
      const target = path.join(directory, name);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, contents);
    }
  }
  return { root, legacyRoot, migrationRoot, referenceSha, siteSha };
}

test('real-corpus bidder shape maps by path and extension, with hashes but no fidelity claim', (t) => {
  // Representative field shape from dev-docs/bidders/appnexus.md; expected mapping is independent of the tool's rule table.
  const source = '---\nlayout: bidder\ntitle: AppNexus\nbiddercode: appnexus\nmedia_types: banner, video, native\npbjs: true\n---\n### Bid Params\n';
  const destination = '---\nlayout: bidder\ntitle: AppNexus\n---\n### Bid Params\n';
  const inputs = fixture(t, { 'dev-docs/bidders/appnexus.md': source }, {
    'docs/dev-docs/prebidjs/bidders/appnexus.mdx': destination,
    'docs/content/new.md': '# New page\n',
  });
  const report = buildInventory(inputs);
  assert.equal(report.counts.ledger_entries, 1);
  assert.equal(report.counts.moved_unverified, 1);
  assert.equal(report.counts.verified, 0);
  assert.equal(report.ledger[0].state, 'moved_unverified');
  assert.equal(report.ledger[0].source_sha256, sha256(source));
  assert.equal(report.ledger[0].candidates[0].sha256, sha256(destination));
  assert.equal(report.ledger[0].candidates[0].path, 'docs/dev-docs/prebidjs/bidders/appnexus.mdx');
  assert.equal(report.ledger[0].frontmatter.fields.title, 'AppNexus');
  assert.equal(report.ledger[0].fidelity, 'not_evaluated');
  assert.deepEqual(report.migration_additions.map((row) => row.path), ['docs/content/new.md']);
  assert.deepEqual(buildInventory(inputs), report, 'unchanged inputs yield identical report bytes');
});

test('missing, retained legacy, and basename-only counterparts remain unresolved', (t) => {
  const inputs = fixture(t, {
    'dev-docs/missing.md': '# Missing\n', 'adops/renamed.md': '# Renamed\n',
  }, {
    'dev-docs/missing.md': '# Leftover\n', 'docs/content/renamed.mdx': '# Possible match\n',
  });
  const report = buildInventory(inputs);
  assert.equal(report.counts.ledger_entries, 2);
  assert.equal(report.counts.unresolved_mapping, 2);
  assert.equal(report.counts.moved_unverified, 0);
  const missing = report.ledger.find((row) => row.source_path === 'dev-docs/missing.md');
  assert.equal(missing.candidates[0].role, 'retained_legacy_candidate');
  const hint = report.ledger.find((row) => row.source_path === 'adops/renamed.md');
  assert.equal(hint.candidates[0].mapping_evidence, 'basename_only_heuristic');
  assert.equal(report.migration_additions.length, 1, 'a hint must not consume a claimed destination');
});

test('ambiguous extensions and duplicate source claims cannot become moved_unverified', (t) => {
  const inputs = fixture(t, {
    'dev-docs/ambiguous.md': '# A\n', 'prebid-mobile/duplicate.md': '# B\n',
    'prebid-mobile/duplicate.markdown': '# C\n',
  }, {
    'docs/dev-docs/prebidjs/ambiguous.md': '# A\n', 'docs/dev-docs/prebidjs/ambiguous.mdx': '# A\n',
    'docs/dev-docs/prebid-mobile/duplicate.mdx': '# B\n',
  });
  const report = buildInventory(inputs);
  assert.equal(report.counts.ledger_entries, 3);
  assert.equal(report.counts.unresolved_mapping, 3);
  assert.equal(report.ledger[0].mapping_reason, 'multiple_explicit_path_candidates');
  assert.deepEqual(report.duplicate_destination_claims, [{
    destination: 'docs/dev-docs/prebid-mobile/duplicate.mdx',
    sources: ['prebid-mobile/duplicate.markdown', 'prebid-mobile/duplicate.md'],
  }]);
  assert.equal(report.ledger[1].mapping_reason, 'destination_claimed_by_multiple_sources');
});

test('template graph includes inherited layouts, nested includes, dynamics, missing targets, and unused files', (t) => {
  const inputs = fixture(t, {
    'dev-docs/example.md': '---\nlayout: bidder\n---\n{% include_relative sample.js %}\n',
    'dev-docs/sample.js': 'window.example = 1;\n',
    '_layouts/bidder.html': '---\nlayout: page\n---\n{% include card.html %}\n',
    '_layouts/page.html': '{% include missing.html %}\n',
    '_includes/card.html': '{%- include "shared.md" -%}\n{% include {{ page.partial }} %}\n',
    '_includes/shared.md': 'Shared notice\n',
    '_includes/unused.txt': 'Unused but inventoried\n',
  }, { 'docs/dev-docs/prebidjs/example.md': '# Example\n' });
  const report = buildInventory(inputs);
  assert.equal(report.legacy.counts.layout_templates, 2);
  assert.equal(report.legacy.counts.include_templates, 3);
  assert.equal(report.legacy.counts.dynamic_unresolved_references, 1);
  assert.deepEqual(report.ledger[0].dependencies.map((item) => item.path), [
    '_includes/card.html', '_includes/shared.md', '_layouts/bidder.html', '_layouts/page.html', 'dev-docs/sample.js',
  ]);
  assert.equal(report.ledger[0].dependencies.find((item) => item.path === '_includes/shared.md').sha256, sha256('Shared notice\n'));
  assert.deepEqual(report.ledger[0].unresolved_dependencies.map((item) => item.status).sort(), ['dynamic_unresolved', 'static_missing']);
  assert.equal(report.ledger[0].unresolved_dependencies.find((item) => item.status === 'dynamic_unresolved').arguments,
    '{{ page.partial }}');
  const unused = report.legacy.files.find((item) => item.path === '_includes/unused.txt');
  assert.deepEqual(unused.referenced_by, []);
  fs.writeFileSync(path.join(inputs.legacyRoot, '_includes/shared.md'), 'Changed notice\n');
  const changed = buildInventory(inputs);
  assert.notEqual(changed.ledger[0].dependencies.find((item) => item.path === '_includes/shared.md').sha256,
    report.ledger[0].dependencies.find((item) => item.path === '_includes/shared.md').sha256);
});

test('full YAML parsing handles multiline fields and exposes malformed YAML without partial metadata', (t) => {
  const inputs = fixture(t, {
    'dev-docs/valid.md': '---\ntitle: >-\n  A longer\n  title\npermalink: /original.html\nlayout: bidder\n---\nBody\n',
    'dev-docs/invalid.md': '---\ntitle: Apparent title\nlayout: [unclosed\n---\nBody\n',
    'dev-docs/unterminated.md': '---\ntitle: No terminator\n',
  }, { 'docs/content/intro.md': '# Intro\n' });
  const report = buildInventory(inputs);
  const valid = report.ledger.find((item) => item.source_path.endsWith('/valid.md'));
  assert.equal(valid.frontmatter.fields.title, 'A longer title');
  assert.equal(valid.frontmatter.fields.permalink, '/original.html');
  const invalid = report.ledger.find((item) => item.source_path.endsWith('/invalid.md'));
  assert.equal(invalid.frontmatter.status, 'invalid');
  assert.deepEqual(invalid.frontmatter.fields, {});
  assert.equal(report.legacy.counts.frontmatter_errors, 2);
  assert.equal(report.tool.yaml_parser.package, 'js-yaml');
  assert.match(report.tool.yaml_parser.version, /^\d+\./);
});

test('no-frontmatter markdown is inventoried, raw HTML/data retained separately, generated data included', (t) => {
  const inputs = fixture(t, {
    'README.md': '# Repository prose\n',
    'raw.html': '<html>Not a Jekyll document</html>\n',
    'page.html': '---\ntitle: HTML page\n---\n<h1>Page</h1>\n',
    'assets/csv/static.csv': 'name,value\nx,1\n',
    'search.json': '---\n---\n[{% for page in site.pages %}{% endfor %}]\n',
    'dev-docs/bidder-data.csv': '---\nlayout: none\n---\ncode,title\n{% for page in site.pages %}{{ page.title }}{% endfor %}\n',
  }, { 'docs/content/intro.md': '# Intro\n', 'static/bidder-data.csv': 'code,title\nx,X\n' });
  const report = buildInventory(inputs);
  assert.equal(report.legacy.counts.source_inputs, 4);
  assert.equal(report.legacy.counts.generated_data_candidates, 2);
  assert.deepEqual(report.legacy.raw_file_paths, ['assets/csv/static.csv', 'raw.html']);
  assert.equal(report.ledger.find((row) => row.source_path === 'README.md').frontmatter.status, 'absent');
  assert.equal(report.ledger.find((row) => row.source_path === 'dev-docs/bidder-data.csv').state, 'moved_unverified');
});

test('empty source selection fails for either root even when raw or excluded files exist', (t) => {
  for (const side of ['legacy', 'migration']) {
    const nonempty = { 'docs/content/intro.md': '# Intro\n' };
    const empty = { 'raw.html': '<html>Raw</html>\n', 'node_modules/fake.md': '# Excluded\n' };
    const inputs = fixture(t, side === 'legacy' ? empty : nonempty, side === 'migration' ? empty : nonempty);
    assert.throws(() => buildInventory(inputs), { message: `No document/generated-data scan inputs in ${fs.realpathSync(inputs[`${side}Root`])}` });
  }
});

test('raw or binary HTML at a mapped path does not count as a document destination', (t) => {
  const inputs = fixture(t, { 'dev-docs/raw.md': '# Source\n', 'dev-docs/binary.md': '# Source\n' }, {
    'docs/dev-docs/prebidjs/raw.html': '<html>Static asset</html>\n',
    'docs/dev-docs/prebidjs/binary.html': Buffer.from([0xff, 0xfe, 0x00, 0x01]),
    'docs/content/intro.md': '# Intro\n',
  });
  const report = buildInventory(inputs);
  assert.equal(report.counts.ledger_entries, 2);
  assert.equal(report.counts.unresolved_mapping, 2);
  assert.equal(report.migration.counts.source_inputs, 1);
  assert.equal(report.migration.raw_file_paths.length, 2);
  assert.deepEqual(report.ledger.map((row) => row.candidates), [[], []]);
});

test('CLI writes outside input roots, refuses overwrite, and preserves all input bytes', (t) => {
  const inputs = fixture(t, { 'dev-docs/example.md': '# Legacy\n' }, { 'docs/dev-docs/prebidjs/example.mdx': '# Migrated\n' });
  const output = path.join(inputs.root, 'report.json');
  const args = ['--legacy-root', inputs.legacyRoot, '--migration-root', inputs.migrationRoot,
    '--reference-sha', referenceSha, '--site-sha', siteSha, '--out', output];
  const before = buildInventory(inputs);
  const result = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).counts.ledger_entries, 1);
  assert.equal(JSON.parse(fs.readFileSync(output, 'utf8')).provenance.reference_sha, referenceSha);
  assert.deepEqual(buildInventory(inputs), before);
  const existingBytes = fs.readFileSync(output, 'utf8');
  const repeated = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
  assert.equal(repeated.status, 1);
  assert.match(repeated.stderr, /Refusing to overwrite existing output/);
  assert.equal(fs.readFileSync(output, 'utf8'), existingBytes);
  const unsafe = spawnSync(process.execPath, [script, ...args.slice(0, -1), path.join(inputs.legacyRoot, 'out.json')], { encoding: 'utf8' });
  assert.equal(unsafe.status, 1);
  assert.match(unsafe.stderr, /Output must be outside both input roots/);
  assert.equal(fs.existsSync(path.join(inputs.legacyRoot, 'out.json')), false);
});

test('symlinks are explicit exclusions and dependency cycles remain bounded', (t) => {
  const inputs = fixture(t, {
    'dev-docs/example.md': '{% include first.md %}\n',
    '_includes/first.md': '{% include second.md %}\n',
    '_includes/second.md': '{% include first.md %}\n',
  }, { 'docs/dev-docs/prebidjs/example.md': '# Example\n' });
  fs.symlinkSync(path.join(inputs.migrationRoot, 'docs'), path.join(inputs.legacyRoot, 'linked'));
  const report = buildInventory(inputs);
  assert.equal(report.legacy.counts.source_inputs, 1);
  assert.deepEqual(report.legacy.skipped, [{ path: 'linked', reason: 'symlink_not_followed' }]);
  assert.deepEqual(report.ledger[0].dependencies.map((item) => item.path), ['_includes/first.md', '_includes/second.md']);
});
