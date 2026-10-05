import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {createDownloadConsumer, runDownloadConsumerCases, loadPinnedDownloadSources} from './migration-download-consumer.mjs';

const require = createRequire(import.meta.url);
const repoDir = process.env.MIGRATION_DOWNLOAD_TEST_REPO ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const report = await runDownloadConsumerCases({repoDir});
const record = id => {
  const rows = report.cases.filter(row => row.id === id);
  assert.equal(rows.length, 1, `Expected one selected case: ${id}`);
  return rows[0];
};
const observed = id => record(id).observation;
const post = id => {
  const requests = observed(id).requests.filter(request => request.method === 'POST');
  assert.equal(requests.length, 1, `Expected one POST for ${id}`);
  return requests[0];
};
const configuration = id => {
  const downloads = observed(id).downloads.filter(item => item.filename === 'prebid-config.json');
  assert.equal(downloads.length, 1);
  return JSON.parse(downloads[0].contents);
};
function fixture(t, options = {}) {
  const harness = createDownloadConsumer({...options, repoDir});
  t.after(() => harness.close());
  return harness;
}

test('twenty offline observations execute exact Git-bound source and original jQuery without clearing policy', () => {
  assert.equal(report.selected_cases, 20);
  assert.equal(new Set(report.cases.map(row => row.id)).size, 20);
  assert.equal(report.provenance.source_commit, 'b16d95ac1ee95238c070bc9f137d52718287d1cc');
  assert.equal(report.provenance.jquery_version, '1.12.4');
  assert.equal(report.provenance.executed_source_sha256, '1932c15d96c47f6fd81de574e2039edbc3ec054b90a9d48fddbec2433288bf10');
  assert.equal(report.provenance.artifacts['assets/js/jquery.min.js'].sha256, '668b046d12db350ccba6728890476b3efee53b2f42dbb84743e5e9f1ae0cc404');
  assert.equal(report.provenance.git_object_binding, 'VERIFIED');
  assert.equal(report.policy_approved, false);
  assert.equal(report.full_m2_acceptance, false);
  for (const row of report.cases) {
    assert.match(row.dom_fixture_sha256, /^[a-f0-9]{64}$/);
    assert.deepEqual(row.observation.errors, [], row.id);
    assert.deepEqual(row.observation.blocked_network, [], row.id);
    assert.equal(row.observation.pending_requests, 0, row.id);
    assert.equal(row.observation.responses.length, row.observation.requests.length, row.id);
  }
});

test('normal selection dispatches original handlers, records request fields, and exports two exact artifacts', () => {
  const actual = observed('normal-selection');
  assert.deepEqual(actual.requests, [
    {method: 'GET', url: 'https://js-download.prebid.org/versions'},
    {method: 'POST', url: 'https://js-download.prebid.org/download', dataType: 'text', data: {modules: ['appnexusBidAdapter'], version: '10.0.0'}},
  ]);
  assert.deepEqual(actual.downloads, [
    {filename: 'prebid10.0.0.js', type: 'text/javascript', contents: '/* offline synthetic JavaScript response */'},
    {filename: 'prebid-config.json', type: 'application/json', contents: '{\n  "version": "10.0.0",\n  "modules": [\n    "appnexusBidAdapter"\n  ]\n}'},
  ]);
  assert.deepEqual(actual.button, {text: 'Download Prebid.js', disabled_class: false});
  assert.equal(actual.pending_timers, 0);
  assert.deepEqual(actual.timers.map(timer => timer.delay), [5000]);
  const url = new URL(actual.url);
  assert.equal(url.searchParams.get('modules'), 'appnexusBidAdapter');
  assert.equal(url.searchParams.get('version'), '10.0.0');
  assert.equal(actual.options[0].label, '10.0.0 - latest');
});

test('numeric minima distinguish 8.9 from 8.10 and record removal notices without sending removedModules', () => {
  assert.deepEqual(post('minimum-8.9.0').data, {modules: [], version: '8.9.0'});
  assert.deepEqual(post('minimum-8.10.0').data, {modules: ['gppControl_usstates'], version: '8.10.0'});
  assert.deepEqual(observed('minimum-8.9.0').alerts, ["The following modules were removed from your download because they aren't present in Prebid.js version 8.9.0: [\"gppControl_usstates\",\"storageControl\"]"]);
  assert.deepEqual(observed('minimum-8.10.0').alerts, ["The following modules were removed from your download because they aren't present in Prebid.js version 8.10.0: [\"storageControl\"]"]);
  assert.deepEqual(configuration('minimum-8.9.0'), {version: '8.9.0', modules: []});
  assert.deepEqual(configuration('minimum-8.10.0'), {version: '8.10.0', modules: ['gppControl_usstates']});
});

