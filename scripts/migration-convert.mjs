// Bounded M2 source adapter. Pure: supplied source bytes in, staged files out.
// This is not a general Jekyll renderer or an approved public-route mapper.
import crypto from 'node:crypto';
import path from 'node:path';
import yaml from 'js-yaml';
import {Liquid} from 'liquidjs';
import {unified} from 'unified';
import remarkParse from 'remark-parse';

export const sha256 = text => crypto.createHash('sha256').update(text).digest('hex');
export const PILOT_SOURCES = [
  'dev-docs/bidders/appnexus.md', 'dev-docs/bidders/bidsxchange.md',
  'dev-docs/modules/tcfControl.md', 'dev-docs/modules/permutiveRtdProvider.md',
  'prebid-mobile/modules/rendering/ios-sdk-integration-gam.md',
  'dev-docs/examples/basic-example.md', 'dev-docs/bidder-data.csv',
];
export const CSV_BIDDERS = ['appnexus', 'bidsxchange', 'browsi', 'rtbdemand_com', 'lemmadigital'];
export const PILOT_INCLUDES = [
  'legal-warning.html', 'dev-docs/vendor-exception.md',
  'dev-docs/not-for-production-warning.md', 'dev-docs/build-from-source-warning.md',
  'mobile/intro-prebid-rendered.md', 'mobile/rewarded-server-side-configuration.md',
  'mobile/rendering-adunit-config-ios.md', 'code/gma-versions-tabs.html', 'code/web-example.html',
];
export const INPUT_PATHS = [...new Set([...PILOT_SOURCES,
  ...CSV_BIDDERS.map(name => `dev-docs/bidders/${name}.md`),
  ...PILOT_INCLUDES.map(name => `_includes/${name}`), '_layouts/bidder.html', '_layouts/example.html', '_config.yml'])];

export function splitSource(source) {
  const match = /^(---\r?\n)([\s\S]*?)(\r?\n---(?:\r?\n|$))/.exec(source);
  if (!match) throw new Error('A bounded pilot source requires frontmatter');
  const data = yaml.load(match[2]);
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Frontmatter must be a mapping');
  return {frontmatter: match[0], data, body: source.slice(match[0].length)};
}

// Positions protect original bytes, including indentation, fence length, URLs,
// Liquid literals, and blank lines. No Markdown serialization round trip.
export function protectedRanges(text) {
  const ranges = [];
  const visit = node => {
    if (node.type === 'code' || node.type === 'inlineCode') {
      ranges.push([node.position.start.offset, node.position.end.offset]);
    } else node.children?.forEach(visit);
  };
  visit(unified().use(remarkParse).parse(text));
  return ranges.sort((a, b) => a[0] - b[0]);
}

function protection(inputTexts) {
  const prefix = `M2PROTECTED${sha256(inputTexts.join('\0')).slice(0, 20)}X`;
  if (inputTexts.some(text => text.includes(prefix))) throw new Error('Protection marker collision');
  const values = [];
  const put = text => `${prefix}${values.push(text) - 1}END`;
  const mask = text => {
    for (const [start, end] of protectedRanges(text).reverse()) text = text.slice(0, start) + put(text.slice(start, end)) + text.slice(end);
    // Captures in this slice are code payloads, never executable templates.
    return text.replace(/({%-?\s*capture\s+\w+\s*-?%})([\s\S]*?)({%-?\s*endcapture\s*-?%})/g,
      (_all, open, payload, close) => open + put(payload) + close);
  };
  const restore = text => {
    const pattern = new RegExp(`${prefix}(\\d+)END`, 'g');
    for (let pass = 0; pass <= values.length; pass++) {
      if (!text.includes(prefix)) return text;
      text = text.replace(pattern, (_all, index) => {
        if (values[index] === undefined) throw new Error('Unknown protection marker');
        return values[index];
      });
    }
    throw new Error('Unresolved protection markers');
  };
  return {mask, restore, boundary: `${prefix}TABBOUNDARY`};
}

