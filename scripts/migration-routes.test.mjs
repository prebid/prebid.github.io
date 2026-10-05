import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {parseGeneratedRoutes} from './migration-routes.mjs';

const require = createRequire(import.meta.url);
const {generateRoutesCode} = require('@docusaurus/core/lib/server/codegen/codegenRoutes.js');
const generated = configs => {
  const result = generateRoutesCode(configs);
  return {routesSource: result.routesConfig, chunkMap: result.routesChunkNames};
};
const route = (path, extra = {}) => ({path, component: `@site/components/${path}.js`, ...extra});
const contexts = report => report.bindings.map(({path, exact, ancestors, leaf}) => ({path, exact, ancestors, leaf}));

test('installed Docusaurus generator separates nested public paths from every internal binding', () => {
  const input = generated([route('/docs', {routes: [route('/docs', {routes: [route('/docs/one', {exact: true})]})]}), route('/public-abc', {exact: true})]);
  const report = parseGeneratedRoutes(input);
  assert.deepEqual(report.paths, ['/docs', '/docs/one', '/public-abc']);
  assert.deepEqual(contexts(report), [
    {path: '/docs', exact: false, ancestors: [], leaf: false},
    {path: '/docs', exact: false, ancestors: ['/docs'], leaf: false},
    {path: '/docs/one', exact: true, ancestors: ['/docs', '/docs'], leaf: true},
    {path: '/public-abc', exact: true, ancestors: [], leaf: true},
  ]);
  assert.deepEqual(report.fallback, {path: '*'});
  assert.equal(report.bindings.length, 4);
  assert.deepEqual(report.chunkKeys, Object.keys(input.chunkMap).sort());
  for (const binding of report.bindings) {
    assert.equal(binding.key, `${binding.path}-${binding.hash}`);
    assert.ok(binding.chunkIds.includes(input.chunkMap[binding.key].__comp));
  }
  assert.equal(report.paths.includes('*'), false);
  assert.deepEqual(report.leafPaths, ['/docs/one', '/public-abc']);
});

test('content and context hash changes retain public paths and semantic routing contexts', () => {
  const before = generated([route('/docs', {context: {plugin: '@generated/plugin-before.json'}, routes: [route('/docs/next-abc', {exact: true})]})]);
  const after = generated([route('/docs', {context: {plugin: '@generated/plugin-after.json'}, routes: [route('/docs/next-abc', {exact: true})]})]);
  const a = parseGeneratedRoutes(before); const b = parseGeneratedRoutes(after);
  assert.notDeepEqual(a.chunkKeys, b.chunkKeys, 'generator must actually change an internal key');
  assert.notDeepEqual(a.chunkIds, b.chunkIds, 'changed dependency must reach chunk IDs');
  assert.deepEqual(a.paths, ['/docs', '/docs/next-abc']);
  assert.deepEqual(b.paths, a.paths);
  assert.deepEqual(contexts(b), contexts(a));
});

test('real route deletion remains observable and legitimate hash-like path suffixes survive verbatim', () => {
  const a = parseGeneratedRoutes(generated([route('/keep-abc'), route('/gone-1234')]));
  const b = parseGeneratedRoutes(generated([route('/keep-abc')]));
  assert.deepEqual(a.paths.filter(value => !b.paths.includes(value)), ['/gone-1234']);
  assert.deepEqual(b.paths, ['/keep-abc']);
});

test('same-path context deletion and exact changes remain observable without ordinal sibling identities', () => {
  const before = parseGeneratedRoutes(generated([route('/docs', {routes: [route('/docs', {exact: true})]})]));
  const fewer = parseGeneratedRoutes(generated([route('/docs')]));
  assert.deepEqual(before.paths, fewer.paths);
  assert.equal(before.bindings.length, 2); assert.equal(fewer.bindings.length, 1);
  assert.notDeepEqual(contexts(before), contexts(fewer));
  const sibling = parseGeneratedRoutes(generated([route('/new'), route('/docs', {routes: [route('/docs', {exact: true})]})]));
  assert.deepEqual(contexts(sibling).filter(value => value.path === '/docs'), contexts(before));
  const differentExact = parseGeneratedRoutes(generated([route('/docs', {exact: true})]));
  assert.notDeepEqual(contexts(fewer), contexts(differentExact));
});

