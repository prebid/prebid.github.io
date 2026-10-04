import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {PILOT_SOURCES, convertDocument, applyRepair, sha256, MOBILE_REPAIR} from './migration-convert.mjs';
import {selection, pinnedSources, convertSlice, compileSlice, reconcileReplay, inspectEmitted, checkEmittedMetadata} from './migration-pilot.mjs';
import {checkPilot, verifyPilotExpectations, checkPilotParserControls} from './migration-pilot-checks.mjs';
import {planStaging, applyStaging} from './migration-staging.mjs';
import {validateMetadata} from './migration-metadata.mjs';

const sources = pinnedSources('B');
const pin = selection.snapshots.B.commit;
const repaired = ['mobile-rewarded-process-typo'];
const slice = () => convertSlice('B', {sources});
const check = files => checkPilot({sourceCommit: pin, files, migrationOverrides: repaired});
function temp(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'prebid-m2-test-')));
  t.after(() => fs.rmSync(root, {recursive: true, force: true})); return root;
}
function convert(content, sourcePath = PILOT_SOURCES[2], extras = {}) {
  return convertDocument({sourcePath, sourceCommit: pin, adapterHashes: selection.snapshots.B.adapterHashes,
    sources: {...sources, [sourcePath]: content, ...extras}});
}

test('pinned independent source obligations and both real snapshots remain nonempty', async () => {
  assert.ok(verifyPilotExpectations().artifacts > 0);
  assert.equal(checkPilotParserControls().status, 'passed');
  for (const label of ['A', 'B']) {
    const result = convertSlice(label);
    const verdict = await checkPilot({sourceCommit: selection.snapshots[label].commit,
      files: result.semanticFiles, migrationOverrides: repaired});
    assert.equal(verdict.status, 'passed', JSON.stringify(verdict.checks.filter(row => row.status === 'failed')));
    assert.equal(Object.keys(result.semanticFiles).length, 7);
    assert.equal(result.files.length, 9);
    assert.ok(result.metadata.every(row => row.validation.valid));
    assert.ok(result.metadata.some(row => row.validation.status === 'UNRESOLVED'));
  }
});

test('protected examples retain exact bytes, Liquid, internal links, images, blank lines and literal markers', () => {
  const example = '```text\n{{ site.baseurl }}/assets/images/a.html\n{% include legal-warning.html %}\n\n\n\nM2TABBOUNDARY\nM2TABBOUNDARY\n```';
  const inline = '`{{ site.baseurl }}/assets/images/a.html`';
  const input = `---\ntitle: Fixture\n---\n# Fixture\n\n${example}\n\n${inline}\n\n[Link](/assets/images/a.html?q=1#id)\n`;
  const result = convert(input);
  assert.equal(result.files.length, 1);
  assert.equal(result.files[0].content, input);
});

test('whitespace-control captures preserve their code instead of evaluating it', () => {
  const payload = '\n<p>{{ site.baseurl }}</p>\n';
  const input = `---\ntitle: Fixture\n---\n{%- capture html -%}${payload}{%- endcapture -%}\n{% capture js %}const n = 1;{% endcapture %}\n{% include code/web-example.html html=html js=js %}`;
  const result = convert(input);
  assert.ok(result.semanticText.includes(payload));
  assert.ok(result.semanticText.includes('const n = 1;'));
});

test('unknown includes, missing variables, unsupported syntax and changed adapters require manual review', () => {
  for (const body of ['{% include unknown.md %}', '{{ unknown.value }}', '{: .unreviewed }']) {
    assert.throws(() => convert(`---\ntitle: Test\n---\n${body}`));
  }
  const name = '_includes/code/web-example.html';
  assert.throws(() => convert(sources[PILOT_SOURCES[5]], PILOT_SOURCES[5], {[name]: sources[name] + '\nchanged'}), /adapter/);
  assert.throws(() => convertDocument({sourcePath: 'unknown.md', sources, sourceCommit: pin}), /bounded/);
});

test('each bidder notice condition is required independently', () => {
  const key = '_layouts/bidder.html';
  const invalid = sources[key].replace('page.s2s_only == true', 'page.enable_download == false');
  assert.throws(() => convert(sources[PILOT_SOURCES[1]], PILOT_SOURCES[1], {[key]: invalid}), /notice template changed/);
});

