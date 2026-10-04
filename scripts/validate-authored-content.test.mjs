import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
import {validateAuthoredContent, discoverAuthoredContent, compareFormatting} from './validate-authored-content.mjs';

const require = createRequire(import.meta.url);
const {validateConfig} = require('@docusaurus/core/lib/server/configValidation.js');
const {loadI18n} = require('@docusaurus/core/lib/server/i18n.js');
const docsFactory = require('@docusaurus/plugin-content-docs').default;

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
  assert.equal((await validateAuthoredContent(before)).site_reporting_policy.onBrokenMarkdownLinks, 'ignore');
  assert.equal((await validateAuthoredContent(after)).site_reporting_policy.onBrokenMarkdownLinks, 'warn');
});

test('original strict reporting settings survive source compilation for the site acceptance gate', async t => {
  const input = fixture(t, {'content/main.md': '# Main\n'}, {}, {
    onBrokenLinks: 'throw', onBrokenAnchors: 'throw',
    markdown: {format: 'detect', hooks: {onBrokenMarkdownLinks: 'throw'}},
  });
  const report = await validateAuthoredContent(input);
  assert.deepEqual(report.site_reporting_policy,
    {onBrokenLinks: 'throw', onBrokenAnchors: 'throw', onBrokenMarkdownLinks: 'throw'});
  assert.equal(report.compilation_failures, 0);
});

test('single-locale translations are rejected when explicit or inferred, with a restored control', async t => {
  const input = fixture(t, {'content/main.mdx': '# Original\n'}, {sidebarPath: false});
  const baseline = await validateAuthoredContent(input);
  const translated = path.join(input.siteDir, 'i18n/en/docusaurus-plugin-content-docs/current/main.mdx');
  fs.mkdirSync(path.dirname(translated), {recursive: true});
  fs.writeFileSync(translated, '# Translation\n\n```\nconst n = 1;\n```\n');
  const i18n = await loadI18n({siteDir: input.siteDir, config: input.siteConfig, currentLocale: 'en',
    automaticBaseUrlLocalizationDisabled: false});
  assert.equal(i18n.localeConfigs.en.translate, true);
  const {instances} = await discoverAuthoredContent({...input,
    siteConfig: {...input.siteConfig, i18n: {...input.siteConfig.i18n, localeConfigs: {en: {translate: false}}}}});
  const plugin = await docsFactory({...input, i18n, baseUrl: '/',
    generatedFilesDir: path.join(input.siteDir, '.docusaurus'), localizationDir: path.join(input.siteDir, 'i18n/en')}, instances[0].options);
  const content = await plugin.loadContent();
  assert.deepEqual(content.loadedVersions.flatMap(version => version.docs.map(doc => doc.source)),
    ['@site/i18n/en/docusaurus-plugin-content-docs/current/main.mdx']);
  await assert.rejects(validateAuthoredContent(input), /Translated authored sources are unsupported/);
  fs.rmSync(path.join(input.siteDir, 'i18n'), {recursive: true});
  assert.equal(compareFormatting(await validateAuthoredContent(input), baseline).status, 'passed');
  input.siteConfig.i18n.localeConfigs.en = {translate: true};
  await assert.rejects(validateAuthoredContent(input), /Translated authored sources are unsupported/);
  input.siteConfig.i18n.localeConfigs.en = {translate: false};
  assert.equal(compareFormatting(await validateAuthoredContent(input), baseline).status, 'passed');
});

test('standard factory plugins select new content and preserve formatting failure and restoration', async t => {
  const input = fixture(t, {'content/main.md': '# Main\n', 'second/main.mdx': '# Second\n'}, {},
    {plugins: [[docsFactory, {id: 'second', path: 'second', sidebarPath: false}]]});
  const baseline = await validateAuthoredContent(input);
  assert.deepEqual(baseline.documents.map(row => row.path), ['second/main.mdx', 'content/main.md']);
  assert.equal(baseline.formatting.findings, 0);
  const file = path.join(input.siteDir, 'second/main.mdx');
  fs.writeFileSync(file, '# Second\n\n```\nconst n = 1;\n```\n');
  const broken = await validateAuthoredContent(input);
  assert.equal(broken.formatting.findings, 1);
  assert.equal(compareFormatting(broken, baseline).status, 'failed');
  input.siteConfig.plugins[0][0] = require.resolve('@docusaurus/plugin-content-docs');
  assert.equal(compareFormatting(await validateAuthoredContent(input), baseline).status, 'failed');
  fs.writeFileSync(file, '# Second\n');
  assert.equal(compareFormatting(await validateAuthoredContent(input), baseline).status, 'passed');
  input.siteConfig.plugins.push([require('@docusaurus/plugin-content-blog').default, {}]);
  await assert.rejects(discoverAuthoredContent(input), /Blog content is outside/);
});

