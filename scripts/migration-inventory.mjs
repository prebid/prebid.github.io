#!/usr/bin/env node
/**
 * Read-only source inventory; does not execute Liquid, MDX, Git, or the converter.
 * Usage: node scripts/migration-inventory.mjs --legacy-root PATH --migration-root PATH
 *   --reference-sha FULL_SHA --site-sha FULL_SHA --out PATH
 * Requires the repository's installed js-yaml (currently a transitive dependency).
 * Output is new JSON outside both input roots. No existing output is overwritten.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { isUtf8 } from 'node:buffer';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const require = createRequire(import.meta.url);
const SCRIPT_PATH = fileURLToPath(import.meta.url);
const MARKDOWN_EXTENSIONS = ['.md', '.mdx', '.markdown'];
const DOCUMENT_EXTENSIONS = [...MARKDOWN_EXTENSIONS, '.html'];
const EXCLUDED_DIRECTORIES = new Set([
  '.git', 'node_modules', '.docusaurus', 'build', '_site', 'dist', 'coverage', '.cache',
]);
const ROOT_RULES = [
  ['dev-docs/', 'docs/dev-docs/prebidjs/'],
  ['prebid-server/', 'docs/dev-docs/prebid-server/'],
  ['prebid-mobile/', 'docs/dev-docs/prebid-mobile/'],
  ['tools/', 'docs/dev-docs/tools/'],
  ['overview/', 'docs/content/'],
  ['content/', 'docs/content/'],
];
const GENERATED_RULES = {
  'dev-docs/bidder-data.csv': ['static/bidder-data.csv', 'static/dev-docs/bidder-data.csv'],
  'bidder-data.csv': ['static/bidder-data.csv'],
  'bidders.json': ['docs/dev-docs/prebidjs/bidders.json', 'static/bidders.json'],
  'search.json': ['static/search.json'],
};

const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const sorted = (values) => [...values].sort(compare);
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const isWithin = (root, target) => target === root || target.startsWith(`${root}${path.sep}`);
const isTemplate = (name) => name.startsWith('_layouts/') || name.startsWith('_includes/');
const isCurrentDestination = (name) => name.startsWith('docs/') || name.startsWith('static/')
  || /^[^/]+_versioned_docs\//.test(name);

function loadYamlParser() {
  try {
    return {
      api: require('js-yaml'),
      details: {
        package: 'js-yaml', version: require('js-yaml/package.json').version,
        resolved_path: require.resolve('js-yaml'), schema: 'DEFAULT_SCHEMA',
        dependency: 'Existing installed transitive dependency; this tool does not install it.',
      },
    };
  } catch (error) {
    throw new Error(`The inventory requires the repository's installed js-yaml: ${error.message}`);
  }
}

function parseFrontmatter(text, yaml) {
  const normalized = text.replace(/^\uFEFF/, '');
  if (!/^---[ \t]*\r?\n/.test(normalized)) return { status: 'absent', fields: {} };
  const openingEnd = normalized.indexOf('\n') + 1;
  const remaining = normalized.slice(openingEnd);
  const closing = /^(?:---|\.\.\.)[ \t]*\r?$/m.exec(remaining);
  if (!closing) return { status: 'unterminated', fields: {}, error: 'Missing closing YAML delimiter.' };
  const source = remaining.slice(0, closing.index);
  const yamlSha = hash(source);
  try {
    const value = yaml.load(source, { schema: yaml.DEFAULT_SCHEMA });
    if (value != null && (typeof value !== 'object' || Array.isArray(value))) {
      return { status: 'invalid', yaml_sha256: yamlSha, fields: {}, error: 'Frontmatter is not a mapping.' };
    }
    const fields = {};
    const unsupportedFields = [];
    for (const key of ['layout', 'title', 'permalink']) {
      if (!value || !own(value, key)) continue;
      if (typeof value[key] === 'string' || value[key] === null) fields[key] = value[key];
      else unsupportedFields.push({ field: key, type: Array.isArray(value[key]) ? 'array' : typeof value[key] });
    }
    return {
      status: 'parsed', yaml_sha256: yamlSha, fields,
      unsupported_fields: unsupportedFields,
      evidence: 'Complete YAML parsed; selected string/null fields only. Not a Jekyll configuration merge.',
    };
  } catch (error) {
    return { status: 'invalid', yaml_sha256: yamlSha, fields: {}, error: error.reason || error.message };
  }
}

function walkRoot(root) {
  const files = [];
  const skipped = [];
  function visit(directory, relative = '') {
    const entries = fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => compare(a.name, b.name));
    for (const entry of entries) {
      const name = relative ? `${relative}/${entry.name}` : entry.name;
      if (entry.isSymbolicLink()) {
        skipped.push({ path: name, reason: 'symlink_not_followed' });
      } else if (entry.isDirectory()) {
        if (EXCLUDED_DIRECTORIES.has(entry.name)) skipped.push({ path: name, reason: 'excluded_directory' });
        else visit(path.join(directory, entry.name), name);
      } else if (entry.isFile()) files.push(name);
      else skipped.push({ path: name, reason: 'non_regular_file' });
    }
  }
  visit(root);
  return { files: sorted(files), skipped };
}

function dependencyReferences(name, text, frontmatter, allPaths) {
  const references = [];
  function resolve(kind, reference, line, lexical = true) {
    const base = { kind, reference, line, evidence: lexical ? 'lexical_possible_reference' : 'parsed_frontmatter' };
    if (/[{}]/.test(reference) || !reference) {
      return { ...base, status: 'dynamic_unresolved', candidates: [] };
    }
    if (reference.startsWith('/') || reference.includes('\\')) {
      return { ...base, status: 'path_escape_unresolved', candidates: [] };
    }
    const directory = kind === 'layout' ? '_layouts'
      : kind === 'include_relative' ? path.posix.dirname(name) : '_includes';
    const target = path.posix.normalize(path.posix.join(directory, reference));
    if (target === '..' || target.startsWith('../')
        || (kind !== 'include_relative' && !target.startsWith(`${directory}/`))) {
      return { ...base, status: 'path_escape_unresolved', candidates: [] };
    }
    // Layout IDs omit their extension; include names are exact literal paths.
    const possibilities = kind === 'layout'
      ? [target, ...DOCUMENT_EXTENSIONS.map((extension) => `${target}${extension}`)] : [target];
    const candidates = sorted(new Set(possibilities.filter((candidate) => allPaths.has(candidate))));
    return {
      ...base, status: candidates.length === 1 ? 'static_resolved'
        : candidates.length > 1 ? 'ambiguous' : 'static_missing', candidates,
    };
  }
  const layout = frontmatter.fields.layout;
  if (typeof layout === 'string' && layout !== 'none' && layout !== 'null' && layout !== '') {
    references.push(resolve('layout', layout, null, false));
  }
  for (const match of text.matchAll(/{%-?\s*(include_relative|include)\s+([\s\S]*?)\s*-?%}/g)) {
    const argument = match[2].trim();
    const token = /^(?:"([^"]*)"|'([^']*)'|([^\s]+))/.exec(argument);
    const reference = token ? (token[1] ?? token[2] ?? token[3]) : '';
    const line = text.slice(0, match.index).split('\n').length;
    references.push({ ...resolve(match[1], reference, line), arguments: argument });
  }
  return references;
}

function inventoryRoot(root, yaml) {
  const walked = walkRoot(root);
  const allPaths = new Set(walked.files);
  const nodes = new Map();
  const documents = [];
  const rawFiles = [];
  const templates = [];
  function readNode(name, forcedKind) {
    if (nodes.has(name)) return nodes.get(name);
    const bytes = fs.readFileSync(path.join(root, name));
    const text = isUtf8(bytes) ? bytes.toString('utf8') : null;
    const frontmatter = text === null ? { status: 'not_text', fields: {} } : parseFrontmatter(text, yaml);
    const extension = path.posix.extname(name).toLowerCase();
    let kind = forcedKind;
    if (!kind) {
      if (name.startsWith('_layouts/')) kind = 'layout_template';
      else if (name.startsWith('_includes/')) kind = 'include_template';
      else if (MARKDOWN_EXTENSIONS.includes(extension)) kind = 'document';
      else if (extension === '.html') kind = ['absent', 'not_text'].includes(frontmatter.status) ? 'raw_html' : 'document';
      else if (['.json', '.csv'].includes(extension)) {
        const known = ['bidder-data.csv', 'bidders.json', 'search.json'].includes(path.posix.basename(name));
        kind = known || !['absent', 'not_text'].includes(frontmatter.status) || (text && /{%|{{/.test(text))
          ? 'generated_data_candidate' : 'raw_data';
      }
    }
    const node = {
      path: name, kind, sha256: hash(bytes), bytes: bytes.length,
      content_evidence: 'source_bytes_hashed', frontmatter,
      scan_status: text === null ? 'binary_unscanned' : 'text_scanned',
      references: text === null ? [] : dependencyReferences(name, text, frontmatter, allPaths),
    };
    nodes.set(name, node);
    return node;
  }
  for (const name of walked.files) {
    const extension = path.posix.extname(name).toLowerCase();
    if (!isTemplate(name) && ![...DOCUMENT_EXTENSIONS, '.csv', '.json'].includes(extension)) continue;
    const node = readNode(name);
    if (isTemplate(name)) templates.push(name);
    else if (node.kind === 'raw_html' || node.kind === 'raw_data') rawFiles.push(name);
    else documents.push(name);
  }
  // Follow only literal references to already enumerated regular files in this root.
  for (const node of nodes.values()) {
    for (const reference of node.references) {
      for (const target of reference.candidates) readNode(target, 'referenced_file');
    }
  }
  if (documents.length === 0) throw new Error(`No document/generated-data scan inputs in ${root}`);

  const usedBy = new Map();
  for (const node of nodes.values()) {
    for (const reference of node.references) {
      for (const target of reference.candidates) {
        if (!usedBy.has(target)) usedBy.set(target, new Set());
        usedBy.get(target).add(node.path);
      }
    }
  }
  for (const node of nodes.values()) {
    const dependencies = new Set();
    const unresolved = new Map();
    const visited = new Set();
    const pending = [node.path];
    while (pending.length) {
      const current = pending.pop();
      if (visited.has(current)) continue;
      visited.add(current);
      for (const reference of nodes.get(current).references) {
        if (reference.status !== 'static_resolved') {
          const detail = { from: current, ...reference };
          unresolved.set(JSON.stringify(detail), detail);
        }
        for (const target of reference.candidates) {
          dependencies.add(target);
          pending.push(target);
        }
      }
    }
    node.dependencies = sorted(dependencies).map((target) => ({ path: target, sha256: nodes.get(target).sha256 }));
    node.unresolved_dependencies = [...unresolved.entries()].sort(([a], [b]) => compare(a, b)).map(([, value]) => value);
    node.referenced_by = sorted(usedBy.get(node.path) || []);
    node.dependency_evidence = 'Conservative lexical graph, including ambiguous candidates; not rendered execution.';
  }
  const orderedNodes = sorted(nodes.keys()).map((name) => nodes.get(name));
  const counts = {
    walked_regular_files: walked.files.length, scanned_files: nodes.size, source_inputs: documents.length,
    documents: documents.filter((name) => nodes.get(name).kind === 'document').length,
    generated_data_candidates: documents.filter((name) => nodes.get(name).kind === 'generated_data_candidate').length,
    layout_templates: templates.filter((name) => name.startsWith('_layouts/')).length,
    include_templates: templates.filter((name) => name.startsWith('_includes/')).length,
    raw_files: rawFiles.length, frontmatter_errors: orderedNodes.filter((node) => ['invalid', 'unterminated'].includes(node.frontmatter.status)).length,
    direct_references: orderedNodes.reduce((sum, node) => sum + node.references.length, 0),
    dynamic_unresolved_references: orderedNodes.reduce((sum, node) => sum + node.references.filter((ref) => ref.status === 'dynamic_unresolved').length, 0),
  };
  return {
    nodes, documents, public: {
      counts, scanned_manifest_sha256: hash(JSON.stringify(orderedNodes.map(({ path: name, sha256 }) => [name, sha256]))),
      source_paths: sorted(documents), template_paths: sorted(templates), raw_file_paths: sorted(rawFiles),
      skipped: walked.skipped, files: orderedNodes,
    },
  };
}

function createLedger(legacy, migration) {
  const byStem = new Map();
  for (const name of migration.documents) {
    if (!isCurrentDestination(name)) continue;
    const stem = path.posix.basename(name, path.posix.extname(name));
    if (!byStem.has(stem)) byStem.set(stem, []);
    byStem.get(stem).push(name);
  }
  const destinationClaims = new Map();
  const ledger = legacy.documents.map((name) => {
    const source = legacy.nodes.get(name);
    const candidates = new Map();
    function add(candidate, evidence, role) {
      const counterpart = migration.nodes.get(candidate);
      if (!counterpart || isTemplate(candidate)) return;
      // A raw HTML asset at a guessed document path is not a migrated document.
      if (role === 'destination_candidate' && source.kind === 'document'
          && counterpart.kind !== 'document') return;
      if (!candidates.has(candidate)) candidates.set(candidate, {
        path: candidate, sha256: counterpart.sha256, kind: counterpart.kind,
        role, mapping_evidence: evidence,
      });
    }
    const generatedPaths = GENERATED_RULES[name];
    if (generatedPaths) {
      for (const candidate of generatedPaths) add(candidate, 'explicit_generated_data_path_rule', 'destination_candidate');
    } else {
      const rule = ROOT_RULES.find(([prefix]) => name.startsWith(prefix));
      if (rule) {
        const mapped = rule[1] + name.slice(rule[0].length);
        const extension = path.posix.extname(mapped);
        const stem = mapped.slice(0, -extension.length);
        const possibilities = DOCUMENT_EXTENSIONS.includes(extension.toLowerCase())
          ? DOCUMENT_EXTENSIONS.map((value) => stem + value) : [mapped];
        for (const candidate of possibilities) add(candidate, 'explicit_root_and_extension_rule', 'destination_candidate');
      }
    }
    add(name, 'same_source_path', 'retained_legacy_candidate');
    const exact = [...candidates.values()].filter((candidate) => candidate.role === 'destination_candidate');
    if (exact.length === 0) {
      const stem = path.posix.basename(name, path.posix.extname(name));
      for (const candidate of byStem.get(stem) || []) add(candidate, 'basename_only_heuristic', 'heuristic_hint');
    }
    for (const candidate of exact) {
      if (!destinationClaims.has(candidate.path)) destinationClaims.set(candidate.path, []);
      destinationClaims.get(candidate.path).push(name);
    }
    return {
      source_path: name, source_sha256: source.sha256, source_kind: source.kind,
      frontmatter: source.frontmatter, dependencies: source.dependencies,
      unresolved_dependencies: source.unresolved_dependencies,
      state: exact.length === 1 ? 'moved_unverified' : 'unresolved_mapping',
      mapping_reason: exact.length === 1 ? 'one_explicit_path_candidate'
        : exact.length > 1 ? 'multiple_explicit_path_candidates' : 'no_explicit_destination_candidate',
      candidates: [...candidates.values()].sort((a, b) => compare(a.path, b.path)),
      evidence_level: exact.length === 1 ? 'path_mapping_only' : 'unresolved',
      fidelity: 'not_evaluated',
    };
  });
  const duplicates = [...destinationClaims.entries()].filter(([, sources]) => sources.length > 1)
    .sort(([a], [b]) => compare(a, b)).map(([destination, sources]) => ({ destination, sources: sorted(sources) }));
  const duplicateSources = new Set(duplicates.flatMap(({ sources }) => sources));
  for (const row of ledger) {
    if (duplicateSources.has(row.source_path)) {
      row.state = 'unresolved_mapping'; row.mapping_reason = 'destination_claimed_by_multiple_sources'; row.evidence_level = 'unresolved';
    }
  }
  const claimed = new Set(ledger.flatMap((row) => row.candidates.filter((item) => item.role !== 'heuristic_hint').map((item) => item.path)));
  const additions = migration.documents.filter((name) => !claimed.has(name)).map((name) => ({
    path: name, sha256: migration.nodes.get(name).sha256,
    status: 'unclaimed_migration_source', evidence_level: 'inventory_only',
    note: 'May be an addition, renamed source, historical document, or missing mapping rule; not a verified new page.',
  }));
  return { ledger, duplicate_destination_claims: duplicates, migration_additions: additions };
}

export function buildInventory({ legacyRoot, migrationRoot, referenceSha, siteSha }) {
  for (const [label, sha] of [['reference', referenceSha], ['site', siteSha]]) {
    if (!/^[a-fA-F0-9]{40}$/.test(sha || '')) throw new Error(`${label} SHA must be a full 40-character Git SHA.`);
  }
  const roots = [legacyRoot, migrationRoot].map((root) => fs.realpathSync(root));
  for (const root of roots) if (!fs.statSync(root).isDirectory()) throw new Error(`Not a directory: ${root}`);
  if (isWithin(roots[0], roots[1]) || isWithin(roots[1], roots[0])) throw new Error('Input roots must be distinct and must not contain one another.');
  const yaml = loadYamlParser();
  const legacy = inventoryRoot(roots[0], yaml.api);
  const migration = inventoryRoot(roots[1], yaml.api);
  const mappings = createLedger(legacy, migration);
  return {
    schema_version: 1,
    tool: { name: 'migration-inventory', source_sha256: hash(fs.readFileSync(SCRIPT_PATH)), node: process.version, yaml_parser: yaml.details },
    provenance: {
      legacy_root: roots[0], migration_root: roots[1], reference_sha: referenceSha.toLowerCase(), site_sha: siteSha.toLowerCase(),
      sha_evidence: 'caller_supplied_not_git_verified',
      input_evidence: 'Hashes identify scanned bytes, including untracked files; supplied SHAs alone do not identify either working tree.',
    },
    selection: {
      excluded_directory_names: sorted(EXCLUDED_DIRECTORIES), symlinks: 'enumerated_as_skipped_never_followed',
      source_types: ['all .md/.mdx/.markdown outside templates', 'frontmatter-bearing .html, including invalid frontmatter', 'known or template-bearing .csv/.json'],
      root_mapping_rules: ROOT_RULES, generated_data_mapping_rules: GENERATED_RULES,
    },
    counts: {
      legacy_source_inputs: legacy.documents.length, migration_source_inputs: migration.documents.length,
      ledger_entries: mappings.ledger.length,
      moved_unverified: mappings.ledger.filter((row) => row.state === 'moved_unverified').length,
      unresolved_mapping: mappings.ledger.filter((row) => row.state === 'unresolved_mapping').length,
      duplicate_destination_claims: mappings.duplicate_destination_claims.length,
      migration_additions: mappings.migration_additions.length, verified: 0,
    },
    legacy: legacy.public, migration: migration.public, ...mappings,
    limitations: [
      'This inventory never establishes semantic, route, rendered, or production fidelity. No entry is verified.',
      'Document selection includes repository prose; .md/.mdx frontmatter absence does not imply a published Jekyll page.',
      'Path rules are hypotheses. Basename-only hints remain unresolved, and leftover legacy files are not migrated destinations.',
      'Liquid references are lexical and may occur in comments, examples, or raw blocks. Static resolution establishes file presence only.',
      'Dynamic Liquid include targets and runtime conditions are not evaluated. Ambiguous dependencies are conservatively included.',
      'Jekyll defaults/plugins/configuration, Liquid variables, MDX imports, and React imports are not dependency-resolved.',
      'Generated-data candidates are classified by names, frontmatter, or Liquid syntax; payload semantics are not validated.',
      'Symlinks and listed build/dependency directories are excluded explicitly. Binary template bytes are hashed but references are unscanned.',
      'Input trees must remain unchanged during collection; this tool does not freeze them or validate their Git provenance.',
    ],
  };
}

function outputPathOutsideInputs(output, roots) {
  const absolute = path.resolve(output);
  if (fs.existsSync(absolute) || (() => { try { fs.lstatSync(absolute); return true; } catch { return false; } })()) {
    throw new Error(`Refusing to overwrite existing output: ${absolute}`);
  }
  let ancestor = path.dirname(absolute);
  const missing = [];
  while (!fs.existsSync(ancestor)) { missing.unshift(path.basename(ancestor)); ancestor = path.dirname(ancestor); }
  const resolved = path.join(fs.realpathSync(ancestor), ...missing, path.basename(absolute));
  if (roots.some((root) => isWithin(fs.realpathSync(root), resolved))) throw new Error('Output must be outside both input roots.');
  return resolved;
}

export function main(argv = process.argv.slice(2)) {
  const { values } = parseArgs({ args: argv, options: {
    'legacy-root': { type: 'string' }, 'migration-root': { type: 'string' },
    'reference-sha': { type: 'string' }, 'site-sha': { type: 'string' }, out: { type: 'string' },
  }, strict: true, allowPositionals: false });
  for (const name of ['legacy-root', 'migration-root', 'reference-sha', 'site-sha', 'out']) {
    if (!values[name]) throw new Error(`Missing required argument --${name}`);
  }
  const output = outputPathOutsideInputs(values.out, [values['legacy-root'], values['migration-root']]);
  const report = buildInventory({ legacyRoot: values['legacy-root'], migrationRoot: values['migration-root'], referenceSha: values['reference-sha'], siteSha: values['site-sha'] });
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
  process.stdout.write(`${JSON.stringify({ output, counts: report.counts })}\n`);
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_PATH) {
  try { main(); }
  catch (error) { process.stderr.write(`migration-inventory: ${error.message}\n`); process.exitCode = 1; }
}