test('shared include changes refresh both dependent documents and keep other documents byte-identical', async () => {
  const original = slice(); const key = '_includes/dev-docs/vendor-exception.md';
  const updated = sources[key].replace('Prebid.org recommends', 'Synthetic replay notice: Prebid.org recommends');
  const next = convertSlice('B', {sources: {...sources, [key]: updated}});
  assert.deepEqual(PILOT_SOURCES.filter(name => original.semanticFiles[name] !== next.semanticFiles[name]), PILOT_SOURCES.slice(2, 4));
  assert.equal((await checkPilot({sourceCommit: pin, files: next.semanticFiles, migrationOverrides: repaired,
    includeOverrides: {[key]: updated}})).status, 'passed');
  for (const row of next.documents.slice(2, 4)) assert.equal(row.dependencies.find(dep => dep.path === key).sha256, sha256(updated));
});

test('source-only semantic controls reject meaningful losses then pass restoration', async () => {
  const good = slice().semanticFiles;
  assert.equal((await check(good)).status, 'passed');
  const mutants = [
    [PILOT_SOURCES[5], 'This example uses a test version of Prebid.js hosted on our CDN that is not recommended for production use.', ''],
    [PILOT_SOURCES[5], 'This example includes all available adapters and modules.', ''],
    [PILOT_SOURCES[1], 'This adapter is not available in current versions of Prebid.js.', ''],
    [PILOT_SOURCES[2], 'Important: This resource should not be construed as legal advice', 'Notice removed'],
    [PILOT_SOURCES[3], 'Prebid.org recommends working with a privacy lawyer', 'Notice removed'],
    [PILOT_SOURCES[4], 'GoogleMobileAds.AdReward', 'GADAdReward'],
    [PILOT_SOURCES[4], 'defaultValue="gma12"', 'defaultValue="gma11"'],
    [PILOT_SOURCES[4], MOBILE_REPAIR.after, MOBILE_REPAIR.before],
    [PILOT_SOURCES[5], 'placement_id', 'placementId'],
    [PILOT_SOURCES[5], '700', '701'],
    [PILOT_SOURCES[0], 'appnexus-bid-params', 'lost-anchor'],
  ];
  for (const [name, before, after] of mutants) {
    assert.ok(good[name].includes(before), `Negative control did not select input: ${before}`);
    const changed = {...good, [name]: good[name].replace(before, after)};
    assert.equal((await check(changed)).status, 'failed', `Undetected mutation: ${before}`);
  }
  assert.equal((await check(good)).status, 'passed');
  await assert.rejects(check({}), /Missing or empty/);
  const csv = good[PILOT_SOURCES[6]];
  const extraRow = csv.trimEnd().split('\n').at(-1).replace(/^lemmadigital,/, 'unexpected_bidder,');
  assert.equal((await check({...good, [PILOT_SOURCES[6]]: csv + extraRow + '\n'})).status, 'failed');
});

test('acceptance follows actual output bytes and detects valid but missing content or metadata', async () => {
  const good = slice();
  assert.equal((await check(inspectEmitted(good.files))).status, 'passed');
  const missingContent = good.files.map(file => file.path === PILOT_SOURCES[1] ? {...file, content: '# Lost bidder content\n'} : file);
  assert.equal((await check(inspectEmitted(missingContent))).status, 'failed');
  const missingMetadata = good.files.map(file => file.path === PILOT_SOURCES[1]
    ? {...file, content: file.content.replace('gvl_id: 410 (adtelligent)\n', '')} : file);
  assert.equal(checkEmittedMetadata(missingMetadata, good.metadata).find(row => row.sourcePath === PILOT_SOURCES[1]).preserved, false);
  const missingPartial = good.files.map(file => file.path.endsWith('.mdx')
    ? {...file, content: file.content.replace('<Before />', '')} : file);
  assert.throws(() => inspectEmitted(missingPartial), /wrapper composition/);
});

test('lossless metadata rejects dropped fields and fabricated policy approval', () => {
  const {record} = slice().metadata[1];
  assert.equal(validateMetadata(record, {source: sources[PILOT_SOURCES[1]]}).valid, true);
  for (const mutate of [value => delete value.fields.gvl_id, value => {value.full_m2_acceptance = true;}]) {
    const broken = structuredClone(record); mutate(broken);
    assert.equal(validateMetadata(broken, {source: sources[PILOT_SOURCES[1]]}).valid, false);
  }
});

