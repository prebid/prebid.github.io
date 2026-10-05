import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const yaml = require('js-yaml');
const root = new URL('../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, root), 'utf8');
const workflow = name => yaml.load(read(`.github/workflows/${name}.yml`));

test('PR validation uses an unprivileged full-history candidate with retained evidence and no shared cache', () => {
  const config = workflow('docusaurus');
  assert.ok(config.on.pull_request);
  assert.equal(config.on.pull_request_target, undefined);
  assert.deepEqual(config.permissions, {contents: 'read'});
  assert.equal(config.defaults.run.shell, 'bash');
  assert.ok(config.on.pull_request.branches.includes('docusaurus'));
  assert.ok(config.on.pull_request.branches.includes('codex/docusaurus-*'));
  for (const event of ['opened', 'synchronize', 'reopened', 'edited']) {
    assert.ok(config.on.pull_request.types.includes(event), `Missing PR activity: ${event}`);
  }
  // Skipping the validation job on a metadata edit would publish a successful
  // skipped check for that same head, potentially replacing a failed result.
  assert.equal(config.jobs.validate.if, undefined);
  assert.ok(!read('.github/workflows/docusaurus.yml').includes('secrets.'));
  const steps = config.jobs.validate.steps;
  const checkout = steps.find(step => step.uses?.startsWith('actions/checkout@'));
  assert.equal(checkout.with['fetch-depth'], 0);
  assert.equal(checkout.with['persist-credentials'], false);
  assert.equal(checkout.with.ref, '${{ github.event.pull_request.head.sha || github.sha }}');
  const setup = steps.find(step => step.uses?.startsWith('actions/setup-node@'));
  assert.equal(setup.with['package-manager-cache'], false);
  assert.equal(setup.with.cache, undefined);
  assert.equal(setup.with['node-version-file'], '.nvmrc');
  assert.ok(steps.some(step => step.run === 'npm run validate:site'));
  assert.ok(steps.some(step => step.run?.includes('npm run test:migration')));
  const upload = steps.find(step => step.uses?.startsWith('actions/upload-artifact@'));
  assert.equal(upload.if, 'always()');
  assert.equal(upload.with['include-hidden-files'], true);
  assert.equal(upload.with['if-no-files-found'], 'error');
  for (const step of steps.filter(step => step.uses)) assert.match(step.uses, /^(?:actions\/(checkout|setup-node|upload-artifact)|ruby\/setup-ruby)@[a-f0-9]{40}$/);
  const ruby = steps.find(step => step.uses?.startsWith('ruby/setup-ruby@'));
  assert.equal(ruby.with['ruby-version'], '3.3.4');
  assert.equal(ruby.with['bundler-cache'], false);
  const legacy = steps.find(step => step.name === 'Install pinned legacy template probes');
  assert.ok(legacy.run.includes('node scripts/migration-legacy-consumers.mjs'));
  assert.ok(legacy.run.includes('liquid --version 4.0.4'));
  assert.ok(legacy.run.includes('safe_yaml --version 1.0.5'));
});

test('a base retarget remains subscribed even when the candidate SHA does not change', () => {
  const config = workflow('docusaurus');
  const original = {action: 'opened', pull_request: {head: {sha: 'a'.repeat(40)}, base: {ref: 'codex/docusaurus-3.10.2', sha: 'b'.repeat(40)}}};
  const retargeted = {action: 'edited', changes: {base: {
    ref: {from: original.pull_request.base.ref}, sha: {from: original.pull_request.base.sha}}},
    pull_request: {head: original.pull_request.head, base: {ref: 'docusaurus', sha: 'c'.repeat(40)}}};
  const subscribed = event => config.on.pull_request.types.includes(event.action)
    && config.on.pull_request.branches.some(pattern => new RegExp(`^${pattern.replace('*', '.*')}$`).test(event.pull_request.base.ref));
  assert.ok(subscribed(original));
  assert.equal(retargeted.pull_request.head.sha, original.pull_request.head.sha);
  assert.notEqual(retargeted.pull_request.base.sha, original.pull_request.base.sha);
  assert.ok(subscribed(retargeted));
  const removed = structuredClone(config);
  removed.on.pull_request.types = removed.on.pull_request.types.filter(type => type !== 'edited');
  assert.ok(!removed.on.pull_request.types.includes(retargeted.action));
  assert.equal(config.jobs.validate.env.MIGRATION_BASE_SHA,
    '${{ github.event.pull_request.base.sha || inputs.baseline_sha || github.event.before }}');
});

test('actual CI validation pipelines propagate both typecheck and test failures through tee', t => {
  const config = workflow('docusaurus');
  assert.equal(config.defaults.run.shell, 'bash', 'Explicit GitHub bash enables -e -o pipefail; the implicit shell does not.');
  const command = config.jobs.validate.steps.find(step => step.name === 'Check strict types and validator controls').run;
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'prebid-ci-pipeline-'));
  t.after(() => fs.rmSync(directory, {recursive: true, force: true}));
  fs.mkdirSync(path.join(directory, '.validation-results/setup'), {recursive: true});
  fs.mkdirSync(path.join(directory, 'bin'));
  const shim = path.join(directory, 'bin/npm');
  fs.writeFileSync(shim, '#!/bin/sh\necho "$*" >> calls\necho "fixture $*"\nif [ "$2" = "$FAIL_STEP" ]; then exit 19; fi\n', {mode: 0o755});
  for (const failure of ['none', 'typecheck', 'test:migration']) {
    fs.writeFileSync(path.join(directory, 'calls'), '');
    const result = spawnSync('bash', ['--noprofile', '--norc', '-e', '-o', 'pipefail', '-c', command], {
      cwd: directory, encoding: 'utf8', env: {...process.env, PATH: `${directory}/bin:${process.env.PATH}`, FAIL_STEP: failure},
    });
    assert.ifError(result.error);
    assert.equal(result.status, failure === 'none' ? 0 : 19, result.stdout + result.stderr);
    const calls = fs.readFileSync(path.join(directory, 'calls'), 'utf8').trim().split('\n');
    assert.deepEqual(calls, failure === 'typecheck' ? ['run typecheck'] : ['run typecheck', 'run test:migration']);
  }
});

