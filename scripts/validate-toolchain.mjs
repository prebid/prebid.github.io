#!/usr/bin/env node
// Dependency-free pre-install check. This command never installs or changes a runtime.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const versionPattern = '(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)';
const exactVersion = new RegExp(`^${versionPattern}$`);
const sourceRoot = fileURLToPath(new URL('../', import.meta.url));

function parseVersion(input, label, allowV = false) {
  if (typeof input !== 'string') throw new Error(`${label} must be an exact version string.`);
  const value = allowV ? input.trim().replace(/^v/, '') : input.trim();
  if (!exactVersion.test(value) || !value.split('.').every(part => Number.isSafeInteger(Number(part)))) {
    throw new Error(`${label} must be an exact stable X.Y.Z version; received ${JSON.stringify(input)}.`);
  }
  return value;
}

function compareVersions(left, right) {
  const a = left.split('.').map(Number), b = right.split('.').map(Number);
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  return 0;
}

export function readToolchainPins(nvmrc, packageJson) {
  const node = parseVersion(nvmrc, '.nvmrc', true);
  if (!packageJson || typeof packageJson !== 'object' || Array.isArray(packageJson)) {
    throw new Error('package.json must contain an object.');
  }
  const manager = packageJson.packageManager;
  if (typeof manager !== 'string' || !new RegExp(`^npm@${versionPattern}$`).test(manager)) {
    throw new Error('packageManager must pin npm as npm@X.Y.Z.');
  }
  const npm = parseVersion(manager.slice(4), 'packageManager npm pin');
  const engineNpm = parseVersion(packageJson.engines?.npm, 'engines.npm');
  if (engineNpm !== npm) throw new Error(`npm pins disagree: packageManager=${npm}, engines.npm=${engineNpm}.`);

  const engineNode = packageJson.engines?.node;
  if (typeof engineNode !== 'string') throw new Error('engines.node must declare the supported Node version range.');
  // Deliberately support the repository's range shape and exact pins, not a partial
  // implementation of arbitrary semver ranges. Other forms fail closed.
  let nodeAllowed;
  if (exactVersion.test(engineNode)) {
    nodeAllowed = node === parseVersion(engineNode, 'engines.node');
  } else {
    const match = new RegExp(`^>=(${versionPattern}) <(0|[1-9]\\d*)$`).exec(engineNode);
    if (!match || !Number.isSafeInteger(Number(match[2]))) {
      throw new Error('Unsupported engines.node syntax; use X.Y.Z or >=X.Y.Z <N.');
    }
    const minimum = parseVersion(match[1], 'engines.node minimum');
    const exclusiveMaximum = `${match[2]}.0.0`;
    nodeAllowed = compareVersions(node, minimum) >= 0 && compareVersions(node, exclusiveMaximum) < 0;
  }
  if (!nodeAllowed) throw new Error(`Node pins disagree: .nvmrc=${node} is outside engines.node=${engineNode}.`);
  return {node, npm, engines: {node: engineNode, npm: engineNpm}};
}

export function validateToolchain({nvmrc, packageJson, nodeVersion, npmVersion}) {
  const pins = readToolchainPins(nvmrc, packageJson);
  const node = parseVersion(nodeVersion, 'Actual Node version', true);
  const npm = parseVersion(npmVersion, 'Actual npm version');
  if (node !== pins.node) throw new Error(`Node version mismatch: expected ${pins.node} from .nvmrc, received ${node}.`);
  if (npm !== pins.npm) throw new Error(`npm version mismatch: expected ${pins.npm} from packageManager, received ${npm}.`);
  return {status: 'pass', node: {actual: node, pin: pins.node}, npm: {actual: npm, pin: pins.npm}, engines: pins.engines};
}

export function main() {
  const nvmrc = fs.readFileSync(path.join(sourceRoot, '.nvmrc'), 'utf8');
  const packageJson = JSON.parse(fs.readFileSync(path.join(sourceRoot, 'package.json'), 'utf8'));
  // Reject malformed/inconsistent declarations before querying the local npm binary.
  readToolchainPins(nvmrc, packageJson);
  const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['--version'], {
    encoding: 'utf8', timeout: 10000, maxBuffer: 16384,
    shell: process.platform === 'win32',
  });
  if (result.error || result.status !== 0) {
    throw new Error(`Could not read actual npm version: ${result.error?.message || result.stderr?.trim() || `exit ${result.status}`}`);
  }
  const report = validateToolchain({nvmrc, packageJson, nodeVersion: process.version, npmVersion: result.stdout});
  process.stdout.write(`${JSON.stringify(report)}\n`);
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); }
  catch (error) { process.stderr.write(`validate-toolchain: ${error.message}\n`); process.exitCode = 1; }
}