test('deleting the root leaf is detected while its same-path wrapper and unique path remain', () => {
  const before = parseGeneratedRoutes(generated([route('/', {routes: [route('/', {exact: true}), route('/kept', {exact: true})]})]));
  const after = parseGeneratedRoutes(generated([route('/', {routes: [route('/kept', {exact: true})]})]));
  assert.deepEqual(before.paths, ['/', '/kept']);
  assert.deepEqual(after.paths, before.paths);
  assert.deepEqual(before.leafPaths, ['/', '/kept']);
  assert.deepEqual(after.leafPaths, ['/kept']);
  assert.deepEqual(before.leafPaths.filter(value => !after.leafPaths.includes(value)), ['/']);
  assert.equal(after.bindings.find(binding => binding.path === '/').leaf, false);
  const emptyChildren = parseGeneratedRoutes(generated([route('/empty-children', {routes: []})]));
  assert.deepEqual(emptyChildren.leafPaths, ['/empty-children']);
});

test('all nested chunk module IDs are retained without mistaking their names for route paths', () => {
  const input = generated([route('/data', {context: {plugin: '@generated/plugin.json'}, modules: {
    content: '@site/content.mdx', nested: {list: ['@site/one.json', '@site/two.json'], empty: {}},
  }, custom: {key: [1, -2, true, false, null, 'value']}})]);
  const report = parseGeneratedRoutes(input);
  assert.equal(report.bindings[0].chunkIds.length, 5);
  assert.equal(report.chunkIds.length, 5);
  assert.deepEqual(report.paths, ['/data']);
  assert.deepEqual(parseGeneratedRoutes({...input, chunkMap: JSON.stringify(input.chunkMap)}), report);
});