test('exact module identities include a separate source installation and classic preset exports', async t => {
  const input = fixture(t, {'content/main.md': '# Main\n', 'pages/main.mdx': '# Page\n'});
  // Copy only the installed packages under test; their dependencies remain the
  // shared read-only installation. This creates distinct real module exports.
  for (const name of ['@docusaurus/plugin-content-docs', '@docusaurus/plugin-content-pages', '@docusaurus/preset-classic']) {
    const installedRoot = path.dirname(path.dirname(require.resolve(name)));
    const copiedRoot = path.join(input.siteDir, 'node_modules', name);
    fs.mkdirSync(copiedRoot, {recursive: true});
    fs.copyFileSync(path.join(installedRoot, 'package.json'), path.join(copiedRoot, 'package.json'));
    fs.cpSync(path.join(installedRoot, 'lib'), path.join(copiedRoot, 'lib'), {recursive: true});
    fs.symlinkSync(path.resolve(installedRoot, '../..'), path.join(copiedRoot, 'node_modules'));
  }
  const sourceRequire = createRequire(path.join(input.siteDir, 'package.json'));
  const sourceDocs = sourceRequire('@docusaurus/plugin-content-docs').default;
  assert.notEqual(sourceDocs, docsFactory);
  for (const docs of [sourceDocs, sourceRequire.resolve('@docusaurus/plugin-content-docs')]) {
    input.siteConfig.presets = [];
    input.siteConfig.plugins = [[docs, {path: 'content'}],
      [sourceRequire('@docusaurus/plugin-content-pages').default, {path: 'pages'}]];
    const report = await validateAuthoredContent(input);
    assert.deepEqual(report.documents.map(row => row.path), ['content/main.md', 'pages/main.mdx']);
  }
  for (const preset of [require('@docusaurus/preset-classic').default,
    sourceRequire('@docusaurus/preset-classic').default, sourceRequire.resolve('@docusaurus/preset-classic')]) {
    input.siteConfig.plugins = [];
    input.siteConfig.presets = [[preset, {docs: {path: 'content'}, pages: {path: 'pages'}, blog: false}]];
    assert.equal((await validateAuthoredContent(input)).documents.length, 2);
  }
});

test('unrecognized factories are not identified by name or invoked, and ambiguous exports fail', async t => {
  let invoked = false;
  function pluginContentDocs() { invoked = true; throw new Error('Do not invoke arbitrary factories'); }
  const input = fixture(t, {'content/main.md': '# Main\n'}, {}, {plugins: [pluginContentDocs]});
  const discovery = await discoverAuthoredContent(input);
  assert.equal(invoked, false);
  assert.ok(discovery.ignoredPlugins.includes('function:pluginContentDocs'));
  input.siteConfig.presets.push([pluginContentDocs, {}]);
  await assert.rejects(discoverAuthoredContent(input), /Unsupported preset/);
  assert.equal(invoked, false);
  input.siteConfig.presets.pop();
  const packageRoot = path.join(input.siteDir, 'node_modules/@docusaurus/plugin-content-pages');
  fs.mkdirSync(packageRoot, {recursive: true});
  fs.writeFileSync(path.join(packageRoot, 'package.json'), '{"name":"@docusaurus/plugin-content-pages","main":"index.cjs"}');
  fs.writeFileSync(path.join(packageRoot, 'index.cjs'), `module.exports = require(${JSON.stringify(require.resolve('@docusaurus/plugin-content-docs'))});\n`);
  await assert.rejects(discoverAuthoredContent(input), /Ambiguous standard Docusaurus module identity/);
});

test('cross-root imports fail before applying importer plugins, with an in-root restored control', async t => {
  function supplyLanguage() { return tree => { for (const node of tree.children) if (node.type === 'code') node.lang = 'text'; }; }
  const input = fixture(t, {'content/main.mdx': 'import Partial from "./_partial.mdx";\n\n<Partial />\n',
    'content/_partial.mdx': '```\nconst n = 1;\n```\n', 'shared.mdx': '```\nconst n = 1;\n```\n',
    'second/main.md': '# Second\n', 'second/_partial.mdx': '```\nconst n = 1;\n```\n'},
  {remarkPlugins: [supplyLanguage]}, {plugins: [['@docusaurus/plugin-content-docs', {id: 'second', path: 'second'}]]});
  const baseline = await validateAuthoredContent(input);
  assert.equal(baseline.coverage.imported_partials, 1);
  assert.equal(baseline.formatting.findings, 0);
  const main = path.join(input.siteDir, 'content/main.mdx');
  for (const specifier of ['@site/shared.mdx', '../shared.mdx', '@site/second/_partial.mdx']) {
    fs.writeFileSync(main, `import Partial from ${JSON.stringify(specifier)};\n\n<Partial />\n`);
    await assert.rejects(validateAuthoredContent(input), /Cross-root Markdown\/MDX import/);
  }
  fs.writeFileSync(main, 'import Partial from "@site/content/_partial.mdx";\n\n<Partial />\n');
  assert.equal(compareFormatting(await validateAuthoredContent(input), baseline).status, 'passed');
  input.siteConfig.plugins.push(['@docusaurus/plugin-content-pages', {path: 'content'}]);
  await assert.rejects(validateAuthoredContent(input), /Ambiguous content-root ownership/);
  input.siteConfig.plugins.pop();
  assert.equal(compareFormatting(await validateAuthoredContent(input), baseline).status, 'passed');
});

