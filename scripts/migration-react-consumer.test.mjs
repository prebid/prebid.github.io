import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {load} from 'cheerio';
import {componentHarness} from './migration-react-consumer.mjs';
import {validateAuthoredContent} from './validate-authored-content.mjs';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {validateConfig} = require('@docusaurus/core/lib/server/configValidation.js');
const expectations = JSON.parse(fs.readFileSync('migration/consumer-expectations.json'));
const item = id => {const row = expectations.cases.find(row => row.id === id); assert.ok(row, id); return row;};
const base = {biddercode: 'fixture', media_types: ['banner']};
const labels = {tcfeu_supported: '🇪🇺 TCF EU', usp_supported: '🇺🇸 USP CCPA', coppa_supported: '🇺🇸 US COPPA'};
function groups(html) {
  const $ = load(html); const result = {};
  $('.meta').each((_i, el) => {
    const title = $(el).find('.metaName').text();
    if (!['Supported', 'Unsupported', 'Check with bidder'].includes(title)) return;
    assert.equal(Object.hasOwn(result, title), false, `Duplicate group: ${title}`);
    result[title] = $(el).find('[aria-label]').map((_n, badge) => ({text: $(badge).text(), aria: $(badge).attr('aria-label')})).get();
  });
  return result;
}
function temp(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'prebid-consumer-test-')));
  t.after(() => fs.rmSync(root, {recursive: true, force: true})); return root;
}
async function compile(t, body) {
  const siteDir = temp(t); fs.mkdirSync(path.join(siteDir, 'docs'));
  fs.writeFileSync(path.join(siteDir, '.markdownlint.json'), '{"default":true}');
  fs.writeFileSync(path.join(siteDir, 'docs/caller.mdx'), body);
  const siteConfig = validateConfig({title: 'Component contract test', url: 'https://example.test', baseUrl: '/',
    presets: [['classic', {docs: {path: 'docs'}, pages: false, blog: false}]], markdown: {format: 'detect'}}, 'component-test');
  return validateAuthoredContent({siteDir, siteConfig});
}

test('independent consumer fixture artifacts are bound to immutable source objects', () => {
  assert.equal(expectations.cases.length, 14); assert.ok(Object.keys(expectations.artifacts).length >= 16);
  for (const artifact of Object.values(expectations.artifacts)) {
    const bytes = execFileSync('git', ['show', `${artifact.commit}:${artifact.path}`]);
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), artifact.sha256);
  }
});

test('actual feature component partitions explicit consent values and preserves each badge', () => {
  for (const id of ['consent-explicit-three-way-partition', 'consent-all-explicit-false', 'consent-all-explicit-true']) {
    const row = item(id); const html = componentHarness().render('BidderFeatures', row.input); const actual = groups(html);
    for (const [group, fields] of Object.entries(row.expected.groups)) {
      assert.deepEqual((actual[group] ?? []).map(badge => badge.text), fields.map(field => labels[field]));
      for (const [index, field] of fields.entries()) assert.equal(actual[group][index].aria,
        typeof row.expected.badge_aria === 'string' ? row.expected.badge_aria : row.expected.badge_aria[field]);
    }
    assert.equal(Object.values(actual).flat().length, 3);
  }
});

test('existing omitted defaults are observed unchanged while the policy is pending', () => {
  const actual = groups(componentHarness().render('BidderFeatures', base));
  assert.deepEqual(actual.Supported, []);
  assert.deepEqual(actual.Unsupported.map(badge => badge.text), Object.values(labels));
  assert.equal(actual['Check with bidder'], undefined);
});

