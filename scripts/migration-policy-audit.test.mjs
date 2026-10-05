import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {auditPolicyEntries, auditGitPolicy} from './migration-policy-audit.mjs';

const sourceCommit = 'a'.repeat(40);
const page = (path, frontmatter) => ({path, bytes: `---\n${frontmatter}\n---\n# Body\n`});
const audit = entries => auditPolicyEntries(entries, {sourceCommit, requireAuthorities: false});
const bidder = page('dev-docs/bidders/one.md', 'layout: bidder\nbiddercode: one\ntitle: One');
const module = page('dev-docs/modules/example.md', 'page_type: module\nmodule_code: example\nrecommended: true\nenable_download: true');

test('counts distinguish absence, null, explicit flags, invalid strings and each consumer dispute', () => {
  const entries = [bidder, module,
    page('dev-docs/bidders/two.md', 'layout: bidder\nbiddercode: two\nusp_supported: false\ncoppa_supported: null\nschain_supported: true\ndchain_supported: false\ngpp_supported: false\nsafeframes_ok: false\nuserId: all'),
    page('dev-docs/bidders/three.md', 'layout: bidder\nbiddercode: three\nusp_supported: null\ncoppa_supported: true\nschain_supported: "false"\ndchain_supported: false\ngpp_supported: false\ngpp_sids: tcfeu\nuserId: alpha\nuserIds: beta'),
    page('dev-docs/modules/conflicting.md', 'page_type: module\nmodule_code: conflicting\nrecommended: true\nenable_download: false'),
  ];
  const report = audit(entries);
  assert.equal(report.scope.bidder_pages, 3);
  assert.equal(report.scope.module_pages, 2);
  assert.equal(report.cases['omitted-usp_supported'].affected_count, 2);
  assert.equal(report.cases['omitted-usp_supported'].absent_count, 1);
  assert.equal(report.cases['omitted-usp_supported'].null_count, 1);
  assert.equal(report.cases['omitted-usp_supported'].explicit_false_count, 1);
  assert.equal(report.cases['omitted-coppa_supported'].affected_count, 2);
  assert.equal(report.cases['omitted-schain_supported'].other_value_count, 1);
  assert.equal(report.cases['omitted-dchain_supported'].explicit_false_count, 2);
  assert.equal(report.cases['gpp-false-fallback'].affected_count, 1);
  assert.equal(report.cases['gpp-false-fallback'].all_explicit_false_count, 2);
  assert.equal(report.cases['safeframes-false'].affected_count, 1);
  assert.equal(report.cases['userid-field-spelling'].singular_only_count, 1);
  assert.equal(report.cases['userid-field-spelling'].both_different_count, 1);
  assert.deepEqual(report.cases['recommended-disabled-module'].affected_paths, ['dev-docs/modules/conflicting.md']);
  assert.equal(report.cases['recommended-disabled-module'].recommended_true_count, 2);
  for (const item of Object.values(report.cases)) {
    assert.equal(item.recommendation.status, 'PROPOSED_NOT_APPROVED');
    assert.equal(item.recommendation.canonical_decision, null);
  }
  assert.equal(report.decisions.approved, false);
  assert.equal(report.git_object_binding, 'CALLER_SUPPLIED_UNVERIFIED');
});

test('plain YAML value tokens are counted, while quotes, keys, comments and prose are not', () => {
  const source = page('dev-docs/bidders/spellings.md', `layout: bidder
biddercode: spelling
privacy_sandbox: no
switches: {active: on, idle: OFF}
items:
  - yes
quoted: 'no'
quoted2: "off"
tagged: !!str no
description: |
  fake: no
  yes
no: true
# userId: off
`);
  const report = audit([source, module]);
  const finding = report.cases['bare-yaml-boolean-spelling'];
  assert.equal(finding.affected_count, 1);
  assert.equal(finding.occurrence_count, 4);
  assert.deepEqual(finding.lexeme_counts, {OFF: 1, no: 1, on: 1, yes: 1});
  const record = report.records.find(row => row.path === source.path);
  assert.deepEqual(record.bare_boolean_scalars.map(item => item.lexeme), ['no', 'on', 'OFF', 'yes']);
  assert.equal(record.bare_boolean_scalars[0].line, 4);
  assert.equal(record.bare_boolean_scalars[0].source_line, 'privacy_sandbox: no');
  for (const item of record.bare_boolean_scalars) {
    assert.equal(Buffer.from(record.raw_frontmatter).subarray(item.frontmatter_byte_start, item.frontmatter_byte_end).toString('utf8'), item.lexeme);
    assert.equal(item.parsed_kind, 'string');
  }
});

test('all supplied file extensions are considered, body examples never become metadata', () => {
  const unconventional = page('unusual/bidder.source', 'layout: bidder\nbiddercode: unusual');
  const body = {path: 'guide.md', bytes: '# Title\n---\nlayout: bidder\n---\n'};
  const binary = {path: 'image.png', bytes: Buffer.from([137, 80, 78, 71, 255])};
  const report = audit([unconventional, module, body, binary]);
  assert.equal(report.scope.selected_input_files, 4);
  assert.equal(report.scope.bidder_pages, 1);
  assert.equal(report.scope.no_frontmatter, 2);
  assert.deepEqual(report.cases['omitted-usp_supported'].affected_paths, ['unusual/bidder.source']);
});

