#!/usr/bin/env node
/** Read-only Git census. Independent of migration-metadata.mjs and its projections. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';
import {isUtf8} from 'node:buffer';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');
const parserVersion = require('js-yaml/package.json').version;
const SCRIPT = fileURLToPath(import.meta.url);
export const DEFAULT_SOURCE_COMMIT = 'b16d95ac1ee95238c070bc9f137d52718287d1cc';
const hash = (bytes, algorithm = 'sha256') => createHash(algorithm).update(bytes).digest('hex');
const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const sorted = (values) => [...values].sort();
const OMITTED = ['usp_supported', 'coppa_supported', 'schain_supported', 'dchain_supported'];
const FIELDS = ['layout', 'page_type', 'title', 'biddercode', 'module_code', 'modulecode',
  ...OMITTED, 'gpp_supported', 'gpp_sids', 'safeframes_ok', 'userId', 'userIds',
  'privacy_sandbox', 'recommended', 'enable_download'];
const AUTHORITY_MARKERS = {
  '_includes/dev-docs/bidder-meta-data.html': [...OMITTED.map(field => `page.${field}`),
    'page.gpp_supported == false and gpp_sids == nil', 'page.safeframes_ok == false', 'page.userIds'],
  'dev-docs/bidder-data.csv': ['page.gpp_supported == false and gpp_sids == nil',
    'page.safeframes_ok and page.safeframes_ok == false', 'page.userIds'],
  'dev-docs/bidder-adaptor.md': ['usp_supported: true', 'coppa_supported: true',
    'schain_supported: true', 'dchain_supported: true', 'userId: (list of supported vendors)'],
  'download.md': ['if page.recommended == true', 'page.enable_download == false or page.recommended == true'],
};
const check = (condition, message) => { if (!condition) throw new Error(message); };

function snapshot(value, active = new Set(), depth = 0) {
  if (depth > 40) return {kind: 'unsupported', reason: 'depth_limit'};
  if (value === null) return {kind: 'null', value: null};
  if (typeof value === 'number' && !Number.isFinite(value)) return {kind: 'non_json_number', value: String(value)};
  if (['string', 'boolean', 'number'].includes(typeof value)) return {kind: typeof value, value};
  if (value instanceof Date) return {kind: 'yaml_timestamp', value: value.toISOString()};
  if (value instanceof Uint8Array) return {kind: 'yaml_binary', base64: Buffer.from(value).toString('base64')};
  if (active.has(value)) return {kind: 'unsupported', reason: 'cyclic_alias'};
  if (!value || typeof value !== 'object') return {kind: 'unsupported', reason: typeof value};
  active.add(value);
  const result = Array.isArray(value)
    ? {kind: 'array', items: value.map(item => snapshot(item, active, depth + 1))}
    : {kind: 'mapping', entries: Object.entries(value).map(([key, item]) => ({key, ...snapshot(item, active, depth + 1)}))};
  active.delete(value);
  return result;
}

function field(data, name) {
  return own(data, name) ? {presence: 'present', ...snapshot(data[name])} : {presence: 'absent', kind: 'absent'};
}

function parseEntry(entry) {
  const bytes = Buffer.isBuffer(entry.bytes) ? entry.bytes : Buffer.from(entry.bytes);
  const manifest = {path: entry.path, git_blob_oid: entry.git_blob_oid ?? null,
    source_sha256: hash(bytes), source_bytes: bytes.length};
  const prefix = bytes.subarray(0, 128).toString('utf8');
  const opening = /^(?:\uFEFF)?---[ \t]*\r?\n/.exec(prefix);
  if (!opening) return {manifest: {...manifest, parse_status: 'no_frontmatter'}, data: null, record: null};
  if (!isUtf8(bytes)) return {manifest: {...manifest, parse_status: 'parse_failure', reason: 'invalid_utf8_frontmatter_source'}, data: null, record: null};
  const text = bytes.toString('utf8');
  const rest = text.slice(opening[0].length);
  const closing = /^(?:---|\.\.\.)[ \t]*(?:\r?\n|$)/m.exec(rest);
  if (!closing) return {manifest: {...manifest, parse_status: 'parse_failure', reason: 'unterminated_frontmatter'}, data: null, record: null};
  const raw = rest.slice(0, closing.index);
  const offsets = [];
  const bare = [];
  const warnings = [];
  try {
    const data = yaml.load(raw, {schema: yaml.DEFAULT_SCHEMA, maxDepth: 60,
      onWarning: warning => warnings.push(warning.reason || warning.message),
      listener(event, state) {
        if (event === 'open') { offsets.push(state.position); return; }
        const start = offsets.pop();
        if (event !== 'close' || state.kind !== 'scalar' || typeof state.result !== 'string'
          || !/^(?:yes|no|on|off)$/i.test(state.result)) return;
        const token = raw.slice(start, state.position).trim();
        // Actual scalar nodes only. Exclude quoted/tagged strings, keys, comments,
        // and text that merely looks like metadata inside a YAML block scalar.
        if (token !== state.result || /^(?:\s|#[^\r\n]*(?:\r?\n|$))*:/.test(state.input.slice(state.position))) return;
        const leading = raw.slice(start, state.position).indexOf(token);
        const tokenStart = start + leading;
        const lineStart = raw.lastIndexOf('\n', tokenStart - 1) + 1;
        const lineEnd = raw.indexOf('\n', tokenStart);
        const linePrefix = raw.slice(lineStart, tokenStart);
        const key = /(?:^|[{,])\s*([A-Za-z_][\w-]*)\s*:\s*$/.exec(linePrefix)?.[1] ?? null;
        const byteStart = Buffer.byteLength(raw.slice(0, tokenStart));
        const byteEnd = Buffer.byteLength(raw.slice(0, tokenStart + token.length));
        // js-yaml can visit the same scalar again while distinguishing a block
        // sequence/mapping. A source token is one occurrence, not parser events.
        if (bare.some(item => item.frontmatter_byte_start === byteStart && item.frontmatter_byte_end === byteEnd)) return;
        bare.push({lexeme: token, parsed_kind: 'string', parsed_value: state.result,
          field_hint: key, line: 2 + raw.slice(0, tokenStart).split('\n').length - 1,
          source_line: raw.slice(lineStart, lineEnd < 0 ? raw.length : lineEnd).replace(/\r$/, ''),
          frontmatter_byte_start: byteStart, frontmatter_byte_end: byteEnd});
      }});
    const values = data == null && raw.split('\n').every(line => !line.trim() || line.trim().startsWith('#')) ? {} : data;
    if (!values || typeof values !== 'object' || Array.isArray(values) || values instanceof Date || values instanceof Uint8Array) throw new Error('Frontmatter is not a mapping');
    const selected = values.layout === 'bidder' ? 'bidder' : values.page_type === 'module' ? 'module' : 'other';
    const record = {...manifest, selected_kind: selected,
      selected_scopes: [...(values.layout === 'bidder' ? ['bidder'] : []), ...(values.page_type === 'module' ? ['module'] : [])],
      frontmatter_sha256: hash(raw), raw_frontmatter: raw,
      fields: Object.fromEntries(FIELDS.map(name => [name, field(values, name)])),
      bare_boolean_scalars: bare, parser_warnings: warnings};
    return {manifest: {...manifest, parse_status: 'parsed_mapping', selected_kind: selected,
      frontmatter_sha256: hash(raw), parser_warnings: warnings}, data: values, record};
  } catch (error) {
    const lexicalFields = new Map();
    raw.split(/\r?\n/).forEach((text, index) => {
      const key = /^([A-Za-z_][\w-]*)\s*:/.exec(text)?.[1];
      if (key) lexicalFields.set(key, [...(lexicalFields.get(key) ?? []), {line: index + 2, text}]);
    });
    return {manifest: {...manifest, parse_status: 'parse_failure', frontmatter_sha256: hash(raw),
      reason: error.reason || error.message, line: error.mark ? error.mark.line + 2 : null,
      raw_frontmatter: raw,
      lexical_layout_bidder_hint: /^layout:[ \t]*bidder[ \t]*(?:#.*)?\r?$/m.test(raw),
      lexical_repeated_fields: [...lexicalFields.entries()].filter(([, definitions]) => definitions.length > 1)
        .map(([name, definitions]) => ({name, definitions})),
      recovery_status: 'UNPARSED_NO_FIRST_OR_LAST_VALUE_SELECTED'}, data: null, record: null};
  }
}

const recommendation = (text, impact) => ({status: 'PROPOSED_NOT_APPROVED', text,
  compatibility_impact: impact, canonical_decision: null});

/** Independent raw census. Entries are caller-supplied until auditGitPolicy binds them. */
export function auditPolicyEntries(entries, {sourceCommit, requireAuthorities = true} = {}) {
  check(/^[a-f0-9]{40}$/.test(sourceCommit ?? ''), 'A full immutable source commit is required');
  check(Array.isArray(entries) && entries.length > 0, 'Empty source selection');
  check(new Set(entries.map(entry => entry.path)).size === entries.length, 'Duplicate source paths');
  for (const entry of entries) check(typeof entry.path === 'string' && entry.path
    && (Buffer.isBuffer(entry.bytes) || typeof entry.bytes === 'string'), 'Invalid source entry');
  const parsed = [...entries].sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0).map(parseEntry);
  const bidders = parsed.filter(row => row.data?.layout === 'bidder');
  const modules = parsed.filter(row => row.data?.page_type === 'module');
  check(bidders.length > 0, 'Zero bidder selection cannot establish an audit');
  check(modules.length > 0, 'Zero module selection cannot establish the recommended-module audit');
  const caseFor = (rows, observation, proposed) => ({affected_count: rows.length,
    affected_paths: rows.map(row => row.manifest.path), observation, recommendation: proposed});
  const cases = {};
  for (const name of OMITTED) {
    const missing = bidders.filter(row => !own(row.data, name));
    const nulls = bidders.filter(row => own(row.data, name) && row.data[name] === null);
    const affected = bidders.filter(row => !own(row.data, name) || row.data[name] === null);
    cases[`omitted-${name}`] = {...caseFor(affected,
      'The detail template renders omitted/null as check with bidder; contributor prose says Default is false. These are conflicting source authorities, not an approved default.',
      recommendation('Keep absent/null as unknown; require explicit false to mean unsupported and update contributor wording after approval.',
        'Preserves the current template unknown display; differs from applying the contributor false default and current React defaults for some fields.')),
    absent_count: missing.length, null_count: nulls.length,
    explicit_true_count: bidders.filter(row => row.data[name] === true).length,
    explicit_false_count: bidders.filter(row => row.data[name] === false).length,
    other_value_count: bidders.filter(row => own(row.data, name) && row.data[name] !== null && typeof row.data[name] !== 'boolean').length};
  }
  const falseGpp = bidders.filter(row => row.data.gpp_supported === false);
  const gppFallback = falseGpp.filter(row => !own(row.data, 'gpp_sids') || row.data.gpp_sids === null || row.data.gpp_sids === '');
  cases['gpp-false-fallback'] = {...caseFor(gppFallback,
    'Raw gpp_supported:false with absent/null/empty sections reaches the scope-disputed fallback candidate. Its source expression reads bare gpp_sids, unlike page.gpp_sids in neighboring branches. Runtime output is not evaluated.',
    recommendation('Use page-scoped section data consistently; preserve explicit sections first and use an explicit false fallback only when no section list is supplied.',
      'Requires approval of empty/null treatment and confirmation of deployed Liquid scope. It must not change explicit-list precedence or infer false from missing support metadata.')),
  all_explicit_false_count: falseGpp.length,
  false_with_other_sections_count: falseGpp.length - gppFallback.length,
  sections_states: {absent: gppFallback.filter(row => !own(row.data, 'gpp_sids')).length,
    null: gppFallback.filter(row => own(row.data, 'gpp_sids') && row.data.gpp_sids === null).length,
    empty_string: gppFallback.filter(row => row.data.gpp_sids === '').length}};
  cases['safeframes-false'] = caseFor(bidders.filter(row => row.data.safeframes_ok === false),
    'Detail compares directly to false; CSV additionally requires the same field to be truthy. This census does not execute either template.',
    recommendation('After approving the correction, make explicit false produce no in both detail and CSV; retain omitted/null as unknown.',
      'The intended correction can change CSV cells while leaving detail meaning unchanged. Validate the deployed false branch and identify downstream CSV consumers before rollout.'));
  const singular = bidders.filter(row => own(row.data, 'userId'));
  const both = singular.filter(row => own(row.data, 'userIds'));
  const different = both.filter(row => JSON.stringify(snapshot(row.data.userId)) !== JSON.stringify(snapshot(row.data.userIds)));
  cases['userid-field-spelling'] = {...caseFor(singular,
    'The contributor guide names singular userId; detail and CSV read plural userIds. Raw key presence is counted without silently coalescing them.',
    recommendation('Document plural userIds as the consumer field; propose a deprecated singular input alias only when plural is absent. Require content review for dual-key conflicts.',
      'Recovering singular-only declarations changes advertised values. Explicit-null/empty plural values must not be treated as absent, and conflicting dual keys must not choose a winner automatically.')),
  singular_only_count: singular.length - both.length, both_count: both.length,
  both_equal_count: both.length - different.length, both_different_count: different.length,
  both_different_paths: different.map(row => row.manifest.path),
  plural_only_count: bidders.filter(row => own(row.data, 'userIds') && !own(row.data, 'userId')).length};
  const bare = parsed.filter(row => row.record?.bare_boolean_scalars.length);
  const occurrences = bare.flatMap(row => row.record.bare_boolean_scalars);
  cases['bare-yaml-boolean-spelling'] = {...caseFor(bare,
    'Actual unquoted yes/no/on/off scalar tokens parse as strings under recorded js-yaml DEFAULT_SCHEMA. Quoted text, comments, keys and block-scalar prose are excluded. No equivalence with deployed Psych/safe_yaml is claimed.',
    recommendation('Use explicit true/false for approved boolean meanings and quoted strings for intended literals; record a field-specific decision after deployed-parser comparison.',
      'Bulk quoting or coercion can change visible values and selector truthiness. Preserve source lexemes and baseline deployed outcomes before any rewrite.')),
  occurrence_count: occurrences.length, bidder_pages: bare.filter(row => row.data.layout === 'bidder').length,
  module_pages: bare.filter(row => row.data.page_type === 'module').length,
  other_pages: bare.filter(row => row.record.selected_kind === 'other').length,
  lexeme_counts: Object.fromEntries(sorted(new Set(occurrences.map(item => item.lexeme))).map(lexeme => [lexeme, occurrences.filter(item => item.lexeme === lexeme).length]))};
  cases['recommended-disabled-module'] = {...caseFor(modules.filter(row => row.data.recommended === true && row.data.enable_download === false),
    'The recommended download branch tests recommended:true without excluding enable_download:false; general/vendor branches exclude disabled modules.',
    recommendation('Propose explicit enable_download:false taking precedence in every category, including recommended modules.',
      'This changes selection only for conflicting declarations. A zero current count does not establish the branch is safe for future inputs; retain a synthetic conflict control.')),
  recommended_true_count: modules.filter(row => row.data.recommended === true).length,
  disabled_module_count: modules.filter(row => row.data.enable_download === false).length};

  const authorities = {};
  const authorityIssues = [];
  for (const [name, markers] of Object.entries(AUTHORITY_MARKERS)) {
    const entry = entries.find(item => item.path === name);
    if (!entry) { authorityIssues.push({path: name, reason: 'missing_authority_source'}); continue; }
    const bytes = Buffer.isBuffer(entry.bytes) ? entry.bytes : Buffer.from(entry.bytes);
    const lines = bytes.toString('utf8').split(/\r?\n/);
    const anchors = markers.map(marker => ({marker, matches: lines.flatMap((text, index) => text.includes(marker) ? [{line: index + 1, text}] : [])}));
    for (const anchor of anchors) if (!anchor.matches.length) authorityIssues.push({path: name, reason: 'source_rule_changed_or_unmatched', marker: anchor.marker});
    authorities[name] = {git_blob_oid: entry.git_blob_oid ?? null, source_sha256: hash(bytes), bytes: bytes.length, anchors};
  }
  const failures = parsed.filter(row => row.manifest.parse_status === 'parse_failure').map(row => row.manifest);
  const warnings = parsed.filter(row => row.manifest.parser_warnings?.length).map(row => ({path: row.manifest.path, warnings: row.manifest.parser_warnings}));
  const incomplete = failures.length > 0 || warnings.length > 0 || (requireAuthorities && authorityIssues.length > 0);
  for (const item of Object.values(cases)) {
    item.count_basis = failures.length || warnings.length ? 'LOWER_BOUND_SUCCESSFULLY_PARSED_SOURCES' : 'COMPLETE_SUPPLIED_PARSED_SOURCES';
  }
  return {schema_version: 1, kind: 'metadata-policy-source-census', source_commit: sourceCommit,
    status: incomplete ? 'INCOMPLETE_SOURCE_AUDIT' : 'COMPLETE_SOURCE_AUDIT',
    git_object_binding: 'CALLER_SUPPLIED_UNVERIFIED', parser: {package: 'js-yaml', version: parserVersion, schema: 'DEFAULT_SCHEMA', deployed_yaml_equivalence: 'UNVERIFIED'},
    scope: {selected_input_files: entries.length, parsed_mappings: parsed.filter(row => row.record).length,
      no_frontmatter: parsed.filter(row => row.manifest.parse_status === 'no_frontmatter').length,
      bidder_pages: bidders.length, module_pages: modules.length, parse_failures: failures.length,
      unparsed_lexical_bidder_hints: failures.filter(row => row.lexical_layout_bidder_hint).length,
      counts_are_partial: incomplete, source_selector: 'All supplied entries; exact parsed layout:bidder or page_type:module; no normalizer used'},
    cases, records: parsed.filter(row => row.record && (row.record.selected_kind !== 'other' || row.record.bare_boolean_scalars.length)).map(row => row.record),
    manifest: parsed.map(row => row.manifest), parse_failures: failures, parser_warnings: warnings,
    authorities, authority_issues: authorityIssues,
    decisions: {status: 'PROPOSED_NOT_APPROVED', approved: false, full_m2_acceptance: false},
    limits: ['No normalizer or migrated output supplies counts or expected values',
      'Source membership is not deployed Jekyll page membership: configuration/exclusions are not executed',
      'No Ruby Liquid, Psych/safe_yaml, Jekyll, browser, CSV consumer or download service execution',
      'Recommendations do not select canonical field values or authorize document changes']};
}