test('actual table uses strict source-backed booleans, including existing AdGeneration data', () => {
  const row = item('index-strict-client-server-predicate');
  for (const variant of row.variants) {
    const meta = variant.omit_field ? {} : {pbjs: variant.input, pbs: variant.input};
    const $ = load(componentHarness().render('BidderTable', {bidders: [{title: 'Fixture', permalink: '/fixture', meta}]}));
    assert.deepEqual($('tbody td').map((_i, el) => $(el).text()).get(), ['Fixture', variant.expected_text, variant.expected_text]);
  }
  const bidders = JSON.parse(fs.readFileSync('docs/dev-docs/prebidjs/bidders.json'));
  const actual = bidders.find(row => row.meta.biddercode === 'adgeneration'); assert.ok(actual);
  assert.equal(actual.meta.pbs, 'no');
  const before = JSON.stringify(actual);
  const $ = load(componentHarness().render('BidderTable', {bidders: [actual]}));
  assert.deepEqual($('tbody td').map((_i, el) => $(el).text()).get(), ['Ad Generation', 'true', 'false']);
  assert.equal(JSON.stringify(actual), before);
  assert.match(fs.readFileSync('docs/dev-docs/prebidjs/index.mdx', 'utf8'), /<BidderTable bidders=\{bidders\} \/>/);
  const oldIndex = execFileSync('git', ['show', `${expectations.observed_consumer_commit}:docs/dev-docs/prebidjs/index.mdx`], {encoding: 'utf8'});
  const tables = oldIndex.match(/<table>[\s\S]*?<\/table>/g); assert.equal(tables.length, 1);
  const historical = `import React from 'react'; export default function Original({bidders}) {return (${tables[0]});}`;
  const module = path.resolve('src/components/BidderTable/index.tsx');
  const beforeAll = load(componentHarness({overrides: {[module]: historical}}).render('BidderTable', {bidders}));
  const afterAll = load(componentHarness().render('BidderTable', {bidders}));
  const rows = $ => $('tr').toArray().filter(el => $(el).find('td').length).map(el => $(el).find('td').map((_i, cell) => $(cell).text()).get());
  const oldRows = rows(beforeAll); const newRows = rows(afterAll);
  assert.equal(newRows.length, bidders.length); assert.ok(newRows.length > 600);
  const changed = newRows.flatMap((row, i) => JSON.stringify(row) === JSON.stringify(oldRows[i]) ? [] : [{before: oldRows[i], after: row}]);
  assert.deepEqual(changed, [{before: ['Ad Generation', 'true', 'true'], after: ['Ad Generation', 'true', 'false']}]);
});

test('GVL annotations and explicit arrays remain visible without changing raw identity', () => {
  for (const variant of item('annotated-gvl-preserves-information').variants) {
    const $ = load(componentHarness().render('BidderFeatures', {...base, gvl_id: variant.input}));
    assert.equal($('.meta').filter((_i, el) => $(el).find('.metaName').text() === 'GVL ID').find('.badge').text(), variant.visible_text);
  }
  const $ = load(componentHarness().render('BidderFeatures', {...base, gvl_id: 0}));
  assert.equal($('.meta').filter((_i, el) => $(el).find('.metaName').text() === 'GVL ID').find('.badge').text(), '0');
  for (const id of ['explicit-user-id-array', 'media-canonical-array']) {
    const row = item(id); const html = componentHarness().render('BidderFeatures', row.input);
    for (const entry of row.expected.visible_entries) assert.ok(load(html)('.badge').toArray().some(el => load(el).text() === entry));
  }
});

test('malformed explicit props and sparse arrays fail before rendering, with restored valid control', () => {
  const h = componentHarness(); const fixture = item('consent-malformed-explicit-values');
  for (const field of fixture.fields) for (const {value} of fixture.variants) assert.throws(() => h.render('BidderFeatures', {...base, [field]: value}), /explicit consumer projection/);
  for (const field of ['media_types', 'userIds', 'gpp_sids']) for (const value of [null, 'banner', new Array(1), [null]]) {
    assert.throws(() => h.render('BidderFeatures', {...base, [field]: value}), /explicit consumer projection/);
  }
  for (const props of [{pbjs: 'false'}, {media_types: ['audio']}, {unknown_typo: true}, {gvl_id: NaN},
    {multiformat_supported: {toString: () => 'will-bid-on-one'}}]) assert.throws(() => h.render('BidderFeatures', {...base, ...props}));
  assert.ok(h.render('BidderFeatures', base).includes('Features'));
});