test('patch and prerelease limits are observed legacy approximations, not approved compatibility rules', () => {
  assert.deepEqual(post('patch-minimum-observation').data, {modules: ['syntheticPatchMinimum'], version: '8.10.0'});
  assert.deepEqual(post('prerelease-minimum-observation').data, {modules: ['gppControl_usstates'], version: '8.10.0-beta.1'});
  for (const id of ['patch-minimum-observation', 'prerelease-minimum-observation']) {
    assert.equal(record(id).policy_status, 'DISPUTED'); assert.deepEqual(observed(id).alerts, []);
  }
});

test('v8 rename observations use three legacy names and leave v9 names unchanged', () => {
  assert.deepEqual(post('renames-8.10.0').data.modules, ['gdprEnforcement', 'consentManagement', 'fledgeForGpt', 'appnexusBidAdapter']);
  assert.deepEqual(post('renames-9.0.0').data.modules, ['tcfControl', 'consentManagementTcf', 'paapiForGpt', 'appnexusBidAdapter']);
  assert.deepEqual(configuration('renames-8.10.0'), {version: '8.10.0', modules: ['gdprEnforcement', 'consentManagement', 'fledgeForGpt', 'appnexusBidAdapter']});
});

test('combined minimum and rename retains the contradictory module and removal alert as a disputed observation', () => {
  assert.equal(record('combined-minimum-and-rename').policy_status, 'DISPUTED');
  assert.deepEqual(post('combined-minimum-and-rename').data, {modules: ['gdprEnforcement'], version: '8.0.0'});
  assert.deepEqual(observed('combined-minimum-and-rename').alerts,
    ["The following modules were removed from your download because they aren't present in Prebid.js version 8.0.0: [\"tcfControl\"]"]);
});

test('alias and renamed exports do not silently claim checkbox-identity round-trip fidelity', () => {
  assert.deepEqual(configuration('alias-export-import'), {version: '10.0.0', modules: ['adkernelBidAdapter']});
  assert.deepEqual(observed('alias-export-import').checked, ['adkernelBidAdapter']);
  assert.equal(record('alias-export-import').policy_status, 'DISPUTED');
  assert.deepEqual(configuration('v8-export-import'), {version: '8.10.0', modules: ['gdprEnforcement']});
  assert.deepEqual(observed('v8-export-import').checked, []);
  assert.equal(new URL(observed('v8-export-import').url).searchParams.get('modules'), 'gdprEnforcement');
  assert.equal(record('v8-export-import').policy_status, 'DISPUTED');
});

test('malformed, empty, unknown, null and structurally empty configurations remain distinct', () => {
  assert.deepEqual(observed('malformed-config').alerts, ['Invalid configuration file']);
  assert.deepEqual(observed('malformed-config').checked, ['appnexusBidAdapter']);
  assert.equal(observed('empty-modules-config').version, '9.0.0');
  assert.deepEqual(observed('empty-modules-config').checked, []);
  assert.equal(new URL(observed('empty-modules-config').url).searchParams.has('modules'), false);
  assert.equal(observed('unknown-config-values').version, '10.0.0');
  assert.deepEqual(observed('unknown-config-values').checked, []);
  assert.equal(new URL(observed('unknown-config-values').url).searchParams.get('modules'), 'missingModule');
  for (const id of ['null-config', 'empty-object-config']) {
    assert.deepEqual(observed(id).checked, ['appnexusBidAdapter']); assert.deepEqual(observed(id).alerts, []);
  }
});

test('response filename is observed, while transport failure leaves disabled appearance and no downloads', () => {
  assert.equal(observed('response-filename').downloads[0].filename, 'custom-prebid.js');
  assert.equal(observed('response-filename').downloads[1].filename, 'prebid-config.json');
  const failure = observed('download-failure');
  assert.deepEqual(failure.alerts, ['Ran into an issue.']);
  assert.deepEqual(failure.downloads, []);
  assert.deepEqual(failure.button, {text: 'Sending Request...', disabled_class: true});
  assert.equal(failure.pending_timers, 0);
  assert.equal(record('download-failure').policy_status, 'DISPUTED');
});

test('empty, malformed and failed version responses all expose the original error option', () => {
  for (const id of ['versions-empty', 'versions-malformed', 'versions-failure']) {
    assert.deepEqual(observed(id).options, [{value: 'error', label: 'Error generating version list. Please try again later'}]);
    assert.equal(observed(id).version, 'error');
    assert.deepEqual(observed(id).downloads, []);
    assert.equal(observed(id).requests.length, 1);
  }
});

test('query preselection, user checkbox changes, valid config import, and absent file use original events', async t => {
  const h = fixture(t, {url: 'https://docs.prebid.org/download.html?version=8.10.0&modules=appnexusBidAdapter',
    checkboxes: [{id: 'appnexusBidAdapter', moduleCode: 'appnexusBidAdapter'}, {id: 'lemmaDigitalBidAdapter', moduleCode: 'lemmaDigitalBidAdapter', checked: true}]});
  h.respondVersions({body: '{"versions":["10.0.0","8.10.0"]}'});
  assert.equal((await h.snapshot()).version, '8.10.0');
  assert.deepEqual((await h.snapshot()).checked, ['appnexusBidAdapter']);
  h.toggle('appnexusBidAdapter', false);
  assert.equal(new URL((await h.snapshot()).url).searchParams.has('modules'), false);
  h.importConfig('{"version":"10.0.0","modules":["lemmaDigitalBidAdapter"]}');
  assert.deepEqual((await h.snapshot()).checked, ['lemmaDigitalBidAdapter']);
  assert.equal((await h.snapshot()).version, '10.0.0');
  h.clickDownload(); h.respondDownload({body: '// literal response'});
  assert.deepEqual((await h.snapshot()).requests[1].data, {modules: ['lemmaDigitalBidAdapter'], version: '10.0.0'});
  const before = await h.snapshot(); h.importConfig();
  assert.deepEqual(await h.snapshot(), before);
});