function syntaxOutsideCode(text) {
  // Called while code and captures are masked. Preserve public links and assets
  // verbatim until D2/D6 supply an approved mapping.
  text = text.replace(/^[ \t]*[-*] TOC\r?\n\{:\s*toc\s*\}\r?\n/gm, '')
    .replace(/^\{:\s*\.no_toc\s*\}\r?\n/gm, '')
    .replace(/^\{:\s*\.table(?:[ .\w-]*)\s*\}\r?\n/gm, '')
    .replace(/^\{:\s*#([\w-]+)\s*\}\s*$/gm, '<a id="$1"></a>');
  text = text.replace(/^\{:\s*\.alert\.alert-(warning|danger|info|success)\s*:?\s*\}\r?\n([\s\S]*?)(?=\r?\n\r?\n|$)/gm,
    (_all, kind, body) => `:::${{danger:'danger', warning:'warning', info:'info', success:'tip'}[kind]}\n\n${body}\n\n:::`);
  if (/\{%|\{\{|^\{:/m.test(text)) throw new Error('Unresolved Liquid or unsupported Kramdown syntax: manual conversion required');
  return text;
}

const CODE_ADAPTERS = {
  'code/web-example.html': '\n## HTML\n\n~~~~html\n{{ include.html }}\n~~~~\n\n## JavaScript\n\n~~~~javascript\n{{ include.js }}\n~~~~\n',
  'code/gma-versions-tabs.html': '\nM2TABBOUNDARY\n<Tabs defaultValue="gma12">\n<TabItem value="gma12" label="GMA SDK v12">\n\n~~~~swift\n{{ include.gma12 }}~~~~\n\n</TabItem>\n<TabItem value="gma11" label="GMA SDK v11">\n\n~~~~swift\n{{ include.gma11 }}~~~~\n\n</TabItem>\n</Tabs>\nM2TABBOUNDARY\n',
};

export function convertDocument({sourcePath, sources, sourceCommit, adapterHashes}) {
  if (!PILOT_SOURCES.slice(0, 6).includes(sourcePath)) throw new Error(`Outside bounded selection: ${sourcePath}`);
  const source = sources[sourcePath];
  if (typeof source !== 'string') throw new Error(`Missing source: ${sourcePath}`);
  const {data, frontmatter, body} = splitSource(source);
  const guard = protection(Object.values(sources));
  const dependencies = new Set([sourcePath]);
  const read = name => {
    if (typeof sources[name] !== 'string') throw new Error(`Missing dependency: ${name}`);
    dependencies.add(name); return sources[name];
  };
  const getInclude = name => {
    if (!PILOT_INCLUDES.includes(name)) throw new Error(`Unsupported include: ${name}`);
    const actual = read(`_includes/${name}`);
    if (CODE_ADAPTERS[name]) {
      if (adapterHashes?.[name] !== sha256(actual)) throw new Error(`Code include changed; review the adapter before replay: ${name}`);
      return CODE_ADAPTERS[name].replaceAll('M2TABBOUNDARY', guard.boundary);
    }
    return guard.mask(actual);
  };
  const engine = new Liquid({jekyllInclude: true, strictFilters: true, strictVariables: true, lenientIf: true,
    relativeReference: false, ownPropertyOnly: true, parseLimit: 1e6, renderLimit: 1000,
    fs: {resolve: (_dir, name) => name, existsSync: name => PILOT_INCLUDES.includes(name),
      readFileSync: getInclude, containsSync: () => true}});
  let template = guard.mask(body);
  if (data.layout === 'bidder') {
    const layout = read('_layouts/bidder.html');
    const notices = ['enable_download == false', 's2s_only == true'].map(predicate => {
      const matches = [...layout.matchAll(new RegExp(`{% if page\\.${predicate} %}[\\s\\S]*?{% endif %}`, 'g'))];
      if (matches.length !== 1) throw new Error(`Bidder notice template changed: ${predicate}`);
      return matches[0][0].replace(/^ +/gm, '');
    });
    template = notices.join('\n\n') + '\n\n' + template;
  }
  if (data.layout === 'example') {
    const layout = read('_layouts/example.html');
    for (const name of ['not-for-production-warning', 'build-from-source-warning']) {
      if (!layout.includes(`{% include dev-docs/${name}.md %}`)) throw new Error('Example layout notice contract changed');
    }
    if (!Array.isArray(data.about) || !data.about.length) throw new Error('Example about bullets are required');
    template = `## About this example:\n\n${data.about.map(line => `- ${line}`).join('\n')}\n\n{% include dev-docs/not-for-production-warning.md %}\n\n${template}\n\n{% include dev-docs/build-from-source-warning.md %}`;
  }
  const config = yaml.load(read('_config.yml'));
  // Root-hosted production reference. Explicit source baseurl, if introduced,
  // wins; no link-extension or asset-directory rewrite is performed.
  const baseurl = config.baseurl ?? '';
  if (typeof baseurl !== 'string') throw new Error('Unsupported source baseurl');
  let rendered = engine.parseAndRenderSync(template, {page: data, site: {baseurl}});
  rendered = syntaxOutsideCode(rendered);
  const files = [];
  const basename = path.posix.basename(sourcePath, '.md');
  if (rendered.includes(guard.boundary)) {
    const pieces = rendered.split(guard.boundary);
    if (pieces.length !== 3) throw new Error('Expected one Mobile tab group');
    const directory = path.posix.dirname(sourcePath);
    files.push({path: `${directory}/_${basename}-before.md`, content: guard.restore(pieces[0])},
      {path: `${directory}/_${basename}-after.md`, content: guard.restore(pieces[2])},
      {path: sourcePath.replace(/\.md$/, '.mdx'), content: `${frontmatter}\nimport Before from './_${basename}-before.md';\nimport After from './_${basename}-after.md';\nimport Tabs from '@theme/Tabs';\nimport TabItem from '@theme/TabItem';\n\n<Before />\n${guard.restore(pieces[1])}\n<After />\n`});
  } else files.push({path: sourcePath, content: frontmatter + guard.restore(rendered)});
  return {sourcePath, sourceCommit, files, semanticText: frontmatter + guard.restore(rendered.replaceAll(guard.boundary, '')),
    dependencies: [...dependencies].sort().map(name => ({path: name, sha256: sha256(sources[name])})),
    limits: ['Staging routes only; public links/assets retained without resolution',
      'Bidder feature/download consumers and interactive example runner remain unexecuted',
      'LiquidJS is a bounded source projection, not Jekyll runtime equivalence']};
}

export function projectPilotCsv({sources}) {
  const {body} = splitSource(sources['dev-docs/bidder-data.csv']);
  const pages = CSV_BIDDERS.map(name => splitSource(sources[`dev-docs/bidders/${name}.md`]).data);
  // Deliberately executes the pinned source expressions, including known quirks.
  // It observes legacy behavior; it does not approve a normalized policy.
  const engine = new Liquid({strictFilters: true, strictVariables: false, ownPropertyOnly: true,
    jekyllWhere: true, parseLimit: 1e6, renderLimit: 1000});
  return engine.parseAndRenderSync(body, {site: {pages}}).replace(/\n+$/, '\n');
}

export const MOBILE_REPAIR = {
  sourcePath: PILOT_SOURCES[4],
  before: 'The proccess for displaying the Rewarded Ad',
  after: 'The process for displaying the Rewarded Ad',
  rationale: 'Pilot-only editorial correction; explicit one-occurrence precondition',
};
export function applyRepair(result) {
  if (result.sourcePath !== MOBILE_REPAIR.sourcePath) return result;
  const {before, after} = MOBILE_REPAIR;
  if (result.semanticText.split(before).length !== 2) throw new Error('Migration repair conflicts with updated source');
  return {...result, semanticText: result.semanticText.replace(before, after),
    files: result.files.map(file => ({...file, content: file.content.replace(before, after)}))};
}