test('literal path and ComponentCreator disagreement or hash tampering is rejected', () => {
  const input = generated([route('/one')]);
  for (const routesSource of [input.routesSource.replace("path: '/one'", "path: '/other'"),
    input.routesSource.replace("ComponentCreator('/one',", "ComponentCreator('/other',"),
    input.routesSource.replace(/ComponentCreator\('\/one', '[^']+'/u, "ComponentCreator('/one', 'tampered'")]) {
    assert.throws(() => parseGeneratedRoutes({...input, routesSource}), /disagrees|matching chunk-map/u);
  }
});

test('missing, surplus, duplicate and empty component chunk bindings fail closed', () => {
  const input = generated([route('/one'), route('/two')]);
  const [key] = Object.keys(input.chunkMap);
  const missing = structuredClone(input.chunkMap); delete missing[key];
  assert.throws(() => parseGeneratedRoutes({...input, chunkMap: missing}), /matching chunk-map/u);
  assert.throws(() => parseGeneratedRoutes({...input, chunkMap: {...input.chunkMap, '/unbound-abc': {__comp: 'chunk'}}}), /unbound chunk-map/u);
  const absentComponent = structuredClone(input.chunkMap); delete absentComponent[key].__comp;
  assert.throws(() => parseGeneratedRoutes({...input, chunkMap: absentComponent}), /component chunk/u);
  const emptyComponent = structuredClone(input.chunkMap); emptyComponent[key].__comp = '';
  assert.throws(() => parseGeneratedRoutes({...input, chunkMap: emptyComponent}), /component chunk/u);
  const one = generated([route('/one')]);
  const object = one.routesSource.match(/  \{\n    path: '\/one',[\s\S]*?\n  \}/u)[0];
  assert.throws(() => parseGeneratedRoutes({...one, routesSource: one.routesSource.replace(object, `${object},\n${object}`)}), /duplicate route\/chunk/u);
  assert.throws(() => parseGeneratedRoutes({...one, chunkMap: `{"${Object.keys(one.chunkMap)[0]}":{"__comp":"a"},"${Object.keys(one.chunkMap)[0]}":{"__comp":"b"}}`}), /duplicate property/u);
});

test('empty, malformed and dynamic generated declarations are rejected without executing source', () => {
  const input = generated([route('/one', {routes: []})]);
  for (const routesSource of ['', 'export default [', input.routesSource + '\nglobalThis.__routeParserExecuted = true;',
    input.routesSource.replace("path: '/one'", "path: getPath()"),
    input.routesSource.replace("path: '/one'", "path: ''"),
    input.routesSource.replace(/routes:\s*\[\s*\]/u, 'routes: createRoutes()'),
    input.routesSource.replace('component: ComponentCreator', 'component: DifferentCreator'),
    input.routesSource.replace("path: '/one',", "path: '/one', path: '/one',"),
    input.routesSource.replace("path: '/one',", "path: '/one', ...more,")]) {
    assert.notEqual(routesSource, input.routesSource, 'negative control must change a selected syntax');
    assert.throws(() => parseGeneratedRoutes({...input, routesSource}), /Invalid generated routes/u);
  }
  assert.equal(globalThis.__routeParserExecuted, undefined);
  assert.throws(() => parseGeneratedRoutes({...input, chunkMap: {}}), /empty chunk map/u);
  assert.throws(() => parseGeneratedRoutes(generated([])), /empty chunk map|empty public route/u);
  assert.throws(() => parseGeneratedRoutes({...input, chunkMap: 'not JSON'}), /malformed JSON/u);
});

test('dynamic exact or ancillary attributes and accessor chunk values are rejected', () => {
  const input = generated([route('/one', {exact: true, sidebar: 'docs'})]);
  for (const routesSource of [input.routesSource.replace('exact: true', 'exact: isExact()'),
    input.routesSource.replace('exact: true', 'exact: "true"'), input.routesSource.replace('sidebar: "docs"', 'sidebar: readSidebar()')]) {
    assert.throws(() => parseGeneratedRoutes({...input, routesSource}), /dynamic|literal boolean/u);
  }
  const key = Object.keys(input.chunkMap)[0]; let reads = 0;
  const chunkMap = {[key]: {get __comp() {reads++; return 'do-not-read';}}};
  assert.throws(() => parseGeneratedRoutes({...input, chunkMap}), /dynamic/u);
  assert.equal(reads, 0);
});

test('fallback is one separate final unhashed catch-all, never a public path or chunk binding', () => {
  const input = generated([route('/one')]);
  const fallback = "  {\n    path: '*',\n    component: ComponentCreator('*'),\n  },";
  assert.ok(input.routesSource.includes(fallback));
  assert.throws(() => parseGeneratedRoutes({...input, routesSource: input.routesSource.replace(fallback, '')}), /missing generated catch-all/u);
  assert.throws(() => parseGeneratedRoutes({...input, routesSource: input.routesSource.replace("ComponentCreator('*')", "ComponentCreator('*', 'abc')")}), /catch-all/u);
  assert.throws(() => parseGeneratedRoutes({...input, routesSource: input.routesSource.replace(fallback, `${fallback}\n${fallback}`)}), /catch-all/u);
  assert.throws(() => parseGeneratedRoutes(generated([route('/one', {routes: [route('*')]})])), /catch-all/u);
});

test('escaped literal public paths are decoded by the AST rather than suffix or quote heuristics', () => {
  const input = generated([route("/publisher's-abc"), route('/unicode-\u03bb-123')]);
  assert.deepEqual(parseGeneratedRoutes(input).paths, ["/publisher's-abc", '/unicode-\u03bb-123']);
});
