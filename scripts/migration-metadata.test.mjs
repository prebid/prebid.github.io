import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { parseMetadata, validateMetadata, getMetadataField } from './migration-metadata.mjs';

const provenance = { sourcePath: 'dev-docs/bidders/example.md', sourceCommit: 'a'.repeat(40) };
const parse = (frontmatter) => parseMetadata(`---\n${frontmatter}\n---\n# Example\n`, provenance);
const bidder = (extra = '') => parse(`layout: bidder\ntitle: Example\nbiddercode: example\n${extra}`);
const clone = (value) => JSON.parse(JSON.stringify(value));
const sha = (text) => createHash('sha256').update(text).digest('hex');

test('exact CRLF/BOM bytes, fields, parser and supplied provenance survive JSON round trip', () => {
  const raw = 'layout: bidder\r\ntitle: Example\r\nbiddercode: example\r\n';
  const source = `\uFEFF---\r\n${raw}---\r\n# Body\r\n`;
  const record = parseMetadata(Buffer.from(source), provenance);
  assert.equal(record.frontmatter.raw, raw);
  assert.equal(record.frontmatter.sha256, sha(raw));
  assert.equal(record.frontmatter.bytes, Buffer.byteLength(raw));
  assert.equal(record.frontmatter.byte_start, 8);
  assert.equal(record.frontmatter.byte_end, 8 + Buffer.byteLength(raw));
  assert.equal(record.provenance.source_sha256, sha(source));
  assert.equal(record.provenance.source_commit, 'a'.repeat(40));
  assert.equal(record.provenance.git_object_binding, 'UNVERIFIED');
  assert.equal(record.parser.schema, 'DEFAULT_SCHEMA');
  assert.equal(record.parser.jekyll_runtime_equivalence, 'UNVERIFIED');
  assert.deepEqual(record.fields.biddercode, { presence: 'present', kind: 'string', value: 'example' });
  assert.equal(Object.isFrozen(record.fields), true);
  const checked = validateMetadata(clone(record), { source: Buffer.from(source) });
  assert.equal(checked.valid, true);
  assert.equal(checked.source_bytes_checked, true);
  assert.equal(checked.policy_approved, false);
  assert.equal(checked.full_m2_acceptance, false);
});

test('absent, null, false, empty text and empty list remain distinct', () => {
  const record = bidder('usp_supported: null\ncoppa_supported: false\ngpp_sids: ""\nuserIds: []');
  assert.deepEqual(getMetadataField(record, 'schain_supported'), { presence: 'absent', kind: 'absent' });
  assert.deepEqual(record.fields.usp_supported, { presence: 'present', kind: 'null', value: null });
  assert.deepEqual(record.fields.coppa_supported, { presence: 'present', kind: 'boolean', value: false });
  assert.deepEqual(record.fields.gpp_sids, { presence: 'present', kind: 'string', value: '' });
  assert.deepEqual(record.fields.userIds, { presence: 'present', kind: 'array', value: [] });
  assert.equal(record.projections.support.coppa_supported.value, 'no');
  assert.equal(record.projections.support.usp_supported.status, 'DISPUTED');
  assert.equal(record.projections.support.schain_supported.canonical_decision, null);
  assert.equal(record.projections.user_ids.status, 'UNSUPPORTED');
});

test('AdDefend-shaped omitted support records both conflicting authorities, never a false default', () => {
  const record = parse('layout: bidder\ntitle: AdDefend\nbiddercode: addefend\npbjs: true\nmedia_types: banner\ntcfeu_supported: true\ngvl_id: 539');
  for (const field of ['usp_supported', 'coppa_supported', 'schain_supported', 'dchain_supported']) {
    assert.equal(Object.hasOwn(record.fields, field), false);
    assert.equal(record.projections.support[field].status, 'DISPUTED');
    assert.equal(record.projections.support[field].observations.legacy_detail, 'check with bidder');
    assert.equal(record.projections.support[field].observations.contributor_guide, 'Default is false.');
    assert.equal(record.projections.support[field].canonical_decision, null);
  }
  assert.equal(validateMetadata(record).status, 'UNRESOLVED');
  assert.equal(record.projections.gvl.value.numeric_id, 539);
});

