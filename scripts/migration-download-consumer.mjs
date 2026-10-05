// Offline observation of the unchanged, pinned browser consumer. No network or
// real downloads are enabled. The DOM fixture does not stand in for Jekyll output.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {JSDOM, VirtualConsole} from 'jsdom';

export const DOWNLOAD_SOURCE_COMMIT = 'b16d95ac1ee95238c070bc9f137d52718287d1cc';
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sha256 = value => createHash('sha256').update(value).digest('hex');
const clone = value => JSON.parse(JSON.stringify(value));
const fixed = {
  'assets/js/download.js': '1932c15d96c47f6fd81de574e2039edbc3ec054b90a9d48fddbec2433288bf10',
  'assets/js/jquery.min.js': '668b046d12db350ccba6728890476b3efee53b2f42dbb84743e5e9f1ae0cc404',
  'download.md': '33882ecfe281dcb7b85462d3263035803237db69f262d6ddfaf1f56a7b3122fc',
};
const sourceArtifacts = ['download_client', 'download_page', 'gpp_states', 'storage_control', 'rtbdemand', 'lemma'];

export function loadPinnedDownloadSources({repoDir = repo} = {}) {
  const reference = JSON.parse(fs.readFileSync(path.join(repoDir, 'migration/reference-cases.json'), 'utf8'));
  if (reference.reference.commit !== DOWNLOAD_SOURCE_COMMIT) throw new Error('Download reference pin changed; review the consumer fixture');
  const hashes = {...fixed};
  for (const key of sourceArtifacts) {
    const artifact = reference.source_artifacts[key];
    if (!artifact || !/^[a-f0-9]{64}$/.test(artifact.sha256)) throw new Error(`Missing source binding: ${key}`);
    if (hashes[artifact.path] && hashes[artifact.path] !== artifact.sha256) throw new Error(`Conflicting source binding: ${key}`);
    hashes[artifact.path] = artifact.sha256;
  }
  const files = {};
  const artifacts = {};
  for (const [name, expected] of Object.entries(hashes)) {
    const bytes = execFileSync('git', ['show', `${DOWNLOAD_SOURCE_COMMIT}:${name}`], {cwd: repoDir});
    if (sha256(bytes) !== expected) throw new Error(`Pinned download source hash mismatch: ${name}`);
    files[name] = bytes.toString('utf8');
    artifacts[name] = {sha256: expected, bytes: bytes.length};
  }
  return {files, provenance: {source_commit: DOWNLOAD_SOURCE_COMMIT, git_object_binding: 'VERIFIED', artifacts}};
}

