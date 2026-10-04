import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { planStaging, applyStaging, STAGING_MANIFEST, STAGING_JOURNAL } from './migration-staging.mjs';

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const files = (entries) => Object.entries(entries).map(([name, content]) => ({ path: name, content }));

function fixture(t) {
  const base = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'migration-staging-test-'));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  const root = path.join(base, 'output');
  const outside = path.join(base, 'outside');
  fs.mkdirSync(root);
  fs.mkdirSync(outside);
  return { base, root, outside };
}

function write(root, name, content) {
  fs.mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
  fs.writeFileSync(path.join(root, name), content);
}

function snapshot(root) {
  return fs.readdirSync(root, { recursive: true }).sort().map((name) => {
    const target = path.join(root, name);
    const stat = fs.lstatSync(target);
    return [name, stat.isSymbolicLink() ? `symlink:${fs.readlinkSync(target)}`
      : stat.isDirectory() ? 'directory' : fs.readFileSync(target).toString('base64')];
  });
}

test('manifest bytes are deterministic, independently expected, and provenance remains an assertion', (t) => {
  const { root } = fixture(t);
  const plan = planStaging({ root, files: files({ 'z.csv': 'name\nA\n', 'a.mdx': '# A\n' }),
    provenance: { source_sha: 'unverified-snapshot', nested: { z: 2, a: 1 } } });
  assert.deepEqual(plan.manifest, { schema_version: 1,
    provenance: { nested: { a: 1, z: 2 }, source_sha: 'unverified-snapshot' },
    files: [{ path: 'a.mdx', sha256: sha256('# A\n') }, { path: 'z.csv', sha256: sha256('name\nA\n') }] });
  const reordered = planStaging({ root, files: files({ 'a.mdx': '# A\n', 'z.csv': 'name\nA\n' }),
    provenance: { nested: { a: 1, z: 2 }, source_sha: 'unverified-snapshot' } });
  assert.equal(plan.manifestBytes, reordered.manifestBytes);
  assert.equal(plan.id, reordered.id);
  assert.throws(() => { plan.files[0].content = 'changed'; }, TypeError);
  assert.deepEqual(snapshot(root), []);
});

test('dry run leaves the full tree unchanged; repeat application avoids file and manifest rewrites', (t) => {
  const { root } = fixture(t);
  write(root, 'manual/repair.mdx', '# Reviewed migration-only repair\n');
  const before = snapshot(root);
  const input = { root, files: files({ 'nested/a.mdx': '# A\n', 'b.csv': '1,2\n' }), provenance: { revision: 1 } };
  const plan = planStaging(input);
  assert.equal(applyStaging(plan, { dryRun: true }).status, 'dry-run');
  assert.deepEqual(snapshot(root), before);
  assert.equal(applyStaging(plan).status, 'applied');
  const installed = snapshot(root);
  const target = path.join(root, 'nested/a.mdx');
  const manifest = path.join(root, STAGING_MANIFEST);
  fs.utimesSync(target, 123, 123);
  fs.utimesSync(manifest, 123, 123);
  assert.equal(applyStaging(plan).status, 'unchanged');
  assert.equal(applyStaging(planStaging(input)).status, 'unchanged');
  assert.equal(fs.statSync(target).mtimeMs, 123000);
  assert.equal(fs.statSync(manifest).mtimeMs, 123000);
  assert.deepEqual(snapshot(root), installed);
  assert.equal(fs.readFileSync(path.join(root, 'manual/repair.mdx'), 'utf8'), '# Reviewed migration-only repair\n');
});

