import test from 'node:test';
import assert from 'node:assert/strict';
import {legacyDecisionProbe, legacyProbe} from './migration-legacy-consumers.mjs';

test('pinned Ruby Liquid executes real support fields without choosing omitted policy', () => {
  const r = legacyDecisionProbe(); const rows = Object.fromEntries(r.results.map(row => [row.id, row]));
  assert.equal(r.results.length, 10); assert.equal(r.yaml_results.length, 2);
  assert.equal(r.runtime.gems.liquid.version, '4.0.4');
  for (const field of ['usp', 'coppa', 'schain', 'dchain']) {
    assert.equal(rows.omitted.csv[field], 'check with bidder');
    assert.equal(rows.false.csv[field], 'no'); assert.equal(rows.true.csv[field], 'yes');
  }
  assert.equal(rows.null.csv.usp, 'check with bidder');
  assert.equal(rows['string-false'].csv.usp, 'check with bidder');
});

test('actual template discrepancies and ambient GPP binding remain explicit observations', () => {
  const rows = Object.fromEntries(legacyDecisionProbe().results.map(row => [row.id, row]));
  assert.equal(rows.false.detail['Safeframes OK'], 'no');
  assert.equal(rows.false.csv.safeframes, 'check with bidder');
  assert.equal(rows.false.csv.gpp, 'None'); assert.equal(rows['gpp-false-empty'].csv.gpp, 'None');
  assert.equal(rows['gpp-false-global'].csv.gpp, 'check with bidder');
  assert.equal(rows['gpp-sections-win'].csv.gpp, 'tcfeu  usp');
  assert.equal(rows.true.csv.gpp, 'some (check with bidder)');
  assert.equal(rows['singular-id'].csv['user-ids'], 'none');
  assert.equal(rows['both-id'].csv['user-ids'], 'id5Id');
});

test('safe_yaml scalar and duplicate behavior is measured separately from strict migration parsing', () => {
  const r = legacyDecisionProbe();
  assert.deepEqual(r.yaml_results[0].data, {yes_value: true, no_value: false, on_value: true, off_value: false, quoted_no: 'no'});
  assert.deepEqual(r.yaml_results[1].data, {pbs: false});
  assert.equal(r.yaml_results.every(row => row.error === null), true);
  assert.throws(() => legacyProbe({}), /Empty/);
  assert.throws(() => legacyProbe({pages: [{id: 'same', page: {}}, {id: 'same', page: {}}]}), /duplicate/);
});
