#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';

const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
export function verifyScannedFiles(files, expected) {
  if (!files.length) throw new Error('Empty scanned source set');
  const seen = new Set();
  for (const file of files) {
    if (seen.has(file.path)) throw new Error(`Duplicate scanned path: ${file.path}`);
    seen.add(file.path);
    const actual = expected.get(file.path);
    if (!actual || actual.sha256 !== file.sha256 || actual.bytes !== file.bytes) {
      throw new Error(`Git source binding mismatch: ${file.path}`);
    }
  }
  return files.length;
}

export function verifyInventory(repo, inventory) {
  const git = args => execFileSync('git', ['-C', repo, ...args], {maxBuffer: 256 * 1024 * 1024});
  const refs = {legacy: inventory.provenance.reference_sha, migration: inventory.provenance.site_sha};
  const verified = {};
  for (const [side, ref] of Object.entries(refs)) {
    if (!/^[a-f0-9]{40}$/.test(ref)) throw new Error('Expected full pinned source SHA');
    const tree = new Map();
    for (const item of git(['ls-tree', '-rz', ref]).toString('utf8').split('\0').filter(Boolean)) {
      const tab = item.indexOf('\t'); const [mode, type, oid] = item.slice(0, tab).split(' ');
      if (type === 'blob' && mode !== '120000') tree.set(item.slice(tab + 1), oid);
    }
    const files = inventory[side].files;
    const ids = [...new Set(files.map(file => {
      const oid = tree.get(file.path); if (!oid) throw new Error(`Path absent from ${ref}: ${file.path}`); return oid;
    }))];
    if (!ids.length) throw new Error('Empty blob selection');
    const batch = execFileSync('git', ['-C', repo, 'cat-file', '--batch'],
      {input: `${ids.join('\n')}\n`, maxBuffer: 256 * 1024 * 1024});
    const blobs = new Map(); let cursor = 0;
    for (const expectedId of ids) {
      const end = batch.indexOf(10, cursor);
      const [oid, type, sizeText] = batch.subarray(cursor, end).toString('utf8').split(' ');
      const size = Number(sizeText);
      if (end < 0 || oid !== expectedId || type !== 'blob' || !Number.isInteger(size) || size < 0) throw new Error('Malformed Git blob stream');
      const bytes = batch.subarray(end + 1, end + 1 + size);
      if (bytes.length !== size || batch[end + 1 + size] !== 10) throw new Error('Truncated Git blob stream');
      blobs.set(oid, {sha256: hash(bytes), bytes: size}); cursor = end + size + 2;
    }
    const expected = new Map(files.map(file => [file.path, blobs.get(tree.get(file.path))]));
    verified[side] = {commit: ref, files_verified: verifyScannedFiles(files, expected),
      git_tree: git(['rev-parse', `${ref}^{tree}`]).toString().trim()};
  }
  const base = git(['merge-base', refs.legacy, refs.migration]).toString().trim();
  const tokens = git(['diff', '--name-status', '--find-renames', '-z', base, refs.legacy]).toString('utf8').split('\0').filter(Boolean);
  const changes = [];
  for (let i = 0; i < tokens.length;) {
    const status = tokens[i++]; const from = tokens[i++];
    if (/^[RC]/.test(status)) changes.push({status, from, path: tokens[i++]});
    else changes.push({status, path: from});
  }
  const statusCounts = {};
  for (const item of changes) statusCounts[item.status[0]] = (statusCounts[item.status[0]] ?? 0) + 1;
  return {schema_version: 1, binding: 'all_scanned_file_bytes_verified_against_pinned_git_blobs',
    verified, merge_base: base,
    production_commits_since_base: Number(git(['rev-list', '--count', `${base}..${refs.legacy}`]).toString()),
    upstream_changes: {count: changes.length, by_status: statusCounts, files: changes},
    limitations: ['Verifies all inventoried bytes, not completeness of a published-page selection.',
      'Delta is production changes since shared base, not an automatic merge or semantic reconciliation.']};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const {values} = parseArgs({options: {repo: {type: 'string'}, inventory: {type: 'string'}, out: {type: 'string'}}});
    if (!values.repo || !values.inventory || !values.out) throw new Error('Required: --repo PATH --inventory JSON --out NEW_FILE');
    const bytes = fs.readFileSync(values.inventory);
    const result = verifyInventory(values.repo, JSON.parse(bytes));
    result.inventory_sha256 = hash(bytes);
    result.verifier_sha256 = hash(fs.readFileSync(fileURLToPath(import.meta.url)));
    fs.writeFileSync(values.out, `${JSON.stringify(result, null, 2)}\n`, {flag: 'wx'});
    console.log(JSON.stringify({binding: result.binding, verified: result.verified, upstream_changes: result.upstream_changes.count}));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