test('two snapshots add, update, rename and delete owned outputs while retaining unrelated repair', (t) => {
  const { root } = fixture(t);
  write(root, 'manual.mdx', 'reviewed repair');
  applyStaging(planStaging({ root, files: files({ 'old.mdx': 'renamed', 'gone.csv': 'obsolete', 'same.mdx': 'before' }) }));
  const plan = planStaging({ root, files: files({ 'renamed.mdx': 'renamed', 'new.csv': 'new', 'same.mdx': 'after' }) });
  assert.deepEqual(plan.operations.map(({ type, path: name }) => [type, name]), [
    ['remove', 'gone.csv'], ['write', 'new.csv'], ['remove', 'old.mdx'], ['write', 'renamed.mdx'], ['write', 'same.mdx'],
  ]);
  applyStaging(plan);
  assert.equal(fs.existsSync(path.join(root, 'gone.csv')), false);
  assert.equal(fs.existsSync(path.join(root, 'old.mdx')), false);
  assert.equal(fs.readFileSync(path.join(root, 'same.mdx'), 'utf8'), 'after');
  assert.equal(fs.readFileSync(path.join(root, 'renamed.mdx'), 'utf8'), 'renamed');
  assert.equal(fs.readFileSync(path.join(root, 'manual.mdx'), 'utf8'), 'reviewed repair');
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root, STAGING_MANIFEST))).files.map((file) => file.path),
    ['new.csv', 'renamed.mdx', 'same.mdx']);
});

test('empty selection, unsafe final names, duplicate paths and portable parent collisions fail before writing', (t) => {
  const { root } = fixture(t);
  assert.throws(() => planStaging({ root, files: [] }), /nonempty/u);
  for (const name of ['', '.', '..', '../escape.mdx', '/absolute.mdx', 'C:\\escape.mdx', 'a\\b.mdx',
    'a/../b.mdx', 'a//b.mdx', 'a/', '.git/config', 'sub/.git/index', STAGING_MANIFEST,
    'a\u0000.mdx', 'a\n.mdx', 'a./b.mdx', 'file:stream']) {
    assert.throws(() => planStaging({ root, files: [{ path: name, content: 'x' }] }), /filename/u, name);
  }
  for (const names of [['a.mdx', 'a.mdx'], ['a.mdx', 'A.mdx'], ['a', 'a/b.mdx'],
    ['A/one.mdx', 'a/two.mdx'], ['caf\u00e9/a.mdx', 'cafe\u0301/b.mdx']]) {
    assert.throws(() => planStaging({ root, files: names.map((name) => ({ path: name, content: 'x' })) }),
      /[Cc]ollision|[Dd]uplicate/u);
  }
  assert.deepEqual(snapshot(root), []);
});

test('unusual valid names are literal paths and binary payloads retain their bytes', (t) => {
  const { root } = fixture(t);
  const name = "space dir/it's $(not-a-command) `literal` \u03bb.mdx";
  const bytes = Buffer.from([0, 255, 10, 128]);
  const plan = planStaging({ root, files: [{ path: name, content: bytes }] });
  bytes.fill(42);
  applyStaging(plan);
  assert.deepEqual(fs.readFileSync(path.join(root, name)), Buffer.from([0, 255, 10, 128]));
});

test('existing final extension, directory, and case aliases are collisions even when contents match', (t) => {
  const { root } = fixture(t);
  write(root, 'page.mdx', 'same');
  write(root, 'Keep/one.txt', 'manual');
  fs.mkdirSync(path.join(root, 'folder.mdx'));
  const before = snapshot(root);
  for (const name of ['page.mdx', 'folder.mdx', 'keep/two.mdx']) {
    assert.throws(() => planStaging({ root, files: files({ [name]: 'same' }) }), /collision|regular file/u);
  }
  assert.deepEqual(snapshot(root), before);
});

test('managed manual edits and deletions block planning including obsolete outputs', (t) => {
  const { root } = fixture(t);
  applyStaging(planStaging({ root, files: files({ 'old.mdx': 'before' }) }));
  write(root, 'old.mdx', 'manual repair');
  assert.throws(() => planStaging({ root, files: files({ 'new.mdx': 'after' }) }), /manually edited/u);
  assert.equal(fs.readFileSync(path.join(root, 'old.mdx'), 'utf8'), 'manual repair');
  fs.unlinkSync(path.join(root, 'old.mdx'));
  assert.throws(() => planStaging({ root, files: files({ 'old.mdx': 'after' }) }), /removed/u);
});

