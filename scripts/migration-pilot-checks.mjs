import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkDirective from 'remark-directive';
import {load as loadHtml} from 'cheerio';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixtureFile = path.resolve(here, '../migration/m2-expectations.json');
const fixtureBytes = fs.readFileSync(fixtureFile);
const expectations = JSON.parse(fixtureBytes);
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const compact = value => String(value).replace(/\s+/g, ' ').trim();
const markdown = unified().use(remarkParse).use(remarkGfm).use(remarkDirective);
const mdx = unified().use(remarkParse).use(remarkMdx);
const bodyOf = text => text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
const language = value => ({js: 'javascript'}[value] ?? value ?? null);
const unframe = value => value.replace(/^\n/, '').replace(/\n$/, '');
const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function htmlText(value) {
  const $ = loadHtml(value.replace(/<!--[\s\S]*?-->/g, ''));
  $('br').replaceWith('\n');
  $('p,div,li,h1,h2,h3,h4,h5,h6,section,blockquote').prepend('\n').append('\n');
  return $.text();
}

function compareCode(actual, expected) {
  const remaining = [...actual]; const missing = [];
  for (const obligation of expected) {
    const index = remaining.findIndex(node => language(node.lang) === language(obligation.language)
      && (node.value === obligation.text || (obligation.capture && unframe(node.value) === obligation.text)));
    if (index < 0) missing.push(obligation); else remaining.splice(index, 1);
  }
  return {missing, extra: remaining.length};
}

function walk(tree, visit) {
  const seen = new WeakSet();
  function descend(node) {
    if (!node || typeof node !== 'object' || seen.has(node)) return;
    seen.add(node); visit(node);
    for (const child of node.children ?? []) descend(child);
  }
  descend(tree);
}

function visibleText(node) {
  if (['code', 'mdxjsEsm', 'yaml'].includes(node.type)) return '';
  if (node.type === 'html') return htmlText(node.value);
  if (['text', 'inlineCode'].includes(node.type)) return node.value;
  // ESM imports in flattened MD/MDX source are implementation, not page prose.
  if (node.type === 'paragraph' && /^(?:import|export)\s/.test(node.children?.[0]?.value ?? '')) return '';
  return (node.children ?? []).map(visibleText).join(node.type === 'paragraph' || node.type === 'tableCell' || node.type === 'heading' ? '' : '\n');
}

function inspectDocument(text) {
  const body = bodyOf(text);
  const tree = markdown.parse(body);
  const result = {body, prose: compact(visibleText(tree)), code: [], headings: [], anchors: [], tables: [], images: [], links: []};
  walk(tree, node => {
    if (node.type === 'code') result.code.push(node);
    if (node.type === 'heading') result.headings.push({depth: node.depth, text: compact(visibleText(node))});
    if (node.type === 'table') result.tables.push(...node.children.map(row => row.children.map(cell => compact(visibleText(cell)))));
    if (node.type === 'image') result.images.push({url: node.url, alt: node.alt ?? '', title: node.title ?? null});
    if (node.type === 'link') result.links.push({url: node.url, label: compact(visibleText(node))});
    // Inline HTML links can span html/text/html sibling nodes in Markdown.
    // Serialize only that paragraph's parsed prose, escaping code/text nodes,
    // so strings in code blocks cannot masquerade as real links.
    if (node.type === 'html' || (node.type === 'paragraph' && node.children?.some(child => child.type === 'html'))) {
      const fragment = node.type === 'html' ? node.value : node.children.map(child => child.type === 'html' ? child.value : escapeHtml(visibleText(child))).join('');
      const $ = loadHtml(fragment.replace(/<!--[\s\S]*?-->/g, ''));
      $('[id],a[name]').each((_index, element) => {
        const id = $(element).attr('id') ?? $(element).attr('name');
        if (id) result.anchors.push(id);
      });
      $('a[href]').each((_index, element) => result.links.push({url: $(element).attr('href'), label: compact($(element).text())}));
      $('img[src]').each((_index, element) => result.images.push({url: $(element).attr('src'), alt: $(element).attr('alt') ?? '', title: $(element).attr('title') ?? null}));
    }
  });
  return result;
}

function counts(values, key = value => value) {
  const out = new Map();
  for (const value of values) { const id = key(value); out.set(id, (out.get(id) ?? 0) + 1); }
  return out;
}

function compareMultiset(actual, expected, key) {
  const remaining = counts(actual, key); const missing = [];
  for (const value of expected) {
    const id = key(value); const count = remaining.get(id) ?? 0;
    if (count) remaining.set(id, count - 1); else missing.push(value);
  }
  return {missing, extra: [...remaining.values()].reduce((a, b) => a + b, 0)};
}

