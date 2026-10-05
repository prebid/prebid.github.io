// Read generated route declarations as data. Never import/evaluate routes.js:
// Docusaurus's routesChunkNames keys are internal path/hash bindings, not URLs.
import ts from 'typescript';

const fail = message => { throw new Error(`Invalid generated routes: ${message}`); };
const sorted = values => [...values].sort();
const literalString = (node, label) => {
  if (!node || !ts.isStringLiteralLike(node) || !node.text.trim()) fail(`${label} must be a nonempty literal string`);
  return node.text;
};

function propertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text;
  return fail('computed or dynamic property name');
}

function properties(node) {
  if (!ts.isObjectLiteralExpression(node)) fail('route and attribute objects must be literal objects');
  const result = new Map();
  for (const property of node.properties) {
    if (!ts.isPropertyAssignment(property)) fail('spread, shorthand, method, or accessor property');
    const name = propertyName(property.name);
    if (result.has(name)) fail(`duplicate property ${name}`);
    result.set(name, property.initializer);
  }
  return result;
}

function staticValue(node) {
  if (ts.isStringLiteralLike(node)) return node.text;
  if (ts.isNumericLiteral(node)) {
    const number = Number(node.text);
    if (!Number.isFinite(number)) fail('nonfinite numeric attribute');
    return number;
  }
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(node.operand)) {
    return -staticValue(node.operand);
  }
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(staticValue);
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries([...properties(node)].map(([name, value]) => [name, staticValue(value)]));
  return fail('dynamic or unsupported attribute expression');
}

