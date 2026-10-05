// Validate literal MDX call sites without executing authored JavaScript.
import path from 'node:path';
import {assertBidderFeaturesProps} from '../src/components/BidderFeatures/contract.ts';

function value(node) {
  if (node?.type === 'Literal' && ['string', 'number', 'boolean'].includes(typeof node.value)) return node.value;
  if (node?.type === 'Literal' && node.value === null) return null;
  if (node?.type === 'ArrayExpression' && node.elements.every(item => item && item.type !== 'SpreadElement')) return node.elements.map(value);
  if (node?.type === 'UnaryExpression' && node.operator === '-' && typeof node.argument?.value === 'number') return -node.argument.value;
  throw new Error('BidderFeatures props require supported literals; register and test an explicit projection before using dynamic expressions or spreads');
}

export function validateBidderComponentUses(tree, {siteDir, filePath}) {
  const target = path.join(siteDir, 'src/components/BidderFeatures');
  const names = new Set();
  const walk = (tree, visit) => {
    const seen = new WeakSet();
    const next = node => {
      if (!node || typeof node !== 'object' || seen.has(node)) return;
      seen.add(node); if (typeof node.type === 'string') visit(node);
      for (const child of Object.values(node)) {
        if (Array.isArray(child)) child.forEach(next);
        else if (child && typeof child === 'object') next(child);
      }
    };
    next(tree);
  };
  walk(tree, node => {
      if (node.type !== 'ImportDeclaration' || typeof node.source?.value !== 'string') return;
      const source = node.source.value;
      const clean = source.split(/[?#]/)[0];
      const resolved = clean.startsWith('@site/') ? path.resolve(siteDir, clean.slice(6))
        : clean.startsWith('.') ? path.resolve(path.dirname(filePath), clean) : null;
      if (![target, `${target}/index`, `${target}/index.tsx`].includes(resolved)) return;
      if (source !== clean) throw new Error('Unsupported suffix on BidderFeatures import');
      for (const item of node.specifiers) {
        if (item.type === 'ImportDefaultSpecifier' || item.type === 'ImportSpecifier' && item.imported.name === 'default') names.add(item.local.name);
        else if (item.type === 'ImportNamespaceSpecifier') names.add(`${item.local.name}.default`);
        else throw new Error('Unsupported BidderFeatures import; use its default export');
      }
  });
  let checked = 0;
  const jsxName = node => node?.type === 'JSXIdentifier' ? node.name
    : node?.type === 'JSXMemberExpression' ? `${jsxName(node.object)}.${jsxName(node.property)}` : null;
  walk(tree, node => {
    const jsx = node.type === 'JSXElement';
    const name = jsx ? jsxName(node.openingElement.name) : node.name;
    if (!['mdxJsxFlowElement', 'mdxJsxTextElement', 'JSXElement'].includes(node.type) || !names.has(name)) return;
    const props = Object.create(null);
    for (const attribute of jsx ? node.openingElement.attributes : node.attributes) {
      if (attribute.type !== (jsx ? 'JSXAttribute' : 'mdxJsxAttribute')) throw new Error('BidderFeatures spread props require an explicit validated projection');
      const key = jsx ? attribute.name.name : attribute.name;
      if (typeof key !== 'string' || Object.hasOwn(props, key)) throw new Error(`Duplicate or unsupported BidderFeatures prop: ${key}`);
      props[key] = attribute.value === null ? true : typeof attribute.value === 'string' ? attribute.value
        : jsx ? value(attribute.value.type === 'JSXExpressionContainer' ? attribute.value.expression : attribute.value)
          : value(attribute.value.data?.estree?.body?.[0]?.expression);
    }
    if (node.children?.length) throw new Error('BidderFeatures requires a self-closing or empty element');
    if (Object.hasOwn(props, 'key')) {
      if (props.key !== null && !['string', 'number'].includes(typeof props.key)) throw new Error('React key must be a literal string or number');
      delete props.key; // React consumes key; it is not passed to component props.
    }
    assertBidderFeaturesProps(props); checked++;
  });
  return checked;
}