function literalAttribute(node, name) {
  const attributes = node.attributes?.filter(item => item.type === 'mdxJsxAttribute' && item.name === name) ?? [];
  if (attributes.length > 1) throw new Error(`Repeated JSX attribute: ${name}`);
  if (!attributes.length) return undefined;
  const value = attributes[0].value;
  if (value === null) return true;
  if (typeof value === 'string') return value;
  throw new Error(`Pilot tab ${name} must be a literal attribute`);
}

function checkTabs(body, expected) {
  // This adapter only parses the bounded tab group, not flattened CommonMark
  // partials as MDX. No React component or embedded JavaScript is executed.
  const groups = body.match(/<Tabs\b[\s\S]*?<\/Tabs>/g) ?? [];
  if (groups.length !== 1) return {passed: false, detail: `Expected one Tabs group, found ${groups.length}`};
  const tree = mdx.parse(groups[0]); let tabs; const items = [];
  walk(tree, node => {
    if (node.name === 'Tabs') { if (tabs) throw new Error('Nested Tabs are outside the pilot adapter'); tabs = node; }
    if (node.name === 'TabItem') items.push(node);
  });
  if (!tabs || items.length !== expected.items.length) return {passed: false, detail: 'Missing or extra TabItem'};
  const defaultItems = items.filter(item => literalAttribute(item, 'default') === true);
  const defaultValue = literalAttribute(tabs, 'defaultValue') ?? (defaultItems.length === 1 ? literalAttribute(defaultItems[0], 'value') : undefined);
  if (defaultItems.length > 1 || defaultValue !== expected.default_value) return {passed: false, detail: 'Incorrect or ambiguous initially selected tab'};
  const values = items.map(item => literalAttribute(item, 'value'));
  if (new Set(values).size !== values.length) return {passed: false, detail: 'Duplicate tab values'};
  for (const obligation of expected.items) {
    const item = items.find(candidate => literalAttribute(candidate, 'value') === obligation.value);
    if (!item || literalAttribute(item, 'label') !== obligation.label) return {passed: false, detail: `Incorrect value/label pairing for ${obligation.value}`};
    const code = []; walk(item, node => { if (node.type === 'code') code.push(node); });
    if (code.length !== 1 || language(code[0].lang) !== 'swift'
        || (sha(code[0].value) !== obligation.payload_sha256 && sha(unframe(code[0].value)) !== obligation.payload_sha256)) {
      return {passed: false, detail: `Incorrect code payload for ${obligation.value}`};
    }
  }
  return {passed: true, detail: 'Literal value, label, default, and exact payload pairing checked; runtime aria relationships unexecuted'};
}