test('removed alias remains in CSV, is excluded from download, and retains annotated GVL text', () => {
  // Hand-authored expectations from the pinned Bidsxchange source and consumers.
  const record = parse('layout: bidder\ntitle: Bidsxchange\nbiddercode: bidsxchange\naliasCode: adtelligent\ngvl_id: 410 (adtelligent)\npbjs: true\npbs: false\nenable_download: false\npbjs_version_notes: removed in 8.13.0');
  assert.equal(record.projections.csv_membership.value, true);
  assert.equal(record.projections.download_eligibility.value, false);
  assert.deepEqual(record.projections.download_identity.value, {
    checkbox_id: 'bidsxchangeBidAdapter', module_code: 'adtelligentBidAdapter',
  });
  assert.deepEqual(record.projections.unavailable_notice.value, { required: true, reason: 'removed in 8.13.0' });
  assert.deepEqual(record.projections.gvl.value, { display: '410 (adtelligent)', numeric_id: null });
  assert.equal(record.release_availability, 'UNVERIFIED');
});

test('alias checkbox identity differs from module code; explicit filename wins with original case', () => {
  const alias = bidder('aliasCode: adkernel\npbjs: true');
  assert.deepEqual(alias.projections.download_identity.value, { checkbox_id: 'exampleBidAdapter', module_code: 'adkernelBidAdapter' });
  const override = bidder('filename: lemmaDigitalBidAdapter\naliasCode: ignored\npbjs: true');
  assert.deepEqual(override.projections.download_identity.value, { checkbox_id: 'lemmaDigitalBidAdapter', module_code: 'lemmaDigitalBidAdapter' });
  assert.equal(override.fields.aliasCode.value, 'ignored', 'a consumer precedence rule must not discard source data');
});

test('deprecation prose does not invent removal; server-only and former-code notices remain distinct', () => {
  const record = bidder('pbjs: true\npbjs_version_notes: planned deprecation in early 2027\ns2s_only: true\nprevBiddercode: oldExample');
  assert.equal(record.projections.download_eligibility.value, true);
  assert.equal(record.projections.unavailable_notice.value.required, false);
  assert.equal(record.projections.server_only_notice.value, true);
  assert.equal(record.projections.former_bidder_notice.value, 'oldExample');
  assert.equal(Object.hasOwn(record.fields, 'enable_download'), false);
});

test('legacy media projection preserves no-display and retains unsupported array tokens', () => {
  const browsi = bidder('media_types: no-display, video');
  assert.deepEqual(browsi.projections.media.value, { tokens: ['no-display', 'video'], legacy_csv: { banner: false, video: true, native: false } });
  const array = bidder('media_types:\n  - banner\n  - video\n  - audio\nredirect_from:\n  - /dev-docs/bidders/old.html');
  assert.deepEqual(array.fields.media_types.value, ['banner', 'video', 'audio']);
  assert.deepEqual(array.fields.redirect_from.value, ['/dev-docs/bidders/old.html']);
  assert.deepEqual(array.projections.media.value.tokens, ['banner', 'video', 'audio']);
  assert.equal(array.diagnostics.some((entry) => entry.code === 'UNSUPPORTED_MEDIA_TOKEN'), true);
  assert.equal(validateMetadata(array).status, 'UNRESOLVED');
});

test('GPP sections take precedence, spacing is observed, and true/absent differs from true/empty', () => {
  const sections = bidder('gpp_sids: tcfeu, usp\ngpp_supported: false');
  assert.deepEqual(sections.projections.gpp.value, { detail: 'tcfeu, usp', csv: 'tcfeu  usp' });
  assert.deepEqual(bidder('gpp_supported: true').projections.gpp.value, { detail: 'some (check with bidder)', csv: 'some (check with bidder)' });
  assert.deepEqual(bidder('gpp_supported: true\ngpp_sids: ""').projections.gpp.value, { detail: 'check with bidder', csv: 'check with bidder' });
  assert.deepEqual(bidder('gpp_sids: none').projections.gpp.value, { detail: 'none', csv: 'none' });
  assert.equal(bidder('gpp_supported: false').projections.gpp.status, 'DISPUTED');
  assert.equal(bidder('gpp_supported: false').projections.gpp.canonical_decision, null);
  assert.equal(bidder().projections.gpp.status, 'DISPUTED');
});

test('singular userId is not merged with plural and qualified text is not flattened', () => {
  const singular = bidder('userId: all\ngvl_id: 14 (adkernel)');
  assert.equal(singular.projections.user_ids.status, 'DISPUTED');
  assert.equal(singular.projections.user_ids.observations.legacy_detail, 'none');
  assert.equal(singular.fields.userId.value, 'all');
  assert.equal(Object.hasOwn(singular.fields, 'userIds'), false);
  assert.equal(bidder('userIds: all (with commercial activation)').projections.user_ids.value, 'all (with commercial activation)');
  assert.equal(bidder('userIds:').fields.userIds.kind, 'null');
});