test('original import does not synchronize the checkbox-change closure; record the stale URL separately', async t => {
  const h = fixture(t, {checkboxes: [{id: 'appnexusBidAdapter', moduleCode: 'appnexusBidAdapter', checked: true},
    {id: 'lemmaDigitalBidAdapter', moduleCode: 'lemmaDigitalBidAdapter'}]});
  h.respondVersions({body: '{"versions":["10.0.0"]}'});
  h.importConfig('{"modules":["lemmaDigitalBidAdapter"]}');
  h.toggle('lemmaDigitalBidAdapter', false);
  const actual = await h.snapshot();
  assert.deepEqual(actual.checked, []);
  assert.equal(new URL(actual.url).searchParams.get('modules'), 'appnexusBidAdapter');
});

test('source bindings include real minimum and alias fixtures; ambiguous fixture IDs reject before runtime', () => {
  const sources = loadPinnedDownloadSources({repoDir});
  assert.match(sources.files['dev-docs/modules/gppControl_usstates.md'], /min_js_version: 8\.10\.0/);
  assert.match(sources.files['dev-docs/modules/storageControl.md'], /min_js_version: 10\.0\.0/);
  assert.match(sources.files['dev-docs/bidders/rtbdemand_com.md'], /aliasCode: adkernel/);
  assert.match(sources.files['dev-docs/bidders/lemmadigital.md'], /filename: lemmaDigitalBidAdapter/);
  assert.throws(() => createDownloadConsumer({repoDir, checkboxes: [{id: 'x', moduleCode: 'x'}, {id: 'x', moduleCode: 'y'}]}), /unique/);
});

test('independent request and export oracles kill test-copy mutations of actual legacy source', () => {
  const ownPath = fileURLToPath(import.meta.url);
  const harnessPath = path.join(path.dirname(ownPath), 'migration-download-consumer.mjs');
  const harness = fs.readFileSync(harnessPath, 'utf8');
  const tests = fs.readFileSync(ownPath, 'utf8');
  const mutants = [
    ['minimum-numeric-comparison', 'Number(pbjs_version_array[1]) < Number(module_version_array[1])', 'pbjs_version_array[1] < module_version_array[1]', 'numeric minima distinguish'],
    ['v8-rename', "tcfControl: 'gdprEnforcement'", "tcfControl: 'incorrectRename'", 'v8 rename observations'],
    ['configuration-export', 'modules: form_data.modules', 'modules: []', 'normal selection dispatches'],
  ];
  for (const [id, before, after, selector] of mutants) {
    const root = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'prebid-download-mutant-'));
    try {
      const assignment = "const executionSource = source.files['assets/js/download.js'];";
      assert.equal(harness.split(assignment).length, 2);
      const literal = loadPinnedDownloadSources({repoDir}).files['assets/js/download.js'];
      assert.equal(literal.split(before).length, 2, `Mutation selector must select exactly one source expression: ${id}`);
      const mutated = harness.replace("from 'jsdom'", `from ${JSON.stringify(pathToFileURL(require.resolve('jsdom')).href)}`)
        .replace(assignment, `const executionSource = source.files['assets/js/download.js'].replace(${JSON.stringify(before)}, ${JSON.stringify(after)});`);
      fs.writeFileSync(path.join(root, 'migration-download-consumer.mjs'), mutated);
      fs.writeFileSync(path.join(root, 'migration-download-consumer.test.mjs'), tests);
      const childEnv = {...process.env, MIGRATION_DOWNLOAD_TEST_REPO: repoDir};
      delete childEnv.NODE_TEST_CONTEXT; // This is an independent test runner, not a recursive in-process run.
      const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', `--test-name-pattern=${selector}`, path.join(root, 'migration-download-consumer.test.mjs')],
        {encoding: 'utf8', env: childEnv, maxBuffer: 1024 * 1024});
      assert.equal(result.status, 1, `${id} must fail its unchanged oracle: ${result.stdout}\n${result.stderr}`);
      assert.match(result.stdout, /# tests 1\n/);
      assert.match(result.stdout, /# fail 1\n/);
      assert.match(result.stdout, /# skipped 0\n/);
      assert.match(result.stdout, /ERR_ASSERTION/);
    } finally { fs.rmSync(root, {recursive: true, force: true}); }
  }
});