test('local validation stops on dependency-tree failure and resumes only after restoration', t => {
  const manifest = JSON.parse(read('package.json'));
  assert.equal(manifest.scripts['verify:dependencies'], 'npm ls --all');
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'prebid-dependency-pipeline-'));
  t.after(() => fs.rmSync(directory, {recursive: true, force: true}));
  fs.mkdirSync(path.join(directory, 'bin'));
  fs.writeFileSync(path.join(directory, 'bin/npm'), '#!/bin/sh\necho "$*" >> calls\nif [ "$2" = "verify:dependencies" ] && [ "$MIGRATION_BAD_TREE" = "1" ]; then exit 19; fi\n', {mode: 0o755});
  for (const bad of ['0', '1', '0']) {
    fs.writeFileSync(path.join(directory, 'calls'), '');
    const result = spawnSync('sh', ['-c', manifest.scripts.validate], {cwd: directory, encoding: 'utf8',
      env: {...process.env, PATH: `${directory}/bin:${process.env.PATH}`, MIGRATION_BAD_TREE: bad}});
    assert.ifError(result.error); assert.equal(result.status, bad === '1' ? 19 : 0);
    assert.deepEqual(fs.readFileSync(path.join(directory, 'calls'), 'utf8').trim().split('\n'),
      bad === '1' ? ['run verify:toolchain', 'run verify:dependencies']
        : ['run verify:toolchain', 'run verify:dependencies', 'run typecheck', 'run test:migration', 'run validate:site']);
  }
});

test('notification executes only base source and installs isolated locked dependencies without secrets', () => {
  const config = workflow('code-path-changes');
  assert.ok(config.on.pull_request_target);
  assert.deepEqual(config.permissions, {contents: 'read', 'pull-requests': 'read'});
  assert.equal(config.env, undefined);
  const job = config.jobs.notify;
  assert.equal(job.env, undefined);
  const steps = job.steps;
  assert.equal(steps[0].with.ref, '${{ github.event.pull_request.base.sha }}');
  assert.equal(steps[0].with['persist-credentials'], false);
  const install = steps.find(step => step.run?.includes('npm ci'));
  assert.equal(install.run, 'npm ci --prefix .github/workflows/scripts --ignore-scripts --no-audit --no-fund');
  assert.equal(install.env, undefined);
  const secretSteps = steps.filter(step => JSON.stringify(step).includes('secrets.'));
  assert.equal(secretSteps.length, 1);
  assert.equal(secretSteps[0].run, 'node .github/workflows/scripts/send-notification-on-change.js');
  assert.equal(steps.find(step => step.uses?.startsWith('actions/setup-node@')).with['package-manager-cache'], false);
  const manifest = JSON.parse(read('.github/workflows/scripts/package.json'));
  const lock = JSON.parse(read('.github/workflows/scripts/package-lock.json'));
  assert.equal(lock.lockfileVersion, 3);
  assert.deepEqual(lock.packages[''].dependencies, manifest.dependencies);
  for (const version of Object.values(manifest.dependencies)) assert.match(version, /^\d+\.\d+\.\d+$/);
});