test('nested literal dynamic imports and re-exports follow partials and retain negative controls', async t => {
  const main = 'export const load = () => ({nested: () => import("./_partial.mdx")});\n\n# Main\n';
  const input = fixture(t, {'content/main.mdx': main, 'content/_partial.mdx': '# Partial\n'});
  const baseline = await validateAuthoredContent(input);
  assert.equal(baseline.coverage.imported_partials, 1);
  const partial = path.join(input.siteDir, 'content/_partial.mdx');
  fs.writeFileSync(partial, '# Partial\n\n```\nconst n = 1;\n```\n');
  const broken = await validateAuthoredContent(input);
  assert.equal(broken.formatting.findings, 1);
  assert.equal(compareFormatting(broken, baseline).status, 'failed');
  const mainFile = path.join(input.siteDir, 'content/main.mdx');
  for (const source of [
    'export const load = () => import(`./_partial.mdx`);\n',
    '{import("./_partial.mdx")}\n',
    '<div data-value={import("./_partial.mdx")} />\n',
    '<div {...{data: import("./_partial.mdx")}} />\n',
    'export {default as Partial} from "./_partial.mdx";\n',
    'export * from "./_partial.mdx";\n',
  ]) {
    fs.writeFileSync(mainFile, source);
    const report = await validateAuthoredContent(input);
    assert.equal(report.coverage.imported_partials, 1);
    assert.equal(report.formatting.findings, 1);
  }
  fs.writeFileSync(mainFile, 'export const load = () => import("package/_partial.mdx");\n');
  await assert.rejects(validateAuthoredContent(input), /Unsupported Markdown import alias/);
  fs.writeFileSync(mainFile, main.replace('./_partial.mdx', './_missing.mdx'));
  assert.equal((await validateAuthoredContent(input)).compilation_failures, 1);
  const uppercase = path.join(input.siteDir, 'content/_uppercase.MDX');
  fs.writeFileSync(uppercase, '# Uppercase\n\n```\nconst n = 1;\n```\n');
  for (const source of [
    'import Partial from "./_uppercase.MDX";\n\n<Partial />\n',
    'export const load = () => import("./_uppercase.MDX");\n',
  ]) {
    fs.writeFileSync(mainFile, source);
    const report = await validateAuthoredContent(input);
    assert.equal(report.coverage.imported_partials, 1);
    assert.equal(report.documents.find(row => row.path === 'content/_uppercase.MDX')?.format, 'mdx');
    assert.equal(report.formatting.findings, 1);
  }
  fs.writeFileSync(mainFile, main);
  fs.writeFileSync(partial, '# Partial\n');
  assert.equal(compareFormatting(await validateAuthoredContent(input), baseline).status, 'passed');
  fs.writeFileSync(mainFile, 'export const load = (name) => import(`./${name}.mdx`);\n');
  const nonliteral = await validateAuthoredContent(input);
  assert.equal(nonliteral.coverage.imported_partials, 0);
  assert.ok(nonliteral.limitations.some(limit => limit.includes('non-literal dynamic imports')));
  const explicitUppercase = fixture(t, {'content/selected.MDX': '# Uppercase\n'}, {include: ['**/*.MDX']});
  const uppercaseBaseline = await validateAuthoredContent(explicitUppercase);
  assert.deepEqual(uppercaseBaseline.documents.map(row => row.path), ['content/selected.MDX']);
  assert.equal(uppercaseBaseline.compilation_failures, 0);
  assert.equal(uppercaseBaseline.formatting.findings, 0);
  const selectedUppercase = path.join(explicitUppercase.siteDir, 'content/selected.MDX');
  fs.writeFileSync(selectedUppercase, '# Uppercase\n\n```\nconst n = 1;\n```\n');
  assert.equal(compareFormatting(await validateAuthoredContent(explicitUppercase), uppercaseBaseline).status, 'failed');
  fs.writeFileSync(selectedUppercase, '# Uppercase\n');
  assert.equal(compareFormatting(await validateAuthoredContent(explicitUppercase), uppercaseBaseline).status, 'passed');
});
