import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const sorted = values => [...new Set(values)].sort();

function fileState(file, name) {
  let stat;
  try { stat = fs.lstatSync(file); }
  catch (error) { if (error.code === 'ENOENT') return {path: name, kind: 'missing'}; throw error; }
  if (!stat.isFile() || fs.realpathSync(file) !== file) throw new Error(`Unsupported source/tool path: ${name}`);
  const bytes = fs.readFileSync(file);
  return {path: name, kind: 'file', bytes: bytes.length, executable_bits: stat.mode & 0o111, sha256: hash(bytes)};
}

export function sourceState({siteDir, toolPaths, env = process.env}) {
  siteDir = fs.realpathSync(siteDir);
  const git = args => execFileSync('git', ['--no-optional-locks', '-C', siteDir, ...args], {env, maxBuffer: 64 * 1024 * 1024});
  const list = args => git(args).toString('utf8').split('\0').filter(Boolean);
  const metadata = () => ({
    head: git(['rev-parse', 'HEAD']).toString('utf8').trim(),
    tracked: sorted(list(['ls-files', '--cached', '-z'])),
    untracked: sorted(list(['ls-files', '--others', '--exclude-standard', '-z'])),
    index_sha256: hash(git(['ls-files', '--stage', '-z'])),
    status: git(['status', '--porcelain=v1', '-z', '--untracked-files=all']).toString('utf8'),
  });
  const before = metadata();
  const names = sorted([...before.tracked, ...before.untracked]);
  if (!names.length) throw new Error('Empty candidate source state');
  const files = names.map(name => fileState(path.join(siteDir, name), name));
  const tools = sorted(toolPaths.map(file => path.resolve(file))).map(file => fileState(file, file));
  if (!tools.length) throw new Error('Empty validator tool state');
  if (JSON.stringify(before) !== JSON.stringify(metadata())) throw new Error('Git state changed while source snapshot was being read');
  return {schema_version: 1, site_dir: siteDir, ...before, files, tools};
}

export function assertSourceUnchanged(initial, current, phase) {
  if (current.head !== initial.head) throw new Error(`${phase}: candidate HEAD changed`);
  if (JSON.stringify(current.tools) !== JSON.stringify(initial.tools)) throw new Error(`${phase}: validator tool bytes changed`);
  if (JSON.stringify(current) !== JSON.stringify(initial)) throw new Error(`${phase}: candidate source paths, bytes, index, or status changed`);
  return {phase, status: 'unchanged', head: initial.head, source_state_sha256: hash(JSON.stringify(initial))};
}