/** Read every tracked regular blob, including unknown extensions; never follow links. */
export function auditGitPolicy({repo, sourceCommit = DEFAULT_SOURCE_COMMIT} = {}) {
  check(/^[a-f0-9]{40}$/.test(sourceCommit), 'Use a full immutable Git SHA-1, not a mutable ref');
  check(typeof repo === 'string' && repo, 'Repository path is required');
  const cwd = fs.realpathSync(repo);
  const git = (args, options = {}) => execFileSync('git', ['--no-replace-objects', '-C', cwd, ...args], {maxBuffer: 128 * 1024 * 1024, ...options});
  check(git(['rev-parse', '--verify', `${sourceCommit}^{commit}`], {encoding: 'utf8'}).trim() === sourceCommit, 'Commit identity mismatch');
  const tree = git(['ls-tree', '-r', '-z', '--full-tree', sourceCommit]);
  check(isUtf8(tree), 'Non-UTF-8 Git paths require an explicit byte-safe naming adapter');
  const entries = tree.toString('utf8').split('\0').filter(Boolean).map(line => {
    const match = /^(\d+) (\w+) ([a-f0-9]{40})\t([\s\S]+)$/.exec(line);
    check(match, 'Unexpected Git tree entry');
    return {mode: match[1], type: match[2], git_blob_oid: match[3], path: match[4]};
  });
  check(entries.length > 0, 'Empty Git tree');
  const regular = entries.filter(entry => entry.type === 'blob' && ['100644', '100755'].includes(entry.mode));
  check(regular.length > 0, 'No tracked regular source blobs');
  const ids = [...new Set(regular.map(entry => entry.git_blob_oid))];
  const output = git(['cat-file', '--batch'], {input: `${ids.join('\n')}\n`});
  const objects = new Map(); let offset = 0;
  for (const id of ids) {
    const end = output.indexOf(10, offset);
    check(end >= offset, 'Truncated Git object header');
    const header = output.subarray(offset, end).toString('ascii');
    const match = /^([a-f0-9]{40}) blob (\d+)$/.exec(header);
    check(match && match[1] === id, `Unexpected Git blob header: ${header}`);
    const length = Number(match[2]); offset = end + 1;
    check(Number.isSafeInteger(length) && offset + length < output.length && output[offset + length] === 10, 'Truncated Git object bytes');
    const bytes = output.subarray(offset, offset + length); offset += length + 1;
    const identity = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
    check(identity === id, 'Git object bytes do not match their object identity');
    objects.set(id, bytes);
  }
  check(offset === output.length, 'Unexpected trailing Git batch output');
  const report = auditPolicyEntries(regular.map(entry => ({...entry, bytes: objects.get(entry.git_blob_oid)})), {sourceCommit, requireAuthorities: true});
  report.git_object_binding = 'VERIFIED_GIT_BLOB_BYTES';
  report.scope.source_selector = 'Every tracked regular blob, any extension, at the immutable Git tree; frontmatter must begin at byte zero (optional UTF-8 BOM)';
  report.scope.tree_entries = entries.length;
  report.scope.excluded_nonregular = entries.filter(entry => !regular.includes(entry)).map(({path: name, mode, type}) => ({path: name, mode, type, reason: 'not_followed_or_executed'}));
  if (report.scope.excluded_nonregular.length) { report.status = 'INCOMPLETE_SOURCE_AUDIT'; report.scope.counts_are_partial = true; }
  report.tool_sha256 = hash(fs.readFileSync(SCRIPT));
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT) {
  try {
    const {values} = parseArgs({options: {repo: {type: 'string'}, commit: {type: 'string'}, out: {type: 'string'}}, strict: true});
    check(values.repo && values.out, 'Required: --repo PATH --out NEW_JSON_FILE [--commit FULL_SHA]');
    const report = auditGitPolicy({repo: values.repo, sourceCommit: values.commit ?? DEFAULT_SOURCE_COMMIT});
    fs.writeFileSync(values.out, `${JSON.stringify(report, null, 2)}\n`, {flag: 'wx'});
    console.log(JSON.stringify({status: report.status, scope: report.scope,
      cases: Object.fromEntries(Object.entries(report.cases).map(([id, item]) => [id, {affected_count: item.affected_count}])),
      report: path.resolve(values.out)}, null, 2));
    if (report.status !== 'COMPLETE_SOURCE_AUDIT') process.exitCode = 1;
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
