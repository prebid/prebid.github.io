import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {execFileSync, spawnSync} from 'node:child_process';
import {load} from 'cheerio';
import {parsePilotCsv} from './migration-pilot-checks.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.dirname(here);
const reference = JSON.parse(fs.readFileSync(path.join(repo, 'migration/reference-cases.json')));
const runtimePin = JSON.parse(fs.readFileSync(path.join(repo, 'migration/legacy-runtime.json')));
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
export const LEGACY_COMMIT = reference.reference.commit;
if (!/^[a-f0-9]{40}$/.test(LEGACY_COMMIT)) throw new Error('Legacy reference requires an immutable commit');

function source(name) {
  const artifact = Object.values(reference.source_artifacts).find(item => item.path === name);
  if (!artifact) throw new Error(`Unbound reference artifact: ${name}`);
  const bytes = execFileSync('git', ['show', `${LEGACY_COMMIT}:${name}`], {cwd: repo});
  if (sha(bytes) !== artifact.sha256) throw new Error(`Reference bytes changed: ${name}`);
  return bytes.toString('utf8');
}

export function legacyProbe({pages = [], yamlSources = []}) {
  if (!pages.length && !yamlSources.length) throw new Error('Empty legacy probe');
  for (const records of [pages, yamlSources]) {
    if (records.some(row => !row.id) || new Set(records.map(row => row.id)).size !== records.length) throw new Error('Missing or duplicate probe identity');
  }
  const detail = source('_includes/dev-docs/bidder-meta-data.html');
  const csv = source('dev-docs/bidder-data.csv');
  const matches = [...csv.matchAll(/{% for page in bidder_pages %}([\s\S]*?){% endfor %}/g)];
  if (matches.length !== 1) throw new Error('CSV row adapter requires exactly one reviewed bidder loop');
  const body = csv.replace(/^---\n[\s\S]*?\n---\n/, '');
  const headers = parsePilotCsv(body.split('\n')[0])[0];
  const env = {...process.env};
  const gemHome = process.env.PREBID_LEGACY_GEM_HOME ?? path.join(repo, '.validation-results/legacy-gems');
  env.GEM_HOME = gemHome; env.GEM_PATH = gemHome;
  const result = spawnSync('ruby', [path.join(here, 'migration-legacy-runtime.rb')], {env,
    input: JSON.stringify({pages, yaml_sources: yamlSources, detail_template: detail, csv_row_template: matches[0][1]}),
    encoding: 'utf8', timeout: 30000, maxBuffer: 32 * 1024 * 1024});
  if (result.status !== 0 || result.error) throw new Error(`Legacy runtime probe failed. Install the pinned gems as documented in migration/M2_CONSUMERS.md. ${result.stderr || result.error}`);
  const output = JSON.parse(result.stdout);
  for (const [name, expected] of Object.entries(runtimePin.gems)) {
    const actual = output.runtime.gems[name];
    if (actual?.version !== expected.version || actual.archive_sha256 !== expected.sha256) throw new Error(`Unpinned legacy gem: ${name}`);
  }
  if (output.results.length !== pages.length || output.yaml_results.length !== yamlSources.length) throw new Error('Runtime probe selection shrank');
  output.results = output.results.map((row, index) => {
    if (row.id !== pages[index].id) throw new Error('Runtime page identity changed');
    const $ = load(row.detail_html); const detail = {};
    $('th').each((_index, el) => {const label = $(el).text().trim(); if (label) detail[label] = $(el).next('td').text().trim();});
    const records = parsePilotCsv(row.csv_row.trim());
    if (records.length !== 1 || records[0].length !== headers.length) throw new Error('Legacy CSV row is not a single valid-width record');
    return {...row, detail, csv: Object.fromEntries(headers.map((header, i) => [header, records[0][i]]))};
  });
  output.yaml_results.forEach((row, index) => {if (row.id !== yamlSources[index].id) throw new Error('Runtime YAML identity changed');});
  return {...output, source_commit: LEGACY_COMMIT,
    contexts: pages,
    yaml_inputs: yamlSources.map(row => ({id: row.id, sha256: sha(row.text), bytes: Buffer.byteLength(row.text)})),
    sources: {detail_sha256: sha(detail), csv_sha256: sha(csv)},
    reference_sha256: sha(fs.readFileSync(path.join(repo, 'migration/reference-cases.json'))),
    runtime_pin_sha256: sha(fs.readFileSync(path.join(repo, 'migration/legacy-runtime.json'))),
    tool_sha256: sha(fs.readFileSync(fileURLToPath(import.meta.url))),
    ruby_tool_sha256: sha(fs.readFileSync(path.join(here, 'migration-legacy-runtime.rb'))),
    documented_ruby_match: output.runtime.ruby === runtimePin.documented_ruby,
    limits: ['Executes actual selected template row/metadata expressions, not full Jekyll or production deployment',
      'Documented Ruby match is reported independently of gem-version checks',
      'Observed duplicate-key and scalar handling does not approve the future metadata policy']};
}

export function legacyDecisionProbe() {
  const page = {layout: 'bidder', biddercode: 'fixture', title: 'Fixture'};
  const variants = [
    {id: 'omitted', page}, {id: 'false', page: {...page, usp_supported: false, coppa_supported: false, schain_supported: false, dchain_supported: false, safeframes_ok: false, gpp_supported: false}},
    {id: 'true', page: {...page, usp_supported: true, coppa_supported: true, schain_supported: true, dchain_supported: true, safeframes_ok: true, gpp_supported: true}},
    {id: 'null', page: {...page, usp_supported: null, safeframes_ok: null, gpp_sids: null}},
    {id: 'string-false', page: {...page, usp_supported: 'false', safeframes_ok: 'false'}},
    {id: 'gpp-false-empty', page: {...page, gpp_supported: false, gpp_sids: ''}},
    {id: 'gpp-false-global', page: {...page, gpp_supported: false}, globals: {gpp_sids: 'ambient'}},
    {id: 'gpp-sections-win', page: {...page, gpp_supported: false, gpp_sids: 'tcfeu, usp'}},
    {id: 'singular-id', page: {...page, userId: 'all'}},
    {id: 'both-id', page: {...page, userId: 'all', userIds: 'id5Id'}},
  ];
  return legacyProbe({pages: variants, yamlSources: [
    {id: 'yaml-scalars', text: 'yes_value: yes\nno_value: no\non_value: on\noff_value: off\nquoted_no: "no"\n'},
    {id: 'duplicate', text: 'pbs: true\npbs: false\n'},
  ]});
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(JSON.stringify(legacyDecisionProbe(), null, 2));
