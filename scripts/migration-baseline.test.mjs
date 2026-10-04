import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {parseBuildWarnings, parseCsv, inspectCsv, inspectBuild, controlledEnvironment, capture} from './migration-baseline.mjs';

test('warning inventory preserves reference identities and repeated references', () => {
  const warnings = parseBuildWarnings(`[WARNING] Docusaurus found broken links!
Exhaustive list of all broken links found:
- Broken link on source page path = /a:
   -> linking to /missing
   -> linking to /missing
[WARNING] Docusaurus found broken anchors!
Exhaustive list of all broken anchors found:
- Broken anchor on source page path = /b:
   -> linking to #absent (resolved as: /b#absent)
[SUCCESS] Generated static files in "build".`);
  assert.deepEqual(warnings.links, [{source: '/a', target: '/missing'}, {source: '/a', target: '/missing'}]);
  assert.deepEqual(warnings.anchors, [{source: '/b', target: '#absent (resolved as: /b#absent)'}]);
});

test('unrecognized warning body fails instead of reporting zero defects', () => {
  assert.throws(() => parseBuildWarnings('[WARNING] Docusaurus found broken links!\nchanged format'), /Unparsed/);
  assert.throws(() => parseBuildWarnings('Docusaurus found broken links!\n   -> linking to /x'), /no source/);
  assert.throws(() => parseBuildWarnings('Docusaurus found broken links:'), /header/);
  assert.throws(() => parseBuildWarnings(`Docusaurus found broken links!
Exhaustive list of all broken links found:
- Broken link on source page path = /a:
   -> linking to /missing
- Broken link on source page path = /b:
    -> linking to /lost`), /Unparsed/);
});

test('capture boundary rejects inherited skip flags before any filesystem effect', () => {
  assert.throws(() => controlledEnvironment({DOCUSAURUS_SKIP_BUNDLING: 'true'}), /forbidden/);
  assert.throws(() => controlledEnvironment({NODE_OPTIONS: '--require something'}), /forbidden/);
  assert.equal(controlledEnvironment({API_KEY: 'not-for-child'}).API_KEY, undefined);
  process.env.DOCUSAURUS_SKIP_BUNDLING = 'true';
  try { assert.throws(() => capture({siteDir: '/not-read', outDir: '/not-created'}), /forbidden/); }
  finally { delete process.env.DOCUSAURUS_SKIP_BUNDLING; }
});

test('capture rejects symlinked output ancestors before Git, installation or writes', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'prebid-capture-output-'));
  try {
    const control = path.join(root, 'control'); fs.mkdirSync(control);
    const alias = path.join(root, 'outside-alias'); fs.symlinkSync(control, alias);
    assert.throws(() => capture({siteDir: control, outDir: path.join(alias, 'nested', 'receipt')}), /outside/);
    assert.deepEqual(fs.readdirSync(control), []);
    const dangling = path.join(root, 'dangling'); fs.symlinkSync(path.join(root, 'absent'), dangling);
    assert.throws(() => capture({siteDir: control, outDir: path.join(dangling, 'receipt')}), /dangling/);
    assert.equal(fs.existsSync(path.join(root, 'absent')), false);
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});

test('capture refuses an existing or dangling output endpoint without touching it', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'prebid-capture-existing-'));
  try {
    const control = path.join(root, 'control'); fs.mkdirSync(control);
    const existing = path.join(root, 'receipt'); fs.mkdirSync(existing);
    fs.writeFileSync(path.join(existing, 'sentinel'), 'preserve');
    assert.throws(() => capture({siteDir: control, outDir: existing}), /already exists/);
    assert.equal(fs.readFileSync(path.join(existing, 'sentinel'), 'utf8'), 'preserve');
    const dangling = path.join(root, 'receipt-link'); fs.symlinkSync(path.join(root, 'absent'), dangling);
    assert.throws(() => capture({siteDir: control, outDir: dangling}), /already exists/);
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});

