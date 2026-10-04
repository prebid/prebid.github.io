import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyScannedFiles} from './migration-provenance.mjs';

test('Git binding rejects empty, missing, duplicate and altered source entries', () => {
  const row = {path: 'docs/example.md', bytes: 7, sha256: 'known-digest'};
  const expected = new Map([[row.path, row]]);
  assert.equal(verifyScannedFiles([row], expected), 1);
  assert.throws(() => verifyScannedFiles([], expected), /Empty/);
  assert.throws(() => verifyScannedFiles([row, row], expected), /Duplicate/);
  assert.throws(() => verifyScannedFiles([{...row, path: 'missing.md'}], expected), /mismatch/);
  assert.throws(() => verifyScannedFiles([{...row, sha256: 'changed'}], expected), /mismatch/);
  assert.throws(() => verifyScannedFiles([{...row, bytes: 8}], expected), /mismatch/);
});