function vendorWarning(source, parameters) {
  // This is an independent evaluator for this one inspected three-line include,
  // not a general Liquid renderer or a production transformation adapter.
  let text = source.replace(/^\{:\s*\.alert\.alert-warning\s*:?\s*\}\s*\n/, '');
  text = text.replace(/\{%\s*if include\.gvlId\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/g,
    (_match, conditional) => parameters.gvlId ? conditional.replace(/\{\{\s*include\.gvlId\s*\}\}/g, parameters.gvlId) : '');
  if (/\{%|\{\{/.test(text)) throw new Error('Unsupported Liquid in explicit vendor-warning expectation override');
  return compact(visibleText(markdown.parse(text)));
}

export function checkPilotParserControls() {
  const first = 'Prebid.org recommends working with a privacy lawyer before making enforcement exceptions for any vendor.';
  const second = 'We recommend publishers let Prebid.js make use of their registered GVL ID 361 instead of a vendor exception.';
  const expected = `${first} ${second}`;
  const controls = [
    {id: 'complete-multiple-paragraph-admonition', input: `:::warning\n\n${first}\n\n${second}\n\n:::\n`, present: true},
    {id: 'complete-admonition-and-following-prose', input: `:::warning\n\n${first}\n\n:::\n${second}\n`, present: true},
    {id: 'removed-required-notice-phrase', input: `:::warning\n\n${first.replace('before making enforcement exceptions for any vendor.', '')}\n\n${second}\n\n:::\n`, present: false},
    {id: 'notice-in-code-is-not-prose', input: `\`\`\`text\n${expected}\n\`\`\`\n`, present: false},
    {id: 'notice-in-comment-is-not-prose', input: `<!-- ${expected} -->\n`, present: false},
    {id: 'restored-complete-notice', input: `:::warning\n\n${first}<br />\n\n${second}\n\n:::\n`, present: true},
  ].map(control => ({id: control.id, status: inspectDocument(control.input).prose.includes(expected) === control.present ? 'passed' : 'failed'}));
  return {status: controls.every(control => control.status === 'passed') ? 'passed' : 'failed', controls,
    boundary: 'Parser controls for source-prose completeness; no rendered warning placement or severity claim.'};
}

export function parsePilotCsv(text) {
  const rows = []; let row = []; let cell = ''; let quoted = false; let closed = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (char === '"') { quoted = false; closed = true; }
      else cell += char;
      continue;
    }
    if (char === '"') {
      if (cell || closed) throw new Error('Unexpected quote in CSV field');
      quoted = true;
    } else if (char === ',') { row.push(cell); cell = ''; closed = false; }
    else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = ''; closed = false;
    } else { if (closed) throw new Error('Characters after closing CSV quote'); cell += char; }
  }
  if (quoted) throw new Error('Unterminated CSV quote');
  if (cell || row.length || closed) { row.push(cell); rows.push(row); }
  return rows;
}

export function verifyPilotExpectations({repoDir = path.resolve(here, '..')} = {}) {
  let artifacts = 0; let codePayloads = 0;
  for (const [commit, snapshot] of Object.entries(expectations.snapshots)) {
    const sourceTexts = new Map();
    for (const [source, expected] of Object.entries(snapshot.artifacts)) {
      const bytes = execFileSync('git', ['-C', repoDir, 'show', `${commit}:${source}`]);
      if (bytes.length !== expected.bytes || sha(bytes) !== expected.sha256) throw new Error(`Unbound expectation artifact: ${commit}:${source}`);
      sourceTexts.set(source, bytes.toString('utf8'));
      artifacts++;
    }
    for (const document of Object.values(snapshot.documents)) for (const code of document.code) {
      if (sha(code.text) !== code.sha256) throw new Error(`Corrupt expected code payload: ${code.source_path}`);
      const original = sourceTexts.get(code.source_path);
      let extracted;
      if (code.capture) {
        const matches = [...original.matchAll(new RegExp(`\\{% capture ${code.capture} %\\}([\\s\\S]*?)\\{% endcapture %\\}`, 'g'))];
        if (matches.length !== 1 || sha(matches[0][1]) !== code.source_capture_sha256) throw new Error(`Unbound source capture: ${code.source_path}:${code.capture}`);
        extracted = unframe(matches[0][1]);
      } else {
        extracted = original.split('\n').slice(code.start_line - 1, code.end_line)
          .map(line => line.startsWith(code.source_indent) ? line.slice(code.source_indent.length) : line).join('\n');
      }
      if (extracted !== code.text) throw new Error(`Unbound exact source code: ${code.source_path}:${code.capture ?? code.start_line}`);
      codePayloads++;
    }
  }
  return {status: 'verified', artifacts, code_payloads: codePayloads, expectations_sha256: sha(fixtureBytes),
    boundary: 'Source artifact hashes and exact source-code payload bindings; semantic policy and rendered output are not verified.'};
}

export async function checkPilot({sourceCommit, files, includeOverrides = {}, migrationOverrides = []}) {
  const snapshot = expectations.snapshots[sourceCommit];
  if (!snapshot) throw new Error('Unknown exact pilot source commit');
  if (!files || typeof files !== 'object' || Array.isArray(files)) throw new Error('Pilot files must map original source paths to output text');
  const required = [...expectations.source_paths, expectations.csv_path];
  for (const source of required) if (typeof files[source] !== 'string' || !files[source].trim()) throw new Error(`Missing or empty pilot output: ${source}`);
  for (const source of Object.keys(files)) if (!required.includes(source)) throw new Error(`Unselected pilot output: ${source}; account for it separately in the replay ledger`);
  for (const [source, text] of Object.entries(includeOverrides)) {
    if (!expectations.allowed_include_overrides.includes(source) || typeof text !== 'string' || !text.trim()) throw new Error(`Unsupported or empty include override: ${source}`);
  }
  if (!Array.isArray(migrationOverrides) || new Set(migrationOverrides).size !== migrationOverrides.length
      || migrationOverrides.some(name => !expectations.allowed_migration_overrides.includes(name))) throw new Error('Unknown or repeated migration override');
  const checks = [];
  const record = (id, source, passed, details = {}) => checks.push({id, source, status: passed ? 'passed' : 'failed', ...details});
  for (const source of expectations.source_paths) {
    const expected = snapshot.documents[source];
    const observed = inspectDocument(files[source]);
    const code = compareCode(observed.code, expected.code);
    record('exact-code', source, !code.missing.length && code.extra === 0,
      {expected_blocks: expected.code.length, observed_blocks: observed.code.length, missing: code.missing.map(item => ({sha256: item.sha256, source_path: item.source_path, capture: item.capture, start_line: item.start_line})), extra_blocks: code.extra});
    const headings = compareMultiset(observed.headings, expected.headings, item => JSON.stringify([item.depth, item.text]));
    record('heading-text-and-depth', source, !headings.missing.length, {missing: headings.missing});
    for (const anchor of expected.anchors) record(`anchor:${anchor}`, source, observed.anchors.includes(anchor));
    for (const obligation of expected.prose) {
      const text = obligation.id === 'rewarded-process-sentence' && migrationOverrides.includes('mobile-rewarded-process-typo')
        ? obligation.text.replace('The proccess', 'The process') : obligation.text;
      let passed = observed.prose.includes(compact(text));
      if (obligation.id === 'rewarded-process-sentence') {
        const opposite = text.includes('The proccess') ? text.replace('The proccess', 'The process') : obligation.text;
        passed = observed.prose.split(compact(text)).length === 2 && !observed.prose.includes(compact(opposite));
      }
      record(`prose:${obligation.id}`, source, passed, {expected_text: text});
    }
    if (expected.vendor_include_parameters) {
      const include = '_includes/dev-docs/vendor-exception.md';
      const text = vendorWarning(includeOverrides[include] ?? snapshot.vendor_include, expected.vendor_include_parameters);
      record('complete-vendor-warning', source, observed.prose.includes(text), {expected_text: text, explicit_include_override: Object.hasOwn(includeOverrides, include)});
    }
    for (const table of expected.tables) {
      const matches = observed.tables.filter(cells => table.cells
        ? JSON.stringify(cells) === JSON.stringify(table.cells)
        : table.cell_contains.every(text => cells.some(cell => cell.includes(text))));
      record(`table:${table.id}`, source, matches.length > 0, {matching_rows: matches.length});
    }
    for (const [index, image] of expected.images.entries()) record(`image:${index + 1}`, source,
      observed.images.some(item => image.allowed_urls.includes(item.url) && item.alt === image.alt && item.title === image.title), {expected: image});
    for (const link of expected.links) record(`link:${link.label}`, source, observed.links.some(item => item.label === link.label &&
      (link.allowed_urls ? link.allowed_urls.includes(item.url) : item.url.split(/[?#]/)[0].replace(/\.html$/, '').split('/').at(-1) === link.target_suffix)), {expected: link});
    if (expected.tabs) {
      try { const result = checkTabs(observed.body, expected.tabs); record('mobile-tab-pairing', source, result.passed, {detail: result.detail}); }
      catch (error) { record('mobile-tab-pairing', source, false, {detail: error.message}); }
    }
  }
  const csvSource = expectations.csv_path; let csvRows = 0;
  try {
    const text = files[csvSource];
    // Physical blank lines after the last CSV record are framing, not records.
    // Internal blank records and quoted empty records still fail the shape gate.
    const rows = parsePilotCsv(text.replace(/(?:\r\n|\r|\n){2,}$/, '\n')); const headers = rows.shift(); csvRows = rows.length;
    record('csv-headers', csvSource, JSON.stringify(headers) === JSON.stringify(expectations.csv.headers));
    record('csv-nonempty-shape', csvSource, rows.length > 0 && rows.every(row => row.length === expectations.csv.headers.length && row[0]));
    record('csv-no-template-leakage', csvSource, !/\{%|\{\{|layout:\s*none|search:\s*exclude/.test(text));
    record('csv-unique-bidders', csvSource, new Set(rows.map(row => row[0])).size === rows.length);
    record('csv-exact-pilot-membership', csvSource,
      JSON.stringify(rows.map(row => row[0]).sort()) === JSON.stringify(Object.keys(expectations.csv.selected_cells).sort()));
    for (const [bidder, cells] of Object.entries(expectations.csv.selected_cells)) {
      const matches = rows.filter(row => row[0] === bidder);
      for (const [column, value] of Object.entries(cells)) record(`csv-cell:${bidder}:${column}`, csvSource,
        matches.length === 1 && matches[0][headers?.indexOf(column)] === value, {expected_value: value});
    }
  } catch (error) { record('csv-parse', csvSource, false, {detail: error.message}); }
  return {schema_version: 1, kind: 'm2-pilot-source-content-check', status: checks.every(check => check.status === 'passed') ? 'passed' : 'failed',
    source_commit: sourceCommit, expectations_sha256: sha(fixtureBytes), checker_sha256: sha(fs.readFileSync(fileURLToPath(import.meta.url))),
    coverage: {documents: expectations.source_paths.length, output_files: required.length, code_blocks: Object.values(snapshot.documents).reduce((sum, doc) => sum + doc.code.length, 0), csv_records: csvRows, checks: checks.length},
    output_sha256: Object.fromEntries(required.map(source => [source, sha(files[source])])),
    explicit_include_overrides: Object.fromEntries(Object.entries(includeOverrides).map(([source, text]) => [source, sha(text)])),
    migration_overrides: migrationOverrides, checks,
    rendering: {status: 'unexecuted', tabs_aria_relationships: 'unexecuted', hydration_and_keyboard: 'unexecuted'},
    limitations: expectations.limitations};
}