/** Run original scripts against native jsdom elements and original jQuery 1.12.4. */
export function createDownloadConsumer({checkboxes = [], url = 'https://docs.prebid.org/download.html', repoDir = repo} = {}) {
  if (!Array.isArray(checkboxes) || new Set(checkboxes.map(box => box.id)).size !== checkboxes.length
    || checkboxes.some(box => typeof box.id !== 'string' || !box.id || typeof box.moduleCode !== 'string' || !box.moduleCode)) {
    throw new Error('Checkbox fixtures require unique nonempty IDs and module codes');
  }
  const source = loadPinnedDownloadSources({repoDir});
  const effects = {requests: [], responses: [], downloads: [], alerts: [], history: [], logs: [], errors: [], blocked_network: [], timers: []};
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => effects.errors.push(String(error.message)));
  virtualConsole.on('log', (...values) => effects.logs.push(values.map(value => String(value)).join(' ')));
  // outside-only does not load script tags or subresources. Only the two verified
  // scripts below are evaluated; callbacks operate on this same VM/DOM context.
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {url, runScripts: 'outside-only', virtualConsole});
  const {window} = dom; const {document} = window;
  const template = document.createElement('template');
  template.innerHTML = source.files['download.md'];
  for (const id of ['version_selector', 'configFileInput', 'download-button']) {
    const matches = template.content.querySelectorAll(`#${id}`);
    if (matches.length !== 1) throw new Error(`Pinned download DOM control changed: ${id}`);
    document.body.appendChild(matches[0].cloneNode(true));
  }
  const adapters = document.createElement('div'); adapters.className = 'adapters';
  for (const box of checkboxes) {
    const column = document.createElement('div'); column.className = 'col-md-4'; column.style.display = 'none';
    const input = document.createElement('input');
    input.type = 'checkbox'; input.id = box.id; input.className = 'module-check-box';
    input.setAttribute('moduleCode', box.moduleCode);
    if (box.minVersion !== undefined) input.setAttribute('minVersion', box.minVersion);
    input.checked = box.checked === true;
    column.appendChild(input); adapters.appendChild(column);
  }
  document.body.appendChild(adapters);
  const domHash = sha256(document.body.innerHTML);
  const forbiddenNetwork = name => function() { effects.blocked_network.push(name); throw new Error(`Offline harness blocked ${name}`); };
  window.fetch = forbiddenNetwork('fetch');
  // jQuery constructs one XHR for capability detection. Construction cannot send;
  // both transport entry points reject if anything bypasses the AJAX recorder.
  window.XMLHttpRequest = class {
    open() { forbiddenNetwork('XMLHttpRequest.open')(); }
    send() { forbiddenNetwork('XMLHttpRequest.send')(); }
  };
  window.WebSocket = forbiddenNetwork('WebSocket');
  window.EventSource = forbiddenNetwork('EventSource');
  window.navigator.sendBeacon = forbiddenNetwork('sendBeacon');
  window.alert = value => effects.alerts.push(String(value));
  window.Blob = Blob;
  const objectUrls = new Map(); let objectId = 0;
  window.URL.createObjectURL = blob => { const name = `blob:offline-download-${++objectId}`; objectUrls.set(name, blob); return name; };
  window.URL.revokeObjectURL = name => objectUrls.delete(name);
  window.HTMLAnchorElement.prototype.click = function() {
    const blob = objectUrls.get(this.href);
    if (!blob) throw new Error('Unexpected unrecorded download URL');
    effects.downloads.push({filename: this.download, blob});
  };
  window.FileReader = class {
    readAsText(file) {
      if (typeof file?.contents !== 'string') throw new Error('Only explicit in-memory file contents are accepted');
      this.onload?.({target: {result: file.contents}});
    }
  };
  let timerId = 0; const pendingTimers = new Map();
  window.setTimeout = (callback, delay, ...args) => {
    if (typeof callback !== 'function') throw new Error('String timer execution is outside the fixture');
    const id = ++timerId; pendingTimers.set(id, () => callback(...args));
    effects.timers.push({id, delay: Number(delay ?? 0)}); return id;
  };
  window.clearTimeout = id => pendingTimers.delete(id);
  const replaceState = window.history.replaceState.bind(window.history);
  window.history.replaceState = (data, unused, next) => { effects.history.push(String(next)); replaceState(data, unused, next); };
  window.addEventListener('error', event => { effects.errors.push(String(event.error?.message ?? event.message)); event.preventDefault(); });
  const context = dom.getInternalVMContext();
  new vm.Script(source.files['assets/js/jquery.min.js'], {filename: 'pinned/jquery-1.12.4.js'}).runInContext(context, {timeout: 1000});
  const pendingRequests = [];
  window.$.ajax = options => {
    const request = {method: options.type, url: options.url};
    if (options.dataType !== undefined) request.dataType = options.dataType;
    if (options.data !== undefined) request.data = clone(options.data);
    effects.requests.push(request);
    const entry = {request, done: false}; pendingRequests.push(entry);
    const chain = {success(callback) { entry.success = callback; return chain; }, fail(callback) { entry.fail = callback; return chain; }};
    return chain;
  };
  const executionSource = source.files['assets/js/download.js'];
  new vm.Script(executionSource, {filename: 'pinned/download.js'}).runInContext(context, {timeout: 1000});
  document.dispatchEvent(new window.Event('DOMContentLoaded'));
  window.dispatchEvent(new window.Event('load'));
  const respond = (method, {body = '', failure = false, disposition = null} = {}) => {
    const request = pendingRequests.find(entry => entry.request.method === method && !entry.done);
    if (!request) throw new Error(`No pending ${method} request`);
    request.done = true;
    effects.responses.push({request_index: pendingRequests.indexOf(request), method, failure, body, content_disposition: disposition});
    if (failure) request.fail({status: 503, statusText: 'offline injected failure'});
    else request.success(body, 'success', {getResponseHeader: name => name === 'Content-Disposition' ? disposition : null});
  };
  const change = id => {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Unknown fixture element: ${id}`);
    element.dispatchEvent(new window.Event('change', {bubbles: true}));
  };
  return {
    provenance: {...source.provenance, jquery_version: window.$.fn.jquery, executed_source_sha256: sha256(executionSource),
      dom_fixture_sha256: domHash, dom_authority: 'Pinned page controls with explicitly synthetic checkbox fixtures; no Jekyll rendering'},
    respondVersions(response) { respond('GET', response); },
    respondDownload(response) { respond('POST', response); },
    selectVersion(version) {
      const select = document.getElementById('version_selector');
      if (![...select.options].some(option => option.value === version)) throw new Error(`Unknown fixture version: ${version}`);
      select.value = version; change(select.id);
    },
    toggle(id, checked) { const input = document.getElementById(id); if (!input || input.type !== 'checkbox') throw new Error(`Unknown checkbox: ${id}`); input.checked = checked; change(id); },
    importConfig(text) {
      Object.defineProperty(document.getElementById('configFileInput'), 'files', {configurable: true, value: text === undefined ? [] : [{contents: text}]});
      change('configFileInput');
    },
    clickDownload() { document.getElementById('download-button').dispatchEvent(new window.MouseEvent('click', {bubbles: true, cancelable: true})); },
    flushTimers() { for (const [id, callback] of [...pendingTimers]) {pendingTimers.delete(id); callback();} },
    async snapshot() {
      const select = document.getElementById('version_selector'); const button = document.getElementById('download-button');
      return {...clone({...effects, downloads: []}),
        downloads: await Promise.all(effects.downloads.map(async item => ({filename: item.filename, type: item.blob.type, contents: await item.blob.text()}))),
        url: window.location.href, version: select.value,
        options: [...select.options].map(option => ({value: option.value, label: option.textContent.trim()})),
        checked: [...document.querySelectorAll('.module-check-box:checked')].map(input => input.id),
        button: {text: button.textContent.trim(), disabled_class: button.classList.contains('disabled')},
        pending_requests: pendingRequests.filter(item => !item.done).length, pending_timers: pendingTimers.size};
    },
    close() { dom.window.close(); },
  };
}

const defaultVersions = ['10.0.0', '9.0.0', '8.10.0', '8.9.0', '8.0.0', '8.10.0-beta.1'];
const box = (id, minVersion, moduleCode = id) => ({id, moduleCode, ...(minVersion ? {minVersion} : {}), checked: true});

/** Observation ledger. Test expectations are separate literal assertions. */
export async function runDownloadConsumerCases({repoDir = repo} = {}) {
  const cases = [];
  let provenance;
  async function observe(id, config, action, policy = 'SOURCE_BACKED') {
    const harness = createDownloadConsumer({...config, repoDir});
    try {
      const {dom_fixture_sha256: _fixtureHash, ...sourceProvenance} = harness.provenance;
      provenance ??= sourceProvenance;
      harness.respondVersions({body: JSON.stringify({versions: defaultVersions})});
      await action(harness);
      cases.push({id, policy_status: policy, dom_fixture_sha256: harness.provenance.dom_fixture_sha256, observation: await harness.snapshot()});
    } finally { harness.close(); }
  }
  const download = (version, response = {}) => harness => {
    harness.selectVersion(version); harness.clickDownload();
    harness.respondDownload({body: '/* offline synthetic JavaScript response */', ...response});
  };
  await observe('normal-selection', {checkboxes: [{id: 'appnexusBidAdapter', moduleCode: 'appnexusBidAdapter'}]}, async harness => {
    harness.toggle('appnexusBidAdapter', true); download('10.0.0')(harness); harness.flushTimers();
  });
  for (const version of ['8.9.0', '8.10.0']) {
    await observe(`minimum-${version}`, {checkboxes: [box('gppControl_usstates', '8.10.0'), box('storageControl', '10.0.0')]}, download(version));
  }
  await observe('patch-minimum-observation', {checkboxes: [box('syntheticPatchMinimum', '8.10.9')]}, download('8.10.0'), 'DISPUTED');
  await observe('prerelease-minimum-observation', {checkboxes: [box('gppControl_usstates', '8.10.0')]}, download('8.10.0-beta.1'), 'DISPUTED');
  for (const version of ['8.10.0', '9.0.0']) {
    await observe(`renames-${version}`, {checkboxes: [box('tcfControl'), box('consentManagementTcf'), box('paapiForGpt'), box('appnexusBidAdapter')]}, download(version));
  }
  await observe('combined-minimum-and-rename', {checkboxes: [box('tcfControl', '9.0.0')]}, download('8.0.0'), 'DISPUTED');
  await observe('alias-export-import', {checkboxes: [box('rtbdemand_comBidAdapter', undefined, 'adkernelBidAdapter'),
    {id: 'adkernelBidAdapter', moduleCode: 'adkernelBidAdapter'}]}, async harness => {
    download('10.0.0')(harness);
    harness.importConfig((await harness.snapshot()).downloads.find(item => item.filename === 'prebid-config.json').contents);
  }, 'DISPUTED');
  await observe('v8-export-import', {checkboxes: [box('tcfControl')]}, async harness => {
    download('8.10.0')(harness);
    harness.importConfig((await harness.snapshot()).downloads.find(item => item.filename === 'prebid-config.json').contents);
  }, 'DISPUTED');
  for (const [id, contents] of [['malformed-config', '{'], ['empty-modules-config', '{"version":"9.0.0","modules":[]}'],
    ['unknown-config-values', '{"version":"77.0.0","modules":["missingModule"]}'], ['null-config', 'null'], ['empty-object-config', '{}']]) {
    await observe(id, {checkboxes: [box('appnexusBidAdapter')]}, harness => harness.importConfig(contents));
  }
  await observe('response-filename', {checkboxes: [box('appnexusBidAdapter')]}, download('10.0.0', {disposition: 'attachment; filename="custom-prebid.js"'}));
  await observe('download-failure', {checkboxes: [box('appnexusBidAdapter')]}, harness => {
    harness.clickDownload(); harness.respondDownload({failure: true});
  }, 'DISPUTED');
  for (const [id, response] of [['versions-empty', {body: '{"versions":[]}'}], ['versions-malformed', {body: '{'}], ['versions-failure', {failure: true}]]) {
    const harness = createDownloadConsumer({repoDir});
    try { harness.respondVersions(response); cases.push({id, policy_status: 'SOURCE_BACKED', dom_fixture_sha256: harness.provenance.dom_fixture_sha256, observation: await harness.snapshot()}); }
    finally { harness.close(); }
  }
  return {schema_version: 1, kind: 'offline-pinned-download-consumer-observations', status: 'OBSERVED',
    provenance, harness_sha256: sha256(fs.readFileSync(fileURLToPath(import.meta.url))), selected_cases: cases.length, cases, policy_approved: false, full_m2_acceptance: false,
    limits: ['Executes original download.js handlers and pinned jQuery against jsdom; not browser or Jekyll fidelity.',
      'AJAX callbacks, file input, alerts, history recording, object URLs, anchor downloads and timers use controlled offline effects.',
      'No HTTP, jQuery wire serialization, service availability, returned bundle contents, real file picker/download, CSS interaction, or timing proof.',
      'Synthetic counterexamples record legacy behavior; disputes and future compatibility policy remain unresolved.']};
}
