/**
 * M2 pilot: preserve source metadata and expose observed legacy consumer rules.
 * Pure API: no files, Git commands, Liquid, JSX, or network requests are executed.
 * SOURCE_BACKED projections describe source logic, not approved domain policy.
 */
import { createHash } from 'node:crypto';
import { isUtf8 } from 'node:buffer';
import { createRequire } from 'node:module';
import { isDeepStrictEqual } from 'node:util';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');
const parserVersion = require('js-yaml/package.json').version;
const hash = (value) => createHash('sha256').update(value).digest('hex');
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const TYPE = 'm2-lossless-metadata';
const REFERENCE = 'b16d95ac1ee95238c070bc9f137d52718287d1cc';
const BLOCKED_KEYS = new Set(['__proto__', 'prototype', 'constructor']);
const JSON_YAML_TAGS = new Set(['str', 'null', 'bool', 'int', 'float', 'seq', 'map'].map((tag) => `tag:yaml.org,2002:${tag}`));
const FALSE_DEFAULT = ['pbjs', 'pbs', 'prebid_member', 'tcfeu_supported'];
const OMITTED_DISPUTES = new Set(['usp_supported', 'coppa_supported', 'schain_supported', 'dchain_supported']);
const SUPPORT = [
  'usp_supported', 'coppa_supported', 'schain_supported', 'dchain_supported',
  'safeframes_ok', 'deals_supported', 'floors_supported', 'fpd_supported',
  'dsa_supported', 'endpoint_compression', 'pbs_app_supported',
];
const BOOLEANS = [...FALSE_DEFAULT, ...SUPPORT, 'gpp_supported', 'enable_download', 's2s_only', 'recommended', 'vendor_specific'];
const STRINGS = [
  'layout', 'page_type', 'title', 'description', 'biddercode', 'aliasCode', 'filename',
  'prevBiddercode', 'pbjs_version_notes', 'multiformat_supported', 'module_code',
  'modulecode', 'useridmodule', 'display_name', 'min_js_version', 'privacy_sandbox',
];
const KNOWN = new Set([
  ...BOOLEANS, ...STRINGS, 'media_types', 'gpp_sids', 'gvl_id', 'userIds', 'userId',
  'ortb_blocking_supported', 'redirect_from', 'sidebarType', 'permalink', 'search',
]);

export class MetadataError extends Error {
  constructor(code, message) { super(message); this.name = 'MetadataError'; this.code = code; }
}
const fail = (code, message) => { throw new MetadataError(code, message); };
const plain = (value) => value !== null && typeof value === 'object'
  && [Object.prototype, null].includes(Object.getPrototypeOf(value));

// JSON.stringify alone hides cycles, undefined, non-finite values and custom types.
// Count traversed alias edges as well as distinct objects to bound alias expansion.
function assertJson(value) {
  let count = 0;
  const active = new Set();
  function visit(item, location, depth) {
    if (++count > 50_000 || depth > 60) fail('JSON_LIMIT', `Metadata exceeds JSON traversal limits at ${location}.`);
    if (item === null || typeof item === 'string' || typeof item === 'boolean') return;
    if (typeof item === 'number') {
      if (!Number.isFinite(item) || Object.is(item, -0)
        || (Number.isInteger(item) && !Number.isSafeInteger(item))) {
        fail('NON_JSON_NUMBER', `Unsafe or non-JSON number at ${location}.`);
      }
      return;
    }
    if (!Array.isArray(item) && !plain(item)) fail('NON_JSON_VALUE', `Non-JSON value at ${location}.`);
    if (active.has(item)) fail('CYCLIC_VALUE', `Cyclic YAML/JSON value at ${location}.`);
    active.add(item);
    const keys = Reflect.ownKeys(item);
    for (const key of keys) {
      if (Array.isArray(item) && key === 'length') continue;
      if (typeof key !== 'string' || BLOCKED_KEYS.has(key)) fail('UNSAFE_KEY', `Unsafe metadata key at ${location}.`);
      const descriptor = Object.getOwnPropertyDescriptor(item, key);
      if (!descriptor.enumerable || !own(descriptor, 'value')) fail('NON_JSON_VALUE', `Non-data property at ${location}.${key}.`);
      if (Array.isArray(item) && !/^(0|[1-9]\d*)$/.test(key)) fail('NON_JSON_VALUE', `Non-index array property at ${location}.`);
      visit(descriptor.value, `${location}.${key}`, depth + 1);
    }
    if (Array.isArray(item) && keys.length !== item.length + 1) fail('NON_JSON_VALUE', `Sparse array at ${location}.`);
    active.delete(item);
  }
  visit(value, '$', 0);
}