test('changed destination or manifest after planning blocks dry run and apply before writes', (t) => {
  const { root } = fixture(t);
  const plan = planStaging({ root, files: files({ 'a.mdx': 'a', 'z.mdx': 'z' }) });
  write(root, 'z.mdx', 'intervening author');
  const before = snapshot(root);
  assert.throws(() => applyStaging(plan, { dryRun: true }), /changed after planning/u);
  assert.throws(() => applyStaging(plan), /changed after planning/u);
  assert.deepEqual(snapshot(root), before);
  fs.unlinkSync(path.join(root, 'z.mdx'));
  applyStaging(plan);
  const next = planStaging({ root, files: files({ 'a.mdx': 'new' }) });
  fs.appendFileSync(path.join(root, STAGING_MANIFEST), ' ');
  assert.throws(() => applyStaging(next), /changed after planning/u);
  assert.equal(fs.readFileSync(path.join(root, 'a.mdx'), 'utf8'), 'a');
});

test('symlink paths and ancestor swaps stay inside the temporary fixture and fail closed', (t) => {
  const { base, root, outside } = fixture(t);
  write(outside, 'sentinel', 'unchanged');
  fs.symlinkSync(outside, path.join(root, 'escape'));
  assert.throws(() => planStaging({ root, files: files({ 'escape/sentinel': 'bad' }) }), /Symlink/u);
  fs.symlinkSync(outside, path.join(base, 'linked-root'));
  assert.throws(() => planStaging({ root: path.join(base, 'linked-root'), files: files({ 'x': 'bad' }) }), /real directory/u);
  const plan = planStaging({ root, files: files({ 'later/sentinel': 'bad' }) });
  fs.symlinkSync(outside, path.join(root, 'later'));
  assert.throws(() => applyStaging(plan), /Symlink/u);
  assert.equal(fs.readFileSync(path.join(outside, 'sentinel'), 'utf8'), 'unchanged');
  assert.equal(fs.existsSync(path.join(root, STAGING_JOURNAL)), false);
});

test('root and parent replacement after planning are detected', (t) => {
  const { base, root } = fixture(t);
  fs.mkdirSync(path.join(root, 'nested'));
  const plan = planStaging({ root, files: files({ 'nested/page.mdx': 'new' }) });
  fs.renameSync(path.join(root, 'nested'), path.join(root, 'previous'));
  fs.mkdirSync(path.join(root, 'nested'));
  assert.throws(() => applyStaging(plan), /Parent changed/u);
  fs.renameSync(root, path.join(base, 'previous-root'));
  fs.mkdirSync(root);
  assert.throws(() => applyStaging(plan), /root changed/u);
  assert.deepEqual(snapshot(root), []);
});

for (const failAfter of [0, 1, 2, 3]) {
  test(`journal resumes interruption after ${failAfter} of three file operations with a newly planned request`, (t) => {
    const { root } = fixture(t);
    write(root, 'manual/repair.mdx', 'keep');
    applyStaging(planStaging({ root, files: files({ 'obsolete.mdx': 'delete', 'z-update.mdx': 'before' }) }));
    const request = { root, files: files({ 'a-new/page.mdx': 'added', 'z-update.mdx': 'after' }), provenance: { revision: 2 } };
    const plan = planStaging(request);
    assert.equal(plan.operations.length, 3);
    assert.throws(() => applyStaging(plan, { failAfter }), /Injected staging interruption/u);
    assert.equal(fs.existsSync(path.join(root, STAGING_JOURNAL)), true);
    const interrupted = snapshot(root);
    const resumed = planStaging(request);
    assert.equal(resumed.id, plan.id);
    assert.equal(applyStaging(resumed, { dryRun: true }).recovered, true);
    assert.deepEqual(snapshot(root), interrupted);
    assert.equal(applyStaging(resumed).recovered, true);
    assert.equal(fs.existsSync(path.join(root, STAGING_JOURNAL)), false);
    assert.equal(fs.existsSync(path.join(root, 'obsolete.mdx')), false);
    assert.equal(fs.readFileSync(path.join(root, 'a-new/page.mdx'), 'utf8'), 'added');
    assert.equal(fs.readFileSync(path.join(root, 'z-update.mdx'), 'utf8'), 'after');
    assert.equal(fs.readFileSync(path.join(root, 'manual/repair.mdx'), 'utf8'), 'keep');
    assert.equal(applyStaging(resumed).status, 'unchanged');
    assert.deepEqual(fs.readdirSync(root).filter((name) => name.startsWith('.migration-staging-')), [STAGING_MANIFEST]);
  });
}