test('explicit false safeframes retains the CSV/detail dispute', () => {
  const record = bidder('safeframes_ok: false');
  assert.equal(record.fields.safeframes_ok.value, false);
  assert.equal(record.projections.support.safeframes_ok.status, 'DISPUTED');
  assert.equal(record.projections.support.safeframes_ok.observations.legacy_detail, 'no');
  assert.equal(record.projections.support.safeframes_ok.canonical_decision, null);
});

test('module categories, initial selection and raw minimum versions remain separate from release availability', () => {
  const module = parse('layout: page_v2\npage_type: module\nmodule_code: gppControl_usstates\nrecommended: true\nenable_download: true\nmin_js_version: 8.10.0');
  assert.deepEqual(module.projections.module_download.value, {
    category: 'recommended', eligible: true, initially_checked: true,
    checkbox_id: 'gppControl_usstates', module_code: 'gppControl_usstates', min_version: '8.10.0',
  });
  const conflict = parse('page_type: module\nmodule_code: storageControl\nrecommended: true\nenable_download: false\nmin_js_version: 10.0.0');
  assert.equal(conflict.projections.module_download.status, 'DISPUTED');
  assert.equal(conflict.projections.module_download.observations.eligible, true);
  assert.equal(conflict.projections.module_download.canonical_decision, null);
  assert.equal(conflict.release_availability, 'UNVERIFIED');
  const analytics = parse('layout: analytics\nmodulecode: example\nenable_download: false');
  assert.equal(analytics.projections.module_download.value.module_code, 'exampleAnalyticsAdapter');
  assert.equal(analytics.projections.module_download.value.eligible, false);
  const userid = parse('layout: userid\nuseridmodule: exampleId');
  assert.equal(userid.projections.module_download.value.module_code, 'exampleId');
});

test('string booleans and malformed domain values are retained but cannot advertise support', () => {
  const record = bidder('pbjs: "false"\npbs: "true"\nmedia_types: [banner, 7]\ngvl_id: true');
  assert.equal(record.fields.pbjs.value, 'false');
  assert.equal(record.projections.download_eligibility.status, 'UNSUPPORTED');
  assert.equal(record.projections.support.pbjs.status, 'UNSUPPORTED');
  assert.equal(record.projections.media.status, 'UNSUPPORTED');
  assert.equal(record.projections.gvl.status, 'UNSUPPORTED');
  assert.equal(validateMetadata(record).valid, false);
  assert.equal(validateMetadata(record).errors.some((entry) => entry.code === 'INVALID_FIELD_TYPE'), true);
});

test('unsupported keys and JSON-safe nested values are retained and reported', () => {
  const record = bidder('future_metadata:\n  nested: [false, null, 3, example]\n  other: {enabled: true}');
  assert.deepEqual(record.fields.future_metadata.value, { nested: [false, null, 3, 'example'], other: { enabled: true } });
  assert.equal(record.diagnostics.some((entry) => entry.code === 'UNSUPPORTED_FIELD' && entry.fields.includes('future_metadata')), true);
  assert.equal(validateMetadata(record).status, 'UNRESOLVED');
});

test('ambiguous legacy YAML spellings are retained without claiming Jekyll parser parity', () => {
  const record = bidder('privacy_sandbox: no');
  assert.equal(record.fields.privacy_sandbox.value, 'no');
  assert.equal(record.disputes.some((entry) => entry.id === 'yaml-legacy-boolean-spelling'), true);
  assert.equal(record.parser.jekyll_runtime_equivalence, 'UNVERIFIED');
});

test('absent and empty frontmatter are distinguishable; body text is never parsed as metadata', () => {
  const absent = parseMetadata('# Example\nlayout: bidder\n', provenance);
  const empty = parseMetadata('---\n# comment only\n---\n', provenance);
  assert.equal(absent.frontmatter.state, 'absent');
  assert.deepEqual(absent.fields, {});
  assert.equal(empty.frontmatter.state, 'present');
  assert.equal(validateMetadata(absent).valid, true);
  assert.equal(validateMetadata(empty).valid, true);
  assert.throws(() => parseMetadata('---\ntitle: X\n', provenance), { code: 'UNTERMINATED_FRONTMATTER' });
});

