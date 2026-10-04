import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
import {validateAuthoredContent, discoverAuthoredContent, compareFormatting} from './validate-authored-content.mjs';

const require = createRequire(import.meta.url);
const {validateConfig} = require('@docusaurus/core/lib/server/configValidation.js');

function fixture(t, files, docs = {}, overrides = {}) {
  const siteDir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'prebid-authored-test-')));
  t.after(() => fs.rmSync(siteDir, {recursive: true, force: true}));
  fs.mkdirSync(path.join(siteDir, 'content'));
  fs.writeFileSync(path.join(siteDir, '.markdownlint.json'), '{"default":true}\n');
  for (const [name, text] of Object.entries(files)) {
    const file = path.join(siteDir, name);
    fs.mkdirSync(path.dirname(file), {recursive: true});
    fs.writeFileSync(file, text);
  }
  const siteConfig = validateConfig({title: 'Source fixture', url: 'https://example.test', baseUrl: '/',
    presets: [['classic', {docs: {path: 'content', ...docs}, pages: false, blog: false}]],
    markdown: {format: 'detect'}, ...overrides}, 'fixture');
  return {siteDir, siteConfig};
}

test('real configured compiler accepts Markdown and MDX with existing compatibility conventions', async t => {
  const input = fixture(t, {
    'content/plain.md': '# Markdown {#legacy-id}\n\nLiteral {not valid JavaScript} and <user@example.test>.\n\n```js\nconst n = 1;\n```\n',
    'content/component.mdx': '# MDX {#legacy-id}\n\n<!-- old compatible comment -->\n\n:::note Old title\nSupported compatibility syntax.\n:::\n\n<Example value={1} />\n\n```js\nconst n = 1;\n```\n',
  });
  const report = await validateAuthoredContent(input);
  assert.equal(report.compilation_failures, 0);
  assert.equal(report.status, 'compiled');
  assert.equal(report.coverage.md, 1);
  assert.equal(report.coverage.mdx, 1);
  assert.equal(report.formatting.findings, 0);
  assert.equal(report.documents.length, 2);
});

test('format detection keeps CommonMark literal expressions while invalid MDX expressions fail', async t => {
  const input = fixture(t, {'content/plain.md': '# Literal\n\n{1 +\n', 'content/broken.mdx': '# Expression\n\n{1 +\n'});
  const report = await validateAuthoredContent(input);
  assert.equal(report.documents.length, 2);
  assert.equal(report.documents.find(row => row.path.endsWith('plain.md')).compiled, true);
  assert.equal(report.documents.find(row => row.path.endsWith('broken.mdx')).compiled, false);
  assert.equal(report.compilation_failures, 1);
  assert.equal(report.diagnostics[0].path, 'content/broken.mdx');
  assert.ok(report.diagnostics[0].line > 0);
});

test('frontmatter errors block both extensions and byte-invalid source is not silently replaced', async t => {
  const input = fixture(t, {'content/bad.md': '---\ntitle: [\n---\n# Bad\n',
    'content/bad.mdx': '---\ntitle: [\n---\n# Bad\n', 'content/binary.mdx': Buffer.from([255, 254, 0])});
  const report = await validateAuthoredContent(input);
  assert.equal(report.documents.length, 3);
  assert.equal(report.compilation_failures, 3);
  assert.equal(report.status, 'failed');
  assert.ok(report.diagnostics.some(row => row.rule_id === 'source:utf8'));
});

test('established formatting rule sees both syntax trees, not JSX-looking text heuristics', async t => {
  const input = fixture(t, {'content/plain.md': '# Markdown\n\n```\nconst n = 1;\n```\n',
    'content/component.mdx': '# MDX\n\n<Component />\n\n```\nconst n = 2;\n```\n'});
  const report = await validateAuthoredContent(input);
  assert.equal(report.compilation_failures, 0);
  assert.equal(report.formatting.findings, 2);
  assert.deepEqual(report.diagnostics.map(row => row.rule_id), ['remark-lint:fenced-code-flag', 'remark-lint:fenced-code-flag']);
  assert.ok(report.diagnostics.every(row => /^[a-f0-9]{64}$/.test(row.context_sha256)));
  assert.equal(report.formatting.verdict, 'observations_only_until_compared_with_independently_pinned_baseline');
});

test('excluded invalid drafts are visible exclusions; explicit imported partials are still compiled', async t => {
  const input = fixture(t, {'content/main.mdx': 'import Partial from "./_partial.mdx";\n\n# Main\n\n<Partial />\n',
    'content/_partial.mdx': '# Partial\n\n{1 +\n', 'content/_ignored.mdx': '{also invalid\n'});
  const report = await validateAuthoredContent(input);
  assert.equal(report.selection[0].selected, 1);
  assert.deepEqual(report.selection[0].excluded_files, ['_ignored.mdx', '_partial.mdx']);
  assert.equal(report.coverage.compilation_units, 2);
  assert.equal(report.coverage.imported_partials, 1);
  assert.equal(report.compilation_failures, 1);
  assert.equal(report.diagnostics[0].path, 'content/_partial.mdx');
  assert.ok(!report.documents.some(row => row.path.endsWith('_ignored.mdx')));
});