test('frontmatter failures remain in the manifest and make counts explicitly incomplete', () => {
  const entries = [bidder, module,
    page('broken.md', 'layout: bidder\nx: [broken'),
    {path: 'unterminated.md', bytes: '---\nlayout: bidder\n'},
    {path: 'bad-encoding.md', bytes: Buffer.concat([Buffer.from('---\nlayout: bidder\n---\n'), Buffer.from([255])])},
    page('duplicate.md', 'layout: bidder\nlayout: module'),
  ];
  const report = audit(entries);
  assert.equal(report.status, 'INCOMPLETE_SOURCE_AUDIT');
  assert.equal(report.scope.parse_failures, 4);
  assert.equal(report.scope.counts_are_partial, true);
  assert.equal(report.manifest.length, 6);
  assert.deepEqual(report.parse_failures.map(row => row.path), ['bad-encoding.md', 'broken.md', 'duplicate.md', 'unterminated.md']);
  const duplicate = report.parse_failures.find(row => row.path === 'duplicate.md');
  assert.deepEqual(duplicate.lexical_repeated_fields, [{name: 'layout', definitions: [
    {line: 2, text: 'layout: bidder'}, {line: 3, text: 'layout: module'},
  ]}]);
  assert.equal(duplicate.lexical_layout_bidder_hint, true);
  assert.equal(duplicate.recovery_status, 'UNPARSED_NO_FIRST_OR_LAST_VALUE_SELECTED');
  assert.equal(duplicate.raw_frontmatter, 'layout: bidder\nlayout: module\n');
});

test('GPP false scope reports raw section states rather than treating all false declarations alike', () => {
  const entries = [module,
    page('a.md', 'layout: bidder\ngpp_supported: false'),
    page('b.md', 'layout: bidder\ngpp_supported: false\ngpp_sids:'),
    page('c.md', 'layout: bidder\ngpp_supported: false\ngpp_sids: ""'),
    page('d.md', 'layout: bidder\ngpp_supported: false\ngpp_sids: tcfeu'),
    page('e.md', 'layout: bidder\ngpp_supported: "false"'),
  ];
  const result = audit(entries).cases['gpp-false-fallback'];
  assert.equal(result.affected_count, 3);
  assert.equal(result.all_explicit_false_count, 4);
  assert.equal(result.false_with_other_sections_count, 1);
  assert.deepEqual(result.sections_states, {absent: 1, null: 1, empty_string: 1});
});

test('dual role sources remain in both independently selected policy scopes', () => {
  const report = audit([page('both.md', 'layout: bidder\npage_type: module\nrecommended: true\nenable_download: false')]);
  assert.equal(report.scope.bidder_pages, 1);
  assert.equal(report.scope.module_pages, 1);
  assert.deepEqual(report.records[0].selected_scopes, ['bidder', 'module']);
  assert.equal(report.cases['recommended-disabled-module'].affected_count, 1);
});

test('raw frontmatter, type distinctions and exact source hashes survive reporting', () => {
  const source = {path: 'types.md', bytes: '\uFEFF---\r\nlayout: bidder\r\nuserId: all\r\nuserIds:\r\n---\r\nBody'};
  const report = audit([source, module]);
  const record = report.records.find(row => row.path === 'types.md');
  assert.equal(record.raw_frontmatter, 'layout: bidder\r\nuserId: all\r\nuserIds:\r\n');
  assert.equal(record.source_sha256, createHash('sha256').update(source.bytes).digest('hex'));
  assert.deepEqual(record.fields.userId, {presence: 'present', kind: 'string', value: 'all'});
  assert.deepEqual(record.fields.userIds, {presence: 'present', kind: 'null', value: null});
  assert.deepEqual(record.fields.usp_supported, {presence: 'absent', kind: 'absent'});
  assert.equal(report.cases['userid-field-spelling'].both_different_count, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(report)), report);
});

test('missing authority sources cannot produce a complete authority audit by default', () => {
  const report = auditPolicyEntries([bidder, module], {sourceCommit});
  assert.equal(report.status, 'INCOMPLETE_SOURCE_AUDIT');
  assert.equal(report.authority_issues.length, 4);
  assert.equal(report.scope.counts_are_partial, true);
});

test('empty, duplicate, zero-domain and mutable source selections are errors', () => {
  assert.throws(() => audit([]), /Empty/);
  assert.throws(() => audit([bidder, bidder, module]), /Duplicate/);
  assert.throws(() => audit([module]), /Zero bidder/);
  assert.throws(() => audit([bidder]), /Zero module/);
  assert.throws(() => auditPolicyEntries([bidder, module], {sourceCommit: 'HEAD'}), /immutable/);
  assert.throws(() => auditGitPolicy({repo: '.', sourceCommit: 'HEAD; printf fake'}), /immutable/);
});