// A JSON string is accepted to preserve duplicate-key detection at the file
// boundary. Parsed plain JSON objects are also supported for existing callers.
function chunkObject(input) {
  if (typeof input === 'string') {
    let parsed;
    try { parsed = JSON.parse(input); } catch { return fail('chunk map is malformed JSON'); }
    const source = ts.createSourceFile('routesChunkNames.json.js', `(${input})`, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
    if (source.parseDiagnostics.length || source.statements.length !== 1 || !ts.isExpressionStatement(source.statements[0])) fail('chunk map cannot be parsed statically');
    const expression = source.statements[0].expression;
    if (!ts.isParenthesizedExpression(expression) || !ts.isObjectLiteralExpression(expression.expression)) fail('chunk map must be an object');
    staticValue(expression.expression); // Reject duplicate keys instead of JSON.parse's last-value wins.
    return parsed;
  }
  return input;
}

function dataEntries(object, label) {
  if (!object || typeof object !== 'object' || Array.isArray(object)
    || ![Object.prototype, null].includes(Object.getPrototypeOf(object))) fail(`${label} must be a plain object`);
  const descriptors = Object.getOwnPropertyDescriptors(object);
  return Reflect.ownKeys(descriptors).map(key => {
    const descriptor = descriptors[key];
    if (typeof key !== 'string' || !Object.hasOwn(descriptor, 'value') || !descriptor.enumerable) fail(`${label} contains dynamic or hidden properties`);
    return [key, descriptor.value];
  });
}

function chunkIds(value, label) {
  if (typeof value === 'string') {
    if (!value.trim()) fail(`${label} contains an empty chunk ID`);
    return [value];
  }
  if (Array.isArray(value)) {
    const descriptors = Object.getOwnPropertyDescriptors(value);
    if (Reflect.ownKeys(descriptors).length !== value.length + 1) fail(`${label} has sparse or decorated chunk arrays`);
    return Array.from({length: value.length}, (_unused, index) => {
      const descriptor = descriptors[index];
      if (!descriptor || !Object.hasOwn(descriptor, 'value')) fail(`${label} has dynamic chunk array entries`);
      return chunkIds(descriptor.value, label);
    }).flat();
  }
  return dataEntries(value, label).flatMap(([key, child]) => chunkIds(child, `${label}.${key}`));
}

/** Return public paths and routing contexts separately from internal chunk keys. */
export function parseGeneratedRoutes({routesSource, chunkMap}) {
  if (typeof routesSource !== 'string' || !routesSource.trim()) fail('routesSource must be nonempty source text');
  const source = ts.createSourceFile('routes.js', routesSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  if (source.parseDiagnostics.length) fail('routes.js syntax diagnostics');
  const imported = new Map(); let exported;
  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement)) {
      const module = literalString(statement.moduleSpecifier, 'import module');
      const expected = new Map([['react', 'React'], ['@docusaurus/ComponentCreator', 'ComponentCreator']]).get(module);
      const clause = statement.importClause;
      if (!expected || imported.has(module) || !clause || clause.isTypeOnly || clause.name?.text !== expected || clause.namedBindings || statement.attributes) {
        fail('unsupported or duplicate import binding');
      }
      imported.set(module, expected);
    } else if (ts.isExportAssignment(statement) && !statement.isExportEquals && !exported) {
      exported = statement.expression;
    } else fail('unexpected executable statement or duplicate default export');
  }
  if (imported.size !== 2 || !exported || !ts.isArrayLiteralExpression(exported)) fail('expected imports and one literal default route array');
  const chunks = new Map(dataEntries(chunkObject(chunkMap), 'chunk map'));
  if (!chunks.size) fail('empty chunk map');
  const bindings = []; const paths = new Set(); const leafPaths = new Set(); const claimed = new Set(); const allIds = new Set();
  let fallback;
  function visit(array, ancestors) {
    if (!ts.isArrayLiteralExpression(array)) fail('nested routes must be a literal array');
    array.elements.forEach((node, index) => {
      const fields = properties(node);
      const routePath = literalString(fields.get('path'), 'route path');
      const creator = fields.get('component');
      if (!creator || !ts.isCallExpression(creator) || !ts.isIdentifier(creator.expression)
        || creator.expression.text !== 'ComponentCreator' || creator.questionDotToken || creator.typeArguments?.length) {
        fail(`component for ${routePath} must be a direct ComponentCreator call`);
      }
      if (literalString(creator.arguments[0], 'ComponentCreator path') !== routePath) fail(`ComponentCreator path disagrees with route path ${routePath}`);
      if (routePath === '*') {
        if (fallback || ancestors.length || index !== array.elements.length - 1 || fields.size !== 2 || creator.arguments.length !== 1) {
          fail('catch-all must be the sole final top-level unhashed fallback');
        }
        fallback = {path: '*'};
        return;
      }
      if (creator.arguments.length !== 2) fail(`ComponentCreator for ${routePath} requires path and hash`);
      const hash = literalString(creator.arguments[1], 'ComponentCreator hash');
      const key = `${routePath}-${hash}`;
      if (claimed.has(key)) fail(`duplicate route/chunk binding ${key}`);
      if (!chunks.has(key)) fail(`route has no matching chunk-map key ${key}`);
      const entry = new Map(dataEntries(chunks.get(key), `chunks for ${key}`));
      if (typeof entry.get('__comp') !== 'string' || !entry.get('__comp').trim()) fail(`chunk binding ${key} has no component chunk ID`);
      const ids = sorted(new Set(chunkIds(chunks.get(key), key)));
      let exact = false;
      if (fields.has('exact')) {
        exact = staticValue(fields.get('exact'));
        if (typeof exact !== 'boolean') fail(`exact for ${routePath} must be a literal boolean`);
      }
      for (const [name, value] of fields) {
        if (!['path', 'component', 'routes', 'exact'].includes(name)) staticValue(value);
      }
      const children = fields.get('routes');
      if (children && !ts.isArrayLiteralExpression(children)) fail('nested routes must be a literal array');
      const leaf = !children || children.elements.length === 0;
      claimed.add(key); paths.add(routePath); ids.forEach(id => allIds.add(id));
      if (leaf) leafPaths.add(routePath);
      bindings.push({path: routePath, exact, ancestors: [...ancestors], leaf, hash, key, chunkIds: ids});
      if (children) visit(children, [...ancestors, routePath]);
    });
  }
  visit(exported, []);
  if (!bindings.length || !paths.size) fail('empty public route selection');
  if (!fallback) fail('missing generated catch-all fallback');
  const unbound = [...chunks.keys()].filter(key => !claimed.has(key));
  if (unbound.length) fail(`unbound chunk-map keys: ${unbound.join(', ')}`);
  return {paths: sorted(paths), leafPaths: sorted(leafPaths), bindings, chunkKeys: sorted(chunks.keys()), chunkIds: sorted(allIds), fallback};
}