test('known-base reconciliation preserves explicit repair, while upstream overlap conflicts', async t => {
  const a = convertSlice('A', {repair: false}); const local = convertSlice('A');
  const b = convertSlice('B', {repair: false});
  const replay = reconcileReplay(a.semanticFiles, local.semanticFiles, b.semanticFiles, temp(t));
  assert.equal(replay.selected, 7); assert.deepEqual(replay.conflicts, []);
  assert.equal((await check(replay.files)).status, 'passed');
  const changed = {...b.semanticFiles, [MOBILE_REPAIR.sourcePath]: b.semanticFiles[MOBILE_REPAIR.sourcePath].replace(MOBILE_REPAIR.before, 'The lifecycle for displaying the Rewarded Ad')};
  assert.ok(reconcileReplay(a.semanticFiles, local.semanticFiles, changed, temp(t)).conflicts.includes(MOBILE_REPAIR.sourcePath));
  assert.throws(() => applyRepair({...b.documents[4], semanticText: changed[MOBILE_REPAIR.sourcePath]}), /repair conflicts/);
});

test('generated pilot files survive rename/delete/add and interruption without retaining obsolete output', t => {
  const root = temp(t); const original = slice().files;
  fs.writeFileSync(path.join(root, 'framework-owned.txt'), 'retain framework work');
  applyStaging(planStaging({root, files: original}));
  const removed = original[1].path;
  const renamed = original[0].path;
  const next = original.filter(file => file.path !== removed).map(file => file.path === renamed ? {...file, path: 'synthetic/renamed-bidder.md'} : file);
  next.push({path: 'synthetic/added.md', content: '# Explicitly synthetic lifecycle fixture\n'});
  const plan = planStaging({root, files: next});
  assert.equal(applyStaging(plan, {dryRun: true}).status, 'dry-run');
  assert.ok(fs.existsSync(path.join(root, removed)));
  assert.throws(() => applyStaging(plan, {failAfter: 2}), /interruption/);
  assert.equal(applyStaging(plan).recovered, true);
  assert.equal(fs.existsSync(path.join(root, removed)), false);
  assert.equal(fs.existsSync(path.join(root, renamed)), false);
  assert.equal(fs.readFileSync(path.join(root, 'framework-owned.txt'), 'utf8'), 'retain framework work');
  assert.equal(applyStaging(planStaging({root, files: next})).status, 'unchanged');
});

test('actual Docusaurus parsers compile every staged document and imported partial; invalid MDX fails', async t => {
  const good = slice().files;
  const report = await compileSlice(temp(t), good);
  assert.equal(report.compilation_failures, 0, JSON.stringify(report.diagnostics));
  assert.equal(report.coverage.compilation_units, 8);
  assert.equal(report.coverage.imported_partials, 2);
  const bad = good.map(file => file.path.endsWith('.mdx') ? {...file, content: file.content + '\n{1 +\n'} : file);
  const broken = await compileSlice(temp(t), bad);
  assert.ok(broken.compilation_failures > 0);
});

test('all compiler fixture writers share collision and root confinement guards', async t => {
  const root = temp(t); const outside = temp(t);
  fs.symlinkSync(outside, path.join(root, 'static'), 'dir');
  await assert.rejects(compileSlice(root, slice().files), /Symlink/);
  assert.deepEqual(fs.readdirSync(outside), []);
  fs.unlinkSync(path.join(root, 'static'));
  fs.writeFileSync(path.join(root, '.markdownlint.json'), 'manual config');
  await assert.rejects(compileSlice(root, slice().files), /collision/);
  assert.equal(fs.readFileSync(path.join(root, '.markdownlint.json'), 'utf8'), 'manual config');
  assert.equal(fs.existsSync(path.join(root, 'content')), false);
});

test('retired legacy writer fails closed without creating destinations or reports', t => {
  const root = temp(t);
  const result = spawnSync(process.execPath, [path.resolve('scripts/migrate-devdocs.mjs'), '--source', root, '--dest', path.join(root, 'output')], {encoding: 'utf8'});
  assert.equal(result.status, 1); assert.match(result.stderr, /retired/);
  assert.deepEqual(fs.readdirSync(root), []);
});
