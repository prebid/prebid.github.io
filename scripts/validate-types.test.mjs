import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const require = createRequire(import.meta.url);
const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tsc = require.resolve('typescript/bin/tsc');
const posix = value => value.split(path.sep).join('/');
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

function run(project, args = []) {
  const result = spawnSync(process.execPath, [tsc, '--project', path.join(project, 'tsconfig.json'), '--pretty', 'false', ...args],
    {cwd: project, encoding: 'utf8', timeout: 120_000, maxBuffer: 32 * 1024 * 1024});
  assert.ifError(result.error);
  assert.equal(result.signal, null, `tsc terminated by signal: ${result.stderr}`);
  return {...result, output: result.stdout + result.stderr};
}

function selection(project) {
  const result = run(project, ['--showConfig']);
  assert.equal(result.status, 0, result.output);
  const configuration = JSON.parse(result.stdout);
  const files = (configuration.files ?? []).map(file => posix(path.relative(project, path.resolve(project, file)))).sort();
  assert.ok(files.length > 0, 'The actual compiler selected no source inputs.');
  assert.equal(new Set(files).size, files.length, 'Compiler source selection contains duplicate paths.');
  return {configuration, files};
}

function sourceFiles(root) {
  const result = [];
  function walk(directory) {
    for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
      const file = path.join(directory, entry.name);
      assert.ok(!entry.isSymbolicLink(), `Unexpected source symlink: ${file}`);
      if (entry.isDirectory()) walk(file);
      else if (entry.isFile() && /\.(?:[cm]?[jt]s|[jt]sx)$/.test(entry.name)) result.push(posix(path.relative(root, file)));
    }
  }
  walk(path.join(root, 'src'));
  walk(path.join(root, '_plugins'));
  result.push('docusaurus.config.ts');
  result.push(...fs.readdirSync(root).filter(name => /^sidebars.*\.ts$/.test(name)));
  return result.sort();
}

function assertRealScope(project) {
  const selected = selection(project);
  assert.equal(selected.configuration.compilerOptions.strict, true);
  assert.equal(selected.configuration.compilerOptions.strictNullChecks, true);
  assert.equal(selected.configuration.compilerOptions.noEmit, true);
  assert.deepEqual(selected.files, sourceFiles(project), 'The permanent config must select all intended src/config/sidebars/plugin inputs.');
  for (const sentinel of ['src/theme/MDXComponents.tsx', 'src/pages/index.js', '_plugins/toc-plugin.ts', 'docusaurus.config.ts', 'sidebars.ts']) {
    assert.ok(selected.files.includes(sentinel), `Expected source class not selected: ${sentinel}`);
  }
  assert.ok(selected.files.every(file => !file.startsWith('assets/')));
  assert.ok(selected.files.every(file => !file.startsWith('build/') && !file.startsWith('.docusaurus/') && !file.startsWith('node_modules/')));
  return selected;
}

test('permanent root config selects the intended nonempty scope and installed compiler matches the lock', t => {
  const lockedVersion = JSON.parse(fs.readFileSync(path.join(repository, 'package-lock.json'), 'utf8')).packages['node_modules/typescript'].version;
  const installedVersion = require('typescript/package.json').version;
  assert.equal(installedVersion, lockedVersion, 'TypeScript must come from the selected dependency lock.');
  const version = spawnSync(process.execPath, [tsc, '--version'], {encoding: 'utf8'});
  assert.equal(version.status, 0, version.stderr);
  assert.equal(version.stdout.trim(), `Version ${lockedVersion}`);
  assert.ok(fs.existsSync(path.join(repository, 'assets/js/prebid-api-doc.js')), 'Legacy exclusion needs a known-present source control.');
  const selected = assertRealScope(repository);
  t.diagnostic(`TypeScript ${lockedVersion}; ${selected.files.length} real root inputs; strict and strictNullChecks enabled; legacy assets excluded.`);
});

test('real root config passes, rejects undefined assigned to string with TS2322, then passes after restore', t => {
  const selectedRoot = assertRealScope(repository);
  const rootFiles = ['tsconfig.json', ...selectedRoot.files];
  const rootHashes = rootFiles.map(file => [file, sha256(fs.readFileSync(path.join(repository, file)))]);
  const fixture = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'prebid-strict-types-')));
  t.after(() => fs.rmSync(fixture, {recursive: true, force: true}));
  fs.copyFileSync(path.join(repository, 'tsconfig.json'), path.join(fixture, 'tsconfig.json'));
  for (const directory of ['src', '_plugins']) fs.cpSync(path.join(repository, directory), path.join(fixture, directory), {recursive: true});
  for (const file of selectedRoot.files.filter(file => !file.includes('/'))) fs.copyFileSync(path.join(repository, file), path.join(fixture, file));
  // Read the same installed locked dependencies; tsc is invoked with noEmit and
  // incremental disabled, so this dependency link is never an output target.
  fs.symlinkSync(path.join(repository, 'node_modules'), path.join(fixture, 'node_modules'), 'dir');
  fs.mkdirSync(path.join(fixture, 'assets/js'), {recursive: true});
  fs.writeFileSync(path.join(fixture, 'assets/js/legacy-exclusion-control.js'), 'this is intentionally invalid JavaScript {{{\n');
  const probe = 'src/__codex_typecheck_control__.ts';
  assert.ok(!selectedRoot.files.includes(probe), 'The fixture probe must not replace an existing source file.');
  const file = path.join(fixture, probe);
  const valid = "export const strictControl: string = 'present';\n";
  fs.writeFileSync(file, valid);
  const expectedSelection = [...selectedRoot.files, probe].sort();
  const before = selection(fixture);
  assert.deepEqual(before.files, expectedSelection);
  const clean = run(fixture, ['--noEmit', '--incremental', 'false']);
  assert.equal(clean.status, 0, clean.output);
  assert.equal(clean.output.trim(), '');

  fs.writeFileSync(file, 'export const strictControl: string = undefined;\n');
  const mutatedSelection = selection(fixture);
  assert.deepEqual(mutatedSelection.files, before.files, 'Mutation must not change or deselect compiler inputs.');
  const broken = run(fixture, ['--noEmit', '--incremental', 'false']);
  assert.notEqual(broken.status, 0, 'Strict null checking must reject the deliberate assignment.');
  const diagnosticLines = broken.output.replaceAll('\\', '/').trim().split(/\r?\n/);
  assert.equal(diagnosticLines.length, 1, broken.output);
  assert.match(diagnosticLines[0], /^src\/__codex_typecheck_control__\.ts\(1,\d+\): error TS2322: Type 'undefined' is not assignable to type 'string'\.$/);

  fs.writeFileSync(file, valid);
  assert.deepEqual(selection(fixture).files, before.files);
  const restored = run(fixture, ['--noEmit', '--incremental', 'false']);
  assert.equal(restored.status, 0, restored.output);
  assert.equal(restored.output.trim(), '');
  assert.deepEqual(rootFiles.map(name => [name, sha256(fs.readFileSync(path.join(repository, name)))]), rootHashes,
    'The test must not mutate shared source or configuration.');
  t.diagnostic(`${before.files.length} unchanged isolated inputs: clean pass, selected TS2322 failure, restored pass; excluded poisoned legacy JS remained outside scope.`);
});