test('reject malformed YAML, duplicate keys, non-mapping roots and non-JSON values explicitly', () => {
  for (const [source, code] of [
    ['x: [unterminated', 'INVALID_YAML'],
    ['x: 1\nx: 2', 'INVALID_YAML'],
    ['[one, two]', 'INVALID_FRONTMATTER'],
    ['null', 'INVALID_FRONTMATTER'],
    ['false: true', 'NON_JSON_KEY'],
    ['? [foo, bar]\n: value', 'NON_JSON_KEY'],
    ['x: {[foo, bar]: value}', 'NON_JSON_KEY'],
    ['x: 2026-10-04', 'NON_JSON_YAML_TAG'],
    ['x: !!binary YQ==', 'NON_JSON_YAML_TAG'],
    ['x: !!set {a: null}', 'NON_JSON_YAML_TAG'],
    ['x: !!pairs [a: 1]', 'NON_JSON_YAML_TAG'],
    ['x: !!omap [a: 1]', 'NON_JSON_YAML_TAG'],
    ['base: &base {x: 1}\nmerged: {<<: *base}', 'NON_JSON_YAML_TAG'],
    ['x: .nan', 'NON_JSON_NUMBER'],
    ['x: .inf', 'NON_JSON_NUMBER'],
    ['x: -0.0', 'NON_JSON_NUMBER'],
    ['x: 9007199254740993', 'NON_JSON_NUMBER'],
    ['x: &self {back: *self}', 'CYCLIC_VALUE'],
    ['__proto__: {polluted: true}', 'UNSAFE_KEY'],
    ['x: {constructor: nope}', 'UNSAFE_KEY'],
    ['x: !!js/function "function () {}"', 'INVALID_YAML'],
  ]) assert.throws(() => parse(source), { code }, source);
});

test('safe acyclic aliases retain raw YAML while exposing only JSON-safe values', () => {
  const record = parse('x: &value [true, example]\ny: *value');
  assert.deepEqual(record.fields.x.value, [true, 'example']);
  assert.deepEqual(record.fields.y.value, [true, 'example']);
  assert.match(record.frontmatter.raw, /\*value/);
  assert.equal(validateMetadata(clone(record)).valid, true);
});

test('invalid UTF-8, provenance and resource-exhausting raw payloads fail before projection', () => {
  assert.throws(() => parseMetadata(Buffer.from([0xff]), provenance), { code: 'INVALID_UTF8' });
  assert.throws(() => parseMetadata('\ud800', provenance), { code: 'INVALID_UTF8' });
  assert.throws(() => parseMetadata({}, provenance), { code: 'INVALID_SOURCE' });
  assert.throws(() => parseMetadata('', { ...provenance, sourcePath: '../escape' }), { code: 'INVALID_PROVENANCE' });
  assert.throws(() => parseMetadata('', { ...provenance, sourceCommit: 'HEAD' }), { code: 'INVALID_PROVENANCE' });
  assert.throws(() => parse(`long: ${'a'.repeat(1024 * 1024)}`), { code: 'YAML_LIMIT' });
});

test('record consistency checks reject altered fields, projections, disputes and hashes', () => {
  const record = bidder('pbjs: true');
  for (const change of [
    (copy) => { copy.fields.pbjs.value = false; },
    (copy) => { copy.projections.download_eligibility.value = false; },
    (copy) => { copy.disputes = []; },
    (copy) => { copy.projections.support.usp_supported.canonical_decision = false; },
    (copy) => { copy.full_m2_acceptance = true; },
    (copy) => { copy.provenance.git_object_binding = 'VERIFIED'; },
    (copy) => { copy.frontmatter.sha256 = '0'.repeat(64); },
  ]) {
    const copy = clone(record); change(copy);
    assert.equal(validateMetadata(copy).valid, false);
  }
  const otherSource = '---\nlayout: bidder\ntitle: Example\nbiddercode: example\npbjs: true\n\n---\n# Different body\n';
  assert.equal(validateMetadata(record, { source: otherSource }).valid, false);
  assert.equal(validateMetadata(record).source_bytes_checked, false);
});

test('validator rejects cyclic, accessor and non-JSON record objects without invoking getters', () => {
  const cycle = {}; cycle.self = cycle;
  assert.equal(validateMetadata(cycle).valid, false);
  let invoked = false;
  const object = {};
  Object.defineProperty(object, 'kind', { enumerable: true, get() { invoked = true; return 'm2-lossless-metadata'; } });
  assert.equal(validateMetadata(object).valid, false);
  assert.equal(invoked, false);
  assert.equal(validateMetadata({ value: undefined }).valid, false);
});