test('missing imported Markdown blocks instead of becoming an ignored partial', async t => {
  const input = fixture(t, {'content/main.mdx': 'import Partial from "./_missing.mdx";\n\n# Main\n\n<Partial />\n'});
  const report = await validateAuthoredContent(input);
  assert.equal(report.compilation_failures, 1);
  assert.equal(report.diagnostics[0].rule_id, 'docusaurus:markdown-import');
});

test('empty selectors and unsupported configuration cannot claim clean coverage', async t => {
  const ignored = fixture(t, {'content/_only.mdx': '# Excluded\n'});
  await assert.rejects(discoverAuthoredContent(ignored), /No selected/);
  const filtered = fixture(t, {'content/real.md': '# Real\n'}, {include: ['**/*.never']});
  await assert.rejects(discoverAuthoredContent(filtered), /No selected/);
  const unsupported = fixture(t, {'content/real.md': '# Real\n'});
  unsupported.siteConfig.presets.push(['unknown-preset', {}]);
  await assert.rejects(discoverAuthoredContent(unsupported), /Unsupported preset/);
});

test('configured version selection includes selected history without scanning retired versions', async t => {
  const files = {'content/current.md': '# Current\n', 'versions.json': '["1.0"]\n',
    'versioned_docs/version-1.0/old.mdx': '# Historical\n\n{broken\n'};
  const input = fixture(t, files);
  const all = await validateAuthoredContent(input);
  assert.equal(all.coverage.compilation_units, 2);
  assert.equal(all.compilation_failures, 1);
  const current = fixture(t, files, {onlyIncludeVersions: ['current']});
  const selected = await validateAuthoredContent(current);
  assert.equal(selected.coverage.compilation_units, 1);
  assert.equal(selected.compilation_failures, 0);
});

test('comparison ignores line shifts, detects changed code and repeated violations with multiplicity', async t => {
  const bad = '```\nconst n = 1;\n```\n';
  const baseline = await validateAuthoredContent(fixture(t, {'content/a.md': '# Title\n\n' + bad}));
  const shifted = await validateAuthoredContent(fixture(t, {'content/a.md': '# Title\n\nExtra prose.\n\n' + bad}));
  const retained = compareFormatting(shifted, baseline);
  assert.equal(retained.status, 'passed');
  assert.equal(retained.accepted_existing, 1);
  assert.notEqual(shifted.diagnostics[0].line, baseline.diagnostics[0].line);
  const repeated = await validateAuthoredContent(fixture(t, {'content/a.md': '# Title\n\n' + bad + '\n' + bad}));
  const extra = compareFormatting(repeated, baseline);
  assert.equal(extra.status, 'failed');
  assert.equal(extra.accepted_existing, 1);
  assert.equal(extra.new_findings.length, 1);
  const changed = await validateAuthoredContent(fixture(t, {'content/a.md': '# Title\n\n' + bad.replace('n = 1', 'n = 2')}));
  assert.equal(compareFormatting(changed, baseline).new_findings.length, 1);
  const fixed = await validateAuthoredContent(fixture(t, {'content/a.md': '# Title\n\n' + bad.replace('```\n', '```js\n')}));
  assert.equal(compareFormatting(fixed, baseline).resolved_findings, 1);
});

test('comparison refuses empty, incompatible or unsuccessful baseline reports', async t => {
  const report = await validateAuthoredContent(fixture(t, {'content/a.md': '# Valid\n'}));
  assert.throws(() => compareFormatting(report, {...report, documents: []}), /Empty/);
  assert.throws(() => compareFormatting(report, {...report, scope: {...report.scope, compiler: 'different'}}), /scope/);
  const failed = await validateAuthoredContent(fixture(t, {'content/a.mdx': '# Invalid\n\n{1 +\n'}));
  assert.throws(() => compareFormatting(report, failed), /Baseline source compilation failed/);
});

test('warning visibility changes do not masquerade as a different formatting parser', async t => {
  const files = {'content/a.md': '# Existing\n\n```\nconst n = 1;\n```\n'};
  const before = fixture(t, files, {}, {markdown: {format: 'detect', hooks: {onBrokenMarkdownLinks: 'ignore'}}});
  const after = fixture(t, files, {}, {markdown: {format: 'detect', hooks: {onBrokenMarkdownLinks: 'warn'}}});
  const baseline = await validateAuthoredContent(before);
  const candidate = await validateAuthoredContent(after);
  const comparison = compareFormatting(candidate, baseline);
  assert.equal(comparison.accepted_existing, 1);
  assert.equal(comparison.new_findings.length, 0);
  assert.equal(comparison.status, 'passed');
});