test('real TOC producer preserves raw frontmatter without inserting defaults', async t => {
  const siteDir = temp(t); const raw = structuredClone(item('producer-lossless-frontmatter').input_frontmatter);
  const {tocPlugin} = componentHarness({root: fs.realpathSync('.')}).loadModule(path.resolve('_plugins/toc-plugin.ts'));
  const plugin = tocPlugin({siteDir}, {contentDocsId: 'fixture', filter: doc => doc.frontMatter.layout === 'bidder', output: 'out.json'});
  await plugin.allContentLoaded({allContent: {'docusaurus-plugin-content-docs': {fixture: {loadedVersions: [{versionName: 'current', docs: [
    {source: '@site/doc.mdx', permalink: '/fixture', title: 'Fixture', frontMatter: raw},
    {source: '@site/module.md', permalink: '/module', title: 'Module', frontMatter: {layout: 'page'}},
  ]}]}}}, actions: {}});
  const output = JSON.parse(fs.readFileSync(path.join(siteDir, 'out.json')));
  assert.equal(output.length, 1); assert.deepEqual(output[0].meta, raw);
  assert.equal(Object.hasOwn(output[0].meta, 'coppa_supported'), false);
});

test('M1 validates direct, aliased, namespace and nested JSX call sites; malformed calls fail', async t => {
  const good = '<B key="stable" biddercode="fixture" media_types={["banner"]} usp_supported={false} />';
  const bad = good.replace('usp_supported={false}', 'usp_supported="false"');
  const importLine = "import B from '@site/src/components/BidderFeatures';\n\n";
  const wrappers = [x => x, x => `{${x}}`, x => `<div data-value={${x}} />`, x => `<div {...{data: ${x}}} />`];
  for (const wrapper of wrappers) {
    const restored = await compile(t, importLine + wrapper(good));
    assert.equal(restored.compilation_failures, 0, JSON.stringify(restored.diagnostics));
    assert.equal(restored.documents[0].bidder_component_calls, 1);
    const broken = await compile(t, importLine + wrapper(bad)); assert.equal(broken.compilation_failures, 1);
  }
  for (const importSource of ["import {default as B} from '@site/src/components/BidderFeatures/index.tsx';",
    "import * as Features from '@site/src/components/BidderFeatures';"]) {
    const name = importSource.includes('*') ? 'Features.default' : 'B';
    const output = await compile(t, importSource + '\n\n' + good.replace('<B ', `<${name} `));
    assert.equal(output.compilation_failures, 0); assert.equal(output.documents[0].bidder_component_calls, 1);
  }
  for (const body of [good.replace(' media_types={["banner"]}', ''), good.replace('usp_supported={false}', '{...flags}'),
    good.replace('usp_supported={false}', 'usp_supported={someFlag}'), good.replace('usp_supported={false}', 'usp_supported={null}')]) {
    assert.equal((await compile(t, importLine + body)).compilation_failures, 1);
  }
  assert.equal((await compile(t, importLine.replace("BidderFeatures'", "BidderFeatures/index.tsx?probe'") + good)).compilation_failures, 1);
  assert.equal((await compile(t, importLine + '{<B biddercode="fixture" media_types={["banner"]}> </B>}')).compilation_failures, 1);
  assert.throws(() => componentHarness().render('BidderFeatures', {...base, children: ' '}), /children/);
});

test('in-memory single-line regressions fail the same rendered behavior obligations', () => {
  const file = path.resolve('src/components/BidderFeatures/index.tsx'); const original = fs.readFileSync(file, 'utf8');
  const input = item('consent-explicit-three-way-partition').input;
  const baseline = groups(componentHarness().render('BidderFeatures', input)); assert.equal(baseline.Supported.length, 1);
  const marker = 'consentFeatures.filter(([flag]) => flag === true)'; assert.ok(original.includes(marker));
  const mutant = groups(componentHarness({overrides: {[file]: original.replace(marker, 'consentFeatures.filter(([flag]) => flag)')}}).render('BidderFeatures', input));
  assert.notDeepEqual(mutant, baseline);
  const table = path.resolve('src/components/BidderTable/index.tsx'); const text = fs.readFileSync(table, 'utf8');
  assert.ok(text.includes('bidder.meta.pbs === true'));
  const props = {bidders: [{title: 'Fixture', permalink: '/fixture', meta: {pbs: 'no'}}]};
  assert.notEqual(componentHarness({overrides: {[table]: text.replace('bidder.meta.pbs === true', 'bidder.meta.pbs')}}).render('BidderTable', props),
    componentHarness().render('BidderTable', props));
  assert.deepEqual(groups(componentHarness().render('BidderFeatures', input)), baseline);
});
