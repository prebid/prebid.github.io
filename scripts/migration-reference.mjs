#!/usr/bin/env node
// Verifies provenance/structure, not the correctness of disputed policy or rendering.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';

const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const check = (condition, message) => { if (!condition) throw new Error(message); };

export function verifyReference(reference, readPinnedBlob) {
  check(reference.schema_version === 1, 'Unsupported reference schema');
  check(/^[a-f0-9]{40}$/.test(reference.reference?.commit ?? ''), 'Invalid source commit');
  check(reference.cases?.length > 0, 'Empty case selection');
  const artifacts = reference.source_artifacts ?? {};
  check(Object.keys(artifacts).length > 0, 'Empty source artifacts');
  const bytesById = new Map();
  for (const [id, artifact] of Object.entries(artifacts)) {
    check(typeof artifact.path === 'string' && !path.posix.isAbsolute(artifact.path)
      && !artifact.path.split('/').includes('..'), `Unsafe source path: ${id}`);
    const bytes = readPinnedBlob(reference.reference.commit, artifact.path);
    check(bytes.length === artifact.bytes && hash(bytes) === artifact.sha256, `Source hash/size mismatch: ${id}`);
    const lines = bytes.toString('utf8').split(/\r?\n/);
    // Python splitlines, used by the independent author, omits a final empty line.
    const lineCount = lines.length - (lines.at(-1) === '' ? 1 : 0);
    check(lineCount === artifact.line_count, `Source line count mismatch: ${id}`);
    check(artifact.url?.includes(`/blob/${reference.reference.commit}/${artifact.path}`), `Unbound source URL: ${id}`);
    bytesById.set(id, bytes);
  }
  const selected = new Set(); let captures = 0; let disputed = 0;
  function inspectCaptures(value) {
    if (!value || typeof value !== 'object') return;
    if (Object.hasOwn(value, 'source_byte_start')) {
      const bytes = bytesById.get(value.source_artifact);
      check(bytes, 'Unknown capture source');
      const start = value.source_byte_start; const end = value.source_byte_end_exclusive;
      check(Number.isInteger(start) && Number.isInteger(end) && start >= 0 && end > start && end <= bytes.length, 'Invalid capture bounds');
      const capture = bytes.subarray(start, end);
      check(capture.length === value.bytes && hash(capture) === value.sha256
        && capture.equals(Buffer.from(value.text, 'utf8')), 'Capture payload/digest mismatch');
      captures++;
    }
    for (const item of Object.values(value)) inspectCaptures(item);
  }
  for (const item of reference.cases) {
    check(typeof item.id === 'string' && item.id && !selected.has(item.id), 'Duplicate or missing case ID');
    selected.add(item.id);
    check(['SOURCE_BACKED', 'DISPUTED'].includes(item.status), `Unsupported status: ${item.id}`);
    check(item.source_refs?.length > 0 && item.negative_controls?.length > 0, `Unanchored/uncontrolled case: ${item.id}`);
    for (const anchor of item.source_refs) {
      const artifact = artifacts[anchor.artifact];
      check(artifact && Number.isInteger(anchor.line_start) && Number.isInteger(anchor.line_end)
        && anchor.line_start >= 1 && anchor.line_end >= anchor.line_start
        && anchor.line_end <= artifact.line_count, `Invalid source anchor: ${item.id}`);
    }
    if (item.status === 'DISPUTED') {
      disputed++;
      check(item.expected?.canonical_decision === null, `Dispute silently resolved: ${item.id}`);
    }
    inspectCaptures(item.expected);
  }
  return {schema_version: 1, reference_commit: reference.reference.commit,
    source_artifacts_verified: bytesById.size, cases_selected: selected.size,
    exact_code_captures_verified: captures, disputed_cases: disputed,
    verification: 'source_provenance_and_structure_only',
    semantic_policy_approval: false, rendered_parity_executed: false, service_executed: false};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const {values} = parseArgs({options: {repo: {type: 'string'}, reference: {type: 'string'}, out: {type: 'string'}}});
    check(values.repo && values.reference && values.out, 'Required: --repo PATH --reference JSON --out NEW_FILE');
    const bytes = fs.readFileSync(values.reference); const reference = JSON.parse(bytes);
    const result = verifyReference(reference, (sha, name) => execFileSync('git', ['-C', values.repo, 'cat-file', 'blob', `${sha}:${name}`], {maxBuffer: 16 * 1024 * 1024}));
    result.reference_file_sha256 = hash(bytes);
    result.verifier_sha256 = hash(fs.readFileSync(fileURLToPath(import.meta.url)));
    fs.writeFileSync(values.out, `${JSON.stringify(result, null, 2)}\n`, {flag: 'wx'});
    console.log(JSON.stringify(result));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