function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

function textSource(source) {
  if (Buffer.isBuffer(source)) {
    if (!isUtf8(source)) fail('INVALID_UTF8', 'Source must be valid UTF-8.');
    return source.toString('utf8');
  }
  if (typeof source !== 'string') fail('INVALID_SOURCE', 'Source must be a string or UTF-8 Buffer.');
  if (Buffer.from(source).toString('utf8') !== source) fail('INVALID_UTF8', 'Source contains unpaired UTF-16 surrogates.');
  return source;
}

function parseRaw(raw) {
  if (Buffer.byteLength(raw) > 1024 * 1024) fail('YAML_LIMIT', 'Frontmatter exceeds the 1 MiB pilot limit.');
  let value;
  try {
    value = yaml.load(raw, {
      schema: yaml.DEFAULT_SCHEMA,
      maxDepth: 60,
      onWarning(warning) { throw warning; },
      listener(event, state) {
        if (event === 'close' && state.tag && !['!', '?'].includes(state.tag) && !JSON_YAML_TAGS.has(state.tag)) {
          fail('NON_JSON_YAML_TAG', `Unsupported YAML type ${state.tag}; raw metadata is not coerced to JSON.`);
        }
        if (event === 'close' && typeof state.result !== 'string'
          && /^(?:\s|#[^\r\n]*(?:\r?\n|$))*:/.test(state.input.slice(state.position))) {
          fail('NON_JSON_KEY', 'YAML mapping keys must be strings; non-string keys are not silently stringified.');
        }
      },
    });
  } catch (error) {
    if (error instanceof MetadataError) throw error;
    fail('INVALID_YAML', `Invalid or unsupported YAML: ${error.reason || error.message}`);
  }
  if (value === undefined || (value === null && raw.split('\n').every((line) => !line.trim() || line.trim().startsWith('#')))) value = {};
  if (!plain(value)) fail('INVALID_FRONTMATTER', 'Frontmatter must be a YAML mapping.');
  assertJson(value);
  return JSON.parse(JSON.stringify(value));
}

function extractFrontmatter(source) {
  const opening = /^(?:\uFEFF)?---[ \t]*\r?\n/.exec(source);
  if (!opening) return { state: 'absent', raw: '', sha256: hash(''), bytes: 0, byte_start: 0, byte_end: 0, opening: '', closing: '' };
  const remaining = source.slice(opening[0].length);
  const closing = /^(?:---|\.\.\.)[ \t]*(?:\r?\n|$)/m.exec(remaining);
  if (!closing) fail('UNTERMINATED_FRONTMATTER', 'Missing closing YAML delimiter.');
  const raw = remaining.slice(0, closing.index);
  const byteStart = Buffer.byteLength(opening[0]);
  return { state: 'present', raw, sha256: hash(raw), bytes: Buffer.byteLength(raw),
    byte_start: byteStart, byte_end: byteStart + Buffer.byteLength(raw), opening: opening[0], closing: closing[0] };
}

function fieldsFrom(values) {
  return Object.fromEntries(Object.entries(values).map(([name, value]) => [name, {
    presence: 'present', kind: value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value, value,
  }]));
}

/** Only present source keys are stored; this accessor makes absence explicit. */
export function getMetadataField(record, name) {
  return own(record.fields, name) ? record.fields[name] : freeze({ presence: 'absent', kind: 'absent' });
}

const observed = (value, sourceFields, authority) => ({ status: 'SOURCE_BACKED', value, source_fields: sourceFields, authority });
const unsupported = (fields, reason) => ({ status: 'UNSUPPORTED', source_fields: fields, reason });

function project(values, raw) {
  const diagnostics = [];
  const disputes = [];
  const projections = {};
  const issues = (code, fields, message, severity = 'error') => diagnostics.push({ code, fields, message, severity });
  const valid = (name, predicate) => !own(values, name) || values[name] === null || predicate(values[name]);
  const bad = (names) => diagnostics.some((entry) => entry.severity === 'error' && entry.fields.some((name) => names.includes(name)));
  const dispute = (id, fields, observations, reason) => {
    disputes.push({ id, fields, observations, reason, canonical_decision: null });
    return { status: 'DISPUTED', dispute_id: id, source_fields: fields, observations, canonical_decision: null };
  };
  const bool = (name) => values[name] === true;
  const nil = (name) => !own(values, name) || values[name] === null;
  const metaAuthority = '_includes/dev-docs/bidder-meta-data.html';
  const downloadAuthority = 'download.md:58-112';

  for (const name of Object.keys(values)) {
    if (!KNOWN.has(name)) issues('UNSUPPORTED_FIELD', [name], 'Raw field retained; no pilot consumer policy is defined.', 'warning');
  }
  for (const name of BOOLEANS) {
    if (!valid(name, (value) => typeof value === 'boolean')) issues('INVALID_FIELD_TYPE', [name], 'Expected a boolean, null, or omitted field; no truthiness coercion is allowed.');
  }
  for (const name of STRINGS) {
    if (!valid(name, (value) => typeof value === 'string')) issues('INVALID_FIELD_TYPE', [name], 'Expected a string, null, or omitted field.');
  }
  for (const name of ['media_types', 'gpp_sids', 'userIds', 'userId', 'redirect_from']) {
    if (!valid(name, (value) => typeof value === 'string' || (Array.isArray(value) && value.every((part) => typeof part === 'string')))) {
      issues('INVALID_FIELD_TYPE', [name], 'Expected a string, string array, null, or omitted field.');
    }
  }
  if (!valid('gvl_id', (value) => typeof value === 'string' || (Number.isSafeInteger(value) && value >= 0))) issues('INVALID_FIELD_TYPE', ['gvl_id'], 'Expected an exact string or nonnegative safe integer.');
  if (!valid('ortb_blocking_supported', (value) => typeof value === 'boolean' || value === 'partial' || value === 'check with bidder')) issues('INVALID_FIELD_TYPE', ['ortb_blocking_supported'], 'Expected boolean, partial, or check with bidder.');
  if (/^[ \t]*(?:[\w-]+:[ \t]*|-[ \t]+)(?:yes|no|on|off)[ \t]*(?:#.*)?$/im.test(raw)) {
    dispute('yaml-legacy-boolean-spelling', [], { parser: 'js-yaml DEFAULT_SCHEMA only treats true/false as booleans' },
      'Bare yes/no/on/off can differ across YAML schemas. Jekyll runtime interpretation has not been established.');
  }

  if (values.layout === 'bidder') {
    for (const name of ['biddercode', 'title']) {
      if (typeof values[name] !== 'string' || !values[name].trim()) issues('MISSING_IDENTITY', [name], 'A bidder projection requires a nonempty string identity.');
    }
    for (const name of ['filename', 'aliasCode', 'prevBiddercode']) {
      if (own(values, name) && values[name] !== null && (typeof values[name] !== 'string' || !values[name].trim())) issues('INVALID_IDENTITY', [name], 'An explicit identity must be a nonempty string.');
    }
    projections.csv_membership = observed(true, ['layout'], 'dev-docs/bidder-data.csv:6-8');
    const identityFields = ['biddercode', 'aliasCode', 'filename'];
    projections.download_identity = bad(identityFields) ? unsupported(identityFields, 'Invalid identity field.')
      : observed({
        checkbox_id: values.filename ?? `${values.biddercode}BidAdapter`,
        module_code: values.filename ?? `${values.aliasCode ?? values.biddercode}BidAdapter`,
      }, identityFields, downloadAuthority);
    projections.download_eligibility = bad(['pbjs', 'enable_download']) ? unsupported(['pbjs', 'enable_download'], 'Invalid selector field.')
      : observed(bool('pbjs') && values.enable_download !== false, ['pbjs', 'enable_download'], downloadAuthority);
    projections.unavailable_notice = bad(['enable_download', 'pbjs_version_notes']) ? unsupported(['enable_download', 'pbjs_version_notes'], 'Invalid notice field.')
      : observed({ required: values.enable_download === false, reason: values.pbjs_version_notes ?? null }, ['enable_download', 'pbjs_version_notes'], '_layouts/bidder.html:38-41');
    projections.server_only_notice = bad(['s2s_only']) ? unsupported(['s2s_only'], 'Invalid notice field.')
      : observed(bool('s2s_only'), ['s2s_only'], '_layouts/bidder.html:44-47');
    projections.former_bidder_notice = bad(['prevBiddercode']) ? unsupported(['prevBiddercode'], 'Invalid former identity.')
      : observed(values.prevBiddercode ?? null, ['prevBiddercode'], '_layouts/bidder.html:83-84');

    projections.support = {};
    for (const name of [...FALSE_DEFAULT, ...SUPPORT, 'ortb_blocking_supported']) {
      if (bad([name])) { projections.support[name] = unsupported([name], 'Invalid support value.'); continue; }
      if (nil(name) && OMITTED_DISPUTES.has(name)) {
        projections.support[name] = dispute(`omitted-${name}`, [name], { legacy_detail: 'check with bidder', contributor_guide: 'Default is false.' }, 'Omission policy conflicts; no canonical default is chosen.');
      } else if (name === 'safeframes_ok' && values[name] === false) {
        projections.support[name] = dispute('safeframes-false-csv', [name], { legacy_detail: 'no', csv_expression: 'page.safeframes_ok and page.safeframes_ok == false' }, 'CSV and detail conditions differ. Liquid runtime and intended CSV policy require confirmation.');
      } else {
        const value = values[name] === true ? 'yes' : values[name] === false ? 'no'
          : values[name] === 'partial' ? 'partial' : FALSE_DEFAULT.includes(name) ? 'no' : 'check with bidder';
        projections.support[name] = observed(value, [name], metaAuthority);
      }
    }
    projections.server_app_detail_visible = bad(['pbs']) ? unsupported(['pbs'], 'Invalid server selector.')
      : observed(bool('pbs'), ['pbs'], `${metaAuthority}:69-75`);

    const media = values.media_types;
    const tokens = Array.isArray(media) ? [...media] : typeof media === 'string' ? media.split(',').map((token) => token.trim()) : [];
    const contains = (token) => (typeof media === 'string' || Array.isArray(media)) && media.includes(token);
    projections.media = bad(['media_types']) ? unsupported(['media_types'], 'Invalid media type value.') : observed({
      tokens, legacy_csv: { banner: !contains('no-display'), video: contains('video'), native: contains('native') },
    }, ['media_types'], 'dev-docs/bidder-data.csv:7');
    if (tokens.some((token) => !['banner', 'video', 'native', 'no-display'].includes(token))) {
      issues('UNSUPPORTED_MEDIA_TOKEN', ['media_types'], 'All tokens are retained; the legacy CSV/React consumers do not describe every token.', 'warning');
    }

    projections.gvl = bad(['gvl_id']) ? unsupported(['gvl_id'], 'Invalid GVL value.')
      : observed({ display: nil('gvl_id') ? 'check with bidder' : String(values.gvl_id), numeric_id: typeof values.gvl_id === 'number' ? values.gvl_id : null }, ['gvl_id'], `${metaAuthority}:24`);

    const sections = values.gpp_sids;
    if (bad(['gpp_sids', 'gpp_supported']) || Array.isArray(sections)) {
      projections.gpp = unsupported(['gpp_sids', 'gpp_supported'], 'Array or malformed GPP projection is not defined by this pilot; raw data is retained.');
    } else if (typeof sections === 'string' && sections !== '') {
      projections.gpp = observed({ detail: sections, csv: sections.split(',').join(' ') }, ['gpp_sids'], `${metaAuthority}:28; dev-docs/bidder-data.csv:7`);
    } else if (bool('gpp_supported') && nil('gpp_sids')) {
      projections.gpp = observed({ detail: 'some (check with bidder)', csv: 'some (check with bidder)' }, ['gpp_supported', 'gpp_sids'], `${metaAuthority}:28`);
    } else if (values.gpp_supported === false) {
      projections.gpp = dispute('gpp-false-scope', ['gpp_supported', 'gpp_sids'], { expression: 'page.gpp_supported == false and gpp_sids == nil' }, 'Bare gpp_sids differs from page.gpp_sids; intended scope is unresolved.');
    } else if (nil('gpp_supported') && nil('gpp_sids')) {
      projections.gpp = dispute('gpp-omitted-default', ['gpp_supported', 'gpp_sids'], { legacy_detail: 'check with bidder', contributor_guide: 'Default is None.' }, 'Missing GPP policy is not inferred from one consumer.');
    } else {
      projections.gpp = observed({ detail: 'check with bidder', csv: 'check with bidder' }, ['gpp_sids', 'gpp_supported'], `${metaAuthority}:28`);
    }

    const userIds = values.userIds;
    const legacyUserIds = nil('userIds') || userIds === '' ? 'none' : userIds;
    if (bad(['userId', 'userIds']) || Array.isArray(userIds)) {
      projections.user_ids = unsupported(['userId', 'userIds'], 'Array/malformed user-ID rendering is unverified; raw data is retained.');
    } else if (own(values, 'userId')) {
      projections.user_ids = dispute('userid-field-spelling', ['userId', 'userIds'], { legacy_detail_reads: 'userIds', legacy_detail: legacyUserIds, contributor_guide_names: 'userId' }, 'Singular and plural identities are not silently combined.');
    } else {
      projections.user_ids = observed(legacyUserIds, ['userIds'], `${metaAuthority}:64`);
    }
    projections.multiformat = bad(['multiformat_supported']) ? unsupported(['multiformat_supported'], 'Invalid multiformat value.')
      : observed(values.multiformat_supported ?? 'check with bidder', ['multiformat_supported'], `${metaAuthority}:18`);
    if (!nil('multiformat_supported') && !['will-bid-on-any', 'will-bid-on-one', 'will-not-bid', 'check with bidder'].includes(values.multiformat_supported)) {
      issues('UNSUPPORTED_MULTIFORMAT_VALUE', ['multiformat_supported'], 'Legacy free text is retained; the current React enum cannot represent it.', 'warning');
    }
  }

  if (values.page_type === 'module' || ['analytics', 'userid'].includes(values.layout)) {
    const module = values.page_type === 'module';
    const codeField = module ? 'module_code' : values.layout === 'analytics' ? 'modulecode' : 'useridmodule';
    if (typeof values[codeField] !== 'string' || !values[codeField].trim()) issues('MISSING_IDENTITY', [codeField], 'Download category requires a nonempty source module code.');
    const fields = [codeField, 'enable_download', 'recommended', 'vendor_specific', 'min_js_version'];
    if (bad(fields)) projections.module_download = unsupported(fields, 'Invalid module selector or identity.');
    else {
      const recommended = module && bool('recommended');
      const category = !module ? values.layout : recommended ? 'recommended' : bool('vendor_specific') ? 'vendor_specific' : 'general';
      const code = `${values[codeField]}${values.layout === 'analytics' && !module ? 'AnalyticsAdapter' : ''}`;
      const result = { category, eligible: recommended || values.enable_download !== false,
        initially_checked: recommended, checkbox_id: code, module_code: code,
        min_version: module ? values.min_js_version ?? null : null };
      projections.module_download = recommended && values.enable_download === false
        ? dispute('recommended-disabled-module', fields, result, 'The recommended template branch ignores enable_download:false; no corrected policy is selected.')
        : observed(result, fields, downloadAuthority);
    }
  }
  return { projections, diagnostics, disputes };
}

/** Parse without coercing domain values or claiming the caller's SHA is verified. */
export function parseMetadata(source, { sourcePath, sourceCommit } = {}) {
  if (typeof sourcePath !== 'string' || !sourcePath || sourcePath.includes('\\') || sourcePath.includes('\0')
    || sourcePath.startsWith('/') || sourcePath.split('/').some((part) => ['', '.', '..'].includes(part))) fail('INVALID_PROVENANCE', 'sourcePath must be a repository-relative path.');
  if (typeof sourceCommit !== 'string' || !/^[a-f0-9]{40}$/.test(sourceCommit)) fail('INVALID_PROVENANCE', 'sourceCommit must be a full lowercase Git SHA-1; it remains unverified.');
  const text = textSource(source);
  const frontmatter = extractFrontmatter(text);
  const values = parseRaw(frontmatter.raw);
  return freeze({ schema_version: 1, kind: TYPE,
    provenance: { source_path: sourcePath, source_commit: sourceCommit, source_sha256: hash(text),
      source_bytes: Buffer.byteLength(text), git_object_binding: 'UNVERIFIED' },
    parser: { package: 'js-yaml', version: parserVersion, schema: 'DEFAULT_SCHEMA', jekyll_runtime_equivalence: 'UNVERIFIED' },
    frontmatter, fields: fieldsFrom(values),
    projection_authority: { source_commit: REFERENCE, contract: 'migration/REFERENCE_CONTRACT.md', mode: 'SOURCE_LOGIC_ONLY', canonical_policy: 'NOT_APPROVED' },
    ...project(values, frontmatter.raw),
    release_availability: 'UNVERIFIED', full_m2_acceptance: false,
  });
}

/**
 * Recompute fields/projections from retained bytes. Optional source also checks
 * the supplied source hash/framing; neither mode verifies a Git object or policy.
 */
export function validateMetadata(record, { source } = {}) {
  const errors = [];
  const error = (code, message) => errors.push({ code, message });
  try {
    assertJson(record);
    if (!plain(record) || record.kind !== TYPE || record.schema_version !== 1) fail('INVALID_RECORD', 'Unsupported metadata record kind/version.');
    const { frontmatter, provenance } = record;
    if (!plain(frontmatter) || !plain(provenance) || typeof frontmatter.raw !== 'string') fail('INVALID_RECORD', 'Missing raw metadata or provenance.');
    // Reconstruct only enough source to validate fields/framing, with no body claim.
    const reconstructed = `${frontmatter.opening}${frontmatter.raw}${frontmatter.closing}`;
    const expected = parseMetadata(source === undefined ? reconstructed : source, {
      sourcePath: provenance.source_path, sourceCommit: provenance.source_commit,
    });
    if (!isDeepStrictEqual(Object.keys(record).sort(), Object.keys(expected).sort())) error('INVALID_RECORD', 'Unexpected or missing record envelope fields.');
    if (!isDeepStrictEqual(frontmatter, expected.frontmatter)) error('FRONTMATTER_MISMATCH', 'Raw bytes, framing, offsets or hash differ.');
    for (const key of ['fields', 'parser', 'projection_authority', 'projections', 'diagnostics', 'disputes', 'release_availability', 'full_m2_acceptance']) {
      if (!isDeepStrictEqual(record[key], expected[key])) error('DERIVATION_MISMATCH', `Stored ${key} differs from recomputation from retained raw metadata.`);
    }
    if (provenance.git_object_binding !== 'UNVERIFIED' || !/^[a-f0-9]{64}$/.test(provenance.source_sha256)
      || !Number.isSafeInteger(provenance.source_bytes) || provenance.source_bytes < Buffer.byteLength(reconstructed)) error('INVALID_PROVENANCE', 'Malformed or overstated source provenance.');
    if (source !== undefined && !isDeepStrictEqual(provenance, expected.provenance)) error('SOURCE_MISMATCH', 'Supplied source does not match record provenance.');
    for (const entry of expected.diagnostics.filter((entry) => entry.severity === 'error')) error(entry.code, `${entry.fields.join(', ')}: ${entry.message}`);
    const unresolved = expected.disputes.length > 0 || expected.diagnostics.some((entry) => entry.severity === 'warning')
      || JSON.stringify(expected.projections).includes('"status":"UNSUPPORTED"');
    return { valid: errors.length === 0, status: errors.length ? 'INVALID' : unresolved ? 'UNRESOLVED' : 'SOURCE_BACKED',
      errors, diagnostics: expected.diagnostics, disputes: expected.disputes,
      source_bytes_checked: source !== undefined, git_object_binding: 'UNVERIFIED',
      policy_approved: false, full_m2_acceptance: false };
  } catch (cause) {
    error(cause.code || 'INVALID_RECORD', cause.message);
    return { valid: false, status: 'INVALID', errors, diagnostics: [], disputes: [],
      source_bytes_checked: false, git_object_binding: 'UNVERIFIED', policy_approved: false, full_m2_acceptance: false };
  }
}