test('recovery refuses changed requested output, edited installed files, and journal corruption', (t) => {
  const { root } = fixture(t);
  const request = { root, files: files({ 'a.mdx': 'a', 'b.mdx': 'b' }) };
  const plan = planStaging(request);
  assert.throws(() => applyStaging(plan, { failAfter: 1 }), /interruption/u);
  assert.throws(() => planStaging({ root, files: files({ 'different.mdx': 'new' }) }), /different requested/u);
  write(root, 'a.mdx', 'intervening repair');
  assert.throws(() => planStaging(request), /changed after planning/u);
  assert.throws(() => applyStaging(plan), /changed after planning/u);
  assert.equal(fs.readFileSync(path.join(root, 'a.mdx'), 'utf8'), 'intervening repair');
  const journal = JSON.parse(fs.readFileSync(path.join(root, STAGING_JOURNAL)));
  journal.plan.files[0].path = '../outside';
  write(root, STAGING_JOURNAL, JSON.stringify(journal));
  assert.throws(() => applyStaging(plan), /checksum/u);
});

test('partial transaction temporary bytes are rewritten on recovery; preexisting scratch collision is preserved', (t) => {
  const { root } = fixture(t);
  const request = { root, files: files({ 'a.mdx': 'complete' }) };
  const plan = planStaging(request);
  const scratch = `.migration-staging-install-${plan.id}-0`;
  write(root, scratch, 'unrelated');
  assert.throws(() => applyStaging(plan), /temporary filename collision/u);
  assert.equal(fs.readFileSync(path.join(root, scratch), 'utf8'), 'unrelated');
  fs.unlinkSync(path.join(root, scratch));
  assert.throws(() => applyStaging(plan, { failAfter: 0 }), /interruption/u);
  write(root, scratch, 'partial');
  applyStaging(planStaging(request));
  assert.equal(fs.readFileSync(path.join(root, 'a.mdx'), 'utf8'), 'complete');
  assert.equal(fs.existsSync(path.join(root, scratch)), false);
});

test('provenance-only updates are committed and invalid input/options are rejected', (t) => {
  const { root } = fixture(t);
  const request = { root, files: files({ 'same.mdx': 'same' }), provenance: { revision: 1 } };
  applyStaging(planStaging(request));
  const next = planStaging({ ...request, provenance: { revision: 2 } });
  assert.equal(next.operations.length, 0);
  assert.equal(applyStaging(next).status, 'applied');
  assert.equal(JSON.parse(fs.readFileSync(path.join(root, STAGING_MANIFEST))).provenance.revision, 2);
  assert.throws(() => planStaging({ ...request, provenance: { undefinedValue: undefined } }), /JSON/u);
  assert.throws(() => planStaging({ ...request, files: [{ path: 'a.mdx', content: 2 }] }), /Content/u);
  assert.throws(() => applyStaging(next, { failAfter: -1 }), /options/u);
  assert.throws(() => applyStaging({ ...next }), /returned by/u);
});
