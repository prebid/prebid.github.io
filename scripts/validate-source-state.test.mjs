import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {sourceState, assertSourceUnchanged} from './validate-source-state.mjs';

function fixture(t) {
  const top = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'prebid-source-state-fixture-')));
  t.after(() => fs.rmSync(top, {recursive: true, force: true}));
  const siteDir = path.join(top, 'repo'); fs.mkdirSync(siteDir);
  const env = {...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_AUTHOR_NAME: 'Guard Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
    GIT_COMMITTER_NAME: 'Guard Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid'};
  const git = args => execFileSync('git', ['-C', siteDir, ...args], {env, encoding: 'utf8'}).trim();
  git(['init', '--quiet', '--initial-branch=codex/source-state-fixture']);
  fs.writeFileSync(path.join(siteDir, '.gitignore'), 'build/\n.docusaurus/\nnode_modules/\n.validation-results/\n');
  fs.mkdirSync(path.join(siteDir, 'src'));
  fs.writeFileSync(path.join(siteDir, 'src/app.ts'), 'export const value = 1;\n');
  git(['add', '--all']); git(['-c', 'core.hooksPath=/dev/null', 'commit', '--quiet', '-m', 'fixture']);
  const externalTool = path.join(top, 'runner.mjs'); fs.writeFileSync(externalTool, 'export const version = 1;\n');
  const options = {siteDir, toolPaths: [externalTool], env};
  const initial = sourceState(options);
  assert.equal(initial.status, ''); assert.equal(initial.files.length, 2);
  return {siteDir, externalTool, options, initial, git};
}

test('unchanged passes and ignored build/cache/receipt outputs are allowed', t => {
  const f = fixture(t);
  assert.equal(assertSourceUnchanged(f.initial, sourceState(f.options), 'before candidate').status, 'unchanged');
  for (const directory of ['build', '.docusaurus', 'node_modules', '.validation-results']) {
    fs.mkdirSync(path.join(f.siteDir, directory)); fs.writeFileSync(path.join(f.siteDir, directory, 'generated.txt'), 'output');
  }
  assert.deepEqual(sourceState(f.options), f.initial);
  assert.equal(assertSourceUnchanged(f.initial, sourceState(f.options), 'before verdict').status, 'unchanged');
});

test('tracked-byte edit is rejected and restoration passes', t => {
  const f = fixture(t); const file = path.join(f.siteDir, 'src/app.ts'); const saved = fs.readFileSync(file);
  fs.writeFileSync(file, 'export const value = 2;\n');
  assert.throws(() => assertSourceUnchanged(f.initial, sourceState(f.options), 'before candidate'), /source paths, bytes/);
  fs.writeFileSync(file, saved);
  assert.equal(assertSourceUnchanged(f.initial, sourceState(f.options), 'restored').status, 'unchanged');
});

test('nonignored untracked addition is rejected and removal restores state', t => {
  const f = fixture(t); const file = path.join(f.siteDir, 'src/new.ts'); fs.writeFileSync(file, 'export {};\n');
  const changed = sourceState(f.options); assert.deepEqual(changed.untracked, ['src/new.ts']);
  assert.throws(() => assertSourceUnchanged(f.initial, changed, 'before verdict'), /source paths, bytes/);
  fs.unlinkSync(file);
  assert.equal(assertSourceUnchanged(f.initial, sourceState(f.options), 'restored').status, 'unchanged');
});

test('new clean HEAD is rejected even when source bytes are identical', t => {
  const f = fixture(t);
  f.git(['-c', 'core.hooksPath=/dev/null', 'commit', '--allow-empty', '--quiet', '-m', 'new head']);
  const changed = sourceState(f.options); assert.equal(changed.status, '');
  assert.notEqual(changed.head, f.initial.head); assert.deepEqual(changed.files, f.initial.files);
  assert.throws(() => assertSourceUnchanged(f.initial, changed, 'before candidate'), /HEAD changed/);
});

test('tools outside the candidate root are guarded independently', t => {
  const f = fixture(t); const saved = fs.readFileSync(f.externalTool);
  fs.writeFileSync(f.externalTool, 'export const version = 2;\n');
  const changed = sourceState(f.options); assert.deepEqual(changed.files, f.initial.files);
  assert.throws(() => assertSourceUnchanged(f.initial, changed, 'before verdict'), /tool bytes changed/);
  fs.writeFileSync(f.externalTool, saved);
  assert.equal(assertSourceUnchanged(f.initial, sourceState(f.options), 'restored').status, 'unchanged');
});

test('initially dirty development inputs are retained and cannot change later', t => {
  const f = fixture(t); const file = path.join(f.siteDir, 'src/local.ts');
  fs.writeFileSync(file, 'export const local = 1;\n');
  const development = sourceState(f.options); assert.notEqual(development.status, '');
  assert.equal(assertSourceUnchanged(development, sourceState(f.options), 'same development input').status, 'unchanged');
  fs.writeFileSync(file, 'export const local = 2;\n');
  assert.throws(() => assertSourceUnchanged(development, sourceState(f.options), 'before verdict'), /source paths, bytes/);
});
