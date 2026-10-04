import test from 'node:test';
import assert from 'node:assert/strict';
import {readToolchainPins, validateToolchain} from './validate-toolchain.mjs';

const fixture = () => ({
  nvmrc: '24.21.0\n',
  packageJson: {packageManager: 'npm@11.19.0', engines: {node: '>=24.21.0 <25', npm: '11.19.0'}},
  nodeVersion: 'v24.21.0', npmVersion: '11.19.0\n',
});

test('matching actual runtimes and consistent declarations pass', () => {
  assert.deepEqual(validateToolchain(fixture()), {
    status: 'pass', node: {actual: '24.21.0', pin: '24.21.0'},
    npm: {actual: '11.19.0', pin: '11.19.0'}, engines: {node: '>=24.21.0 <25', npm: '11.19.0'},
  });
});

test('actual Node must match its exact pin even when another version satisfies engines', () => {
  for (const nodeVersion of ['24.20.0', '24.22.0', '25.0.0']) {
    assert.throws(() => validateToolchain({...fixture(), nodeVersion}), /Node version mismatch/);
  }
  assert.equal(validateToolchain(fixture()).status, 'pass');
});

test('actual npm mismatch fails independently of a matching Node', () => {
  assert.throws(() => validateToolchain({...fixture(), npmVersion: '11.18.0'}), /npm version mismatch/);
  assert.equal(validateToolchain(fixture()).npm.actual, '11.19.0');
});

test('empty, floating, partial, prerelease, and malformed Node pins fail', () => {
  for (const nvmrc of ['', '\n', 'lts/*', '24', '24.21', '24.21.0-rc.1', '024.21.0', '24.21.0\n25.0.0']) {
    assert.throws(() => validateToolchain({...fixture(), nvmrc}), /\.nvmrc must be an exact/, JSON.stringify(nvmrc));
  }
  assert.equal(readToolchainPins('v24.21.0\n', fixture().packageJson).node, '24.21.0');
});

test('package manager must contain a stable exact npm pin', () => {
  for (const packageManager of ['', 'pnpm@11.19.0', 'npm@latest', 'npm@^11.19.0', 'npm@11.19', 'npm@11.19.0-rc.1', 'npm@ 11.19.0', 'npm@11.19.0 ']) {
    const input = fixture(); input.packageJson.packageManager = packageManager;
    assert.throws(() => validateToolchain(input), /packageManager/, packageManager);
  }
  const missing = fixture(); delete missing.packageJson.packageManager;
  assert.throws(() => validateToolchain(missing), /packageManager/);
});

test('npm declarations must agree and missing engine pins do not default to success', () => {
  const mismatch = fixture(); mismatch.packageJson.engines.npm = '11.18.0';
  assert.throws(() => validateToolchain(mismatch), /npm pins disagree/);
  for (const npm of ['', '^11.19.0', undefined]) {
    const input = fixture(); input.packageJson.engines.npm = npm;
    assert.throws(() => validateToolchain(input), /engines\.npm/);
  }
});

test('Node pin must fall inside the declared engine range, including both boundaries', () => {
  const lower = fixture(); lower.nvmrc = '24.20.9';
  assert.throws(() => validateToolchain(lower), /Node pins disagree/);
  const upper = fixture(); upper.nvmrc = '25.0.0';
  assert.throws(() => validateToolchain(upper), /Node pins disagree/);
  const exact = fixture(); exact.packageJson.engines.node = '24.21.0';
  assert.equal(validateToolchain(exact).status, 'pass');
  exact.packageJson.engines.node = '24.20.0';
  assert.throws(() => validateToolchain(exact), /Node pins disagree/);
});

test('unsupported engine forms and malformed runtime output fail closed', () => {
  for (const engine of ['', '>=24', '^24.21.0', '>=24.21.0 <25 || >=26', undefined]) {
    const input = fixture(); input.packageJson.engines.node = engine;
    assert.throws(() => validateToolchain(input), /engines\.node/);
  }
  for (const nodeVersion of ['', 'v24.21', 'v24.21.0\nextra']) {
    assert.throws(() => validateToolchain({...fixture(), nodeVersion}), /Actual Node version/);
  }
  for (const npmVersion of ['', '11.19', '11.19.0\nextra']) {
    assert.throws(() => validateToolchain({...fixture(), npmVersion}), /Actual npm version/);
  }
});
