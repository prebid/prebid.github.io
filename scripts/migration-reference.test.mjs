import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {verifyReference} from './migration-reference.mjs';

const source = Buffer.from('header\nconst x = 1;\n');
const sha = 'a'.repeat(40);
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const make = () => ({schema_version: 1, reference: {commit: sha},
  source_artifacts: {one: {path: 'source.md', bytes: source.length, sha256: hash(source), line_count: 2,
    url: `https://github.com/example/repo/blob/${sha}/source.md`}},
  cases: [{id: 'case', status: 'SOURCE_BACKED', source_refs: [{artifact: 'one', line_start: 1, line_end: 2}],
    negative_controls: ['remove body'], expected: {payload: {source_artifact: 'one', source_byte_start: 7,
      source_byte_end_exclusive: source.length, bytes: source.length - 7, text: 'const x = 1;\n', sha256: hash(source.subarray(7))}}}]});

test('reference hashes bind exact source and capture bytes', () => {
  assert.equal(verifyReference(make(), () => source).exact_code_captures_verified, 1);
  assert.throws(() => verifyReference(make(), () => Buffer.from('header\nconst x = 2;\n')), /hash/);
  const altered = make(); altered.cases[0].expected.payload.text = 'const x = 2;\n';
  assert.throws(() => verifyReference(altered, () => source), /Capture/);
});

test('empty, duplicate and disputed references cannot pass as verified parity', () => {
  const empty = make(); empty.cases = [];
  assert.throws(() => verifyReference(empty, () => source), /Empty/);
  const duplicate = make(); duplicate.cases.push(duplicate.cases[0]);
  assert.throws(() => verifyReference(duplicate, () => source), /Duplicate/);
  const disputed = make(); disputed.cases[0].status = 'DISPUTED'; disputed.cases[0].expected.canonical_decision = null;
  assert.equal(verifyReference(disputed, () => source).disputed_cases, 1);
  assert.equal(verifyReference(disputed, () => source).rendered_parity_executed, false);
  disputed.cases[0].expected.canonical_decision = false;
  assert.throws(() => verifyReference(disputed, () => source), /silently resolved/);
});

test('anchors and source paths are constrained', () => {
  const invalid = make(); invalid.cases[0].source_refs[0].line_end = 99;
  assert.throws(() => verifyReference(invalid, () => source), /anchor/);
  const outside = make(); outside.source_artifacts.one.path = '../secret';
  assert.throws(() => verifyReference(outside, () => source), /Unsafe/);
});