test('CSV parsing covers escaped quotes, multiline fields and malformed input', () => {
  assert.deepEqual(parseCsv('id,name\r\na,"a, b"\r\nb,"two\nlines and ""quotes"""\r\n'),
    [['id', 'name'], ['a', 'a, b'], ['b', 'two\nlines and "quotes"']]);
  assert.throws(() => parseCsv('a,"unfinished'), /Unterminated/);
  assert.throws(() => parseCsv('a,"closed"x'), /Characters/);
  assert.deepEqual(inspectCsv('id,name\na,A\n').findings, []);
  assert.deepEqual(inspectCsv('id,name\na,A,extra\n').findings, ['inconsistent_column_count']);
  assert.deepEqual(inspectCsv('id,name\n').findings, ['no_data_rows']);
  assert.deepEqual(inspectCsv('id\n\n').findings, ['blank_data_row', 'no_data_rows']);
  assert.deepEqual(inspectCsv('---\nlayout: none\n---\n{% for page in site.pages %}').findings,
    ['unrendered_frontmatter', 'unrendered_liquid']);
});

test('static inspection notices missing assets and bad CSV without losing coverage', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'prebid-baseline-test-'));
  try {
    fs.mkdirSync(path.join(root, 'docs'));
    fs.writeFileSync(path.join(root, 'index.html'), '<head><link rel="canonical" href="https://docs.example.test/"><link rel="alternate" hreflang="en" href="/docs"></head><main><a href="/docs">Docs</a><img src="/logo.png"><a href="https://other.test/x">External</a></main>');
    fs.writeFileSync(path.join(root, 'docs/index.html'), '<article><h1 id="known">Title</h1><pre>const x = 1;</pre></article>');
    fs.writeFileSync(path.join(root, 'logo.png'), 'fixture');
    fs.writeFileSync(path.join(root, 'bidder-data.csv'), 'id,name\na,A\n');
    const clean = inspectBuild(root, 'https://docs.example.test');
    assert.equal(clean.coverage.html, 2);
    assert.equal(clean.coverage.checked_local_references, 4);
    assert.deepEqual(clean.missing_local_targets, []);
    assert.deepEqual(clean.csv[0].findings, []);
    fs.unlinkSync(path.join(root, 'logo.png'));
    fs.writeFileSync(path.join(root, 'bidder-data.csv'), '---\nlayout: none\n---\n{% for page in site.pages %}');
    const broken = inspectBuild(root, 'https://docs.example.test');
    assert.equal(broken.coverage.html, clean.coverage.html);
    assert.equal(broken.coverage.checked_local_references, clean.coverage.checked_local_references);
    assert.equal(broken.missing_local_targets.length, 1);
    assert.equal(broken.missing_local_targets[0].target, '/logo.png');
    assert.ok(broken.csv[0].findings.includes('unrendered_liquid'));
    fs.writeFileSync(path.join(root, 'logo.png'), 'fixture');
    fs.writeFileSync(path.join(root, 'bidder-data.csv'), 'id,name\na,A\n');
    const restored = inspectBuild(root, 'https://docs.example.test');
    assert.deepEqual(restored, clean);
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});

test('empty and symlinked output cannot produce a clean baseline', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'prebid-baseline-empty-'));
  try {
    assert.throws(() => inspectBuild(root, 'https://docs.example.test'), /No HTML/);
    fs.symlinkSync('/nonexistent', path.join(root, 'index.html'));
    assert.throws(() => inspectBuild(root, 'https://docs.example.test'), /symlink/);
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});

test('HTML fallbacks cannot satisfy asset or download references', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'prebid-baseline-collision-'));
  try {
    fs.writeFileSync(path.join(root, 'index.html'), '<main><img src="/missing.png"><script src="/gone.js"></script><a href="/data.csv" download>CSV</a></main>');
    for (const name of ['missing.png.html', 'gone.js.html', 'data.csv.html']) fs.writeFileSync(path.join(root, name), '<main>Wrong media</main>');
    assert.deepEqual(inspectBuild(root, 'https://docs.example.test').missing_local_targets.map(x => x.target).sort(),
      ['/data.csv', '/gone.js', '/missing.png']);
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});

test('dotted API page names are navigation, not inferred binary extensions', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'prebid-baseline-dotted-'));
  try {
    fs.mkdirSync(path.join(root, 'adServers.dfp.buildVideoUrl'));
    fs.writeFileSync(path.join(root, 'index.html'), '<a href="/adServers.dfp.buildVideoUrl">API</a>');
    fs.writeFileSync(path.join(root, 'adServers.dfp.buildVideoUrl/index.html'), '<head><link rel="canonical" href="https://docs.example.test/adServers.dfp.buildVideoUrl"></head><main>API</main>');
    assert.deepEqual(inspectBuild(root, 'https://docs.example.test').missing_local_targets, []);
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});
