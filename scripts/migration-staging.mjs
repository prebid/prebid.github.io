import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

export const STAGING_MANIFEST = '.migration-staging-manifest.json';
export const STAGING_JOURNAL = '.migration-staging-journal.json';
const knownPlans = new WeakSet();
const digest = (value) => createHash('sha256').update(value).digest('hex');
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const portable = (value) => value.normalize('NFC').toLowerCase();
const identity = (stat) => ({ dev: stat.dev, ino: stat.ino });

function canonical(value) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (Array.isArray(value)) return value.map(canonical);
  if (value && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  throw new Error('Provenance must contain JSON values only');
}

function freeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

function filename(value) {
  if (typeof value !== 'string' || !value || path.posix.isAbsolute(value)
    || path.win32.isAbsolute(value) || /[\\\x00-\x1f\x7f]/u.test(value)
    || value.split('/').some((part) => !part || part === '.' || part === '..'
      || portable(part) === '.git' || portable(part).startsWith('.migration-staging-')
      || /[. ]$/u.test(part) || /[:*?"<>|]/u.test(part))) {
    throw new Error(`Unsafe final relative filename: ${JSON.stringify(value)}`);
  }
  return value;
}

function uniquePaths(files) {
  const seen = new Set();
  const spelling = new Map();
  for (const file of files) {
    const key = portable(filename(file.path));
    if (seen.has(key)) throw new Error(`Duplicate final filename: ${file.path}`);
    seen.add(key);
    const parts = file.path.split('/');
    for (let length = 1; length <= parts.length; length += 1) {
      const prefix = parts.slice(0, length).join('/');
      const other = spelling.get(portable(prefix));
      if (other && other !== prefix) throw new Error(`Case/Unicode path collision: ${prefix}`);
      spelling.set(portable(prefix), prefix);
    }
  }
  for (const key of seen) {
    const segments = key.split('/');
    while (segments.length > 1) {
      segments.pop();
      if (seen.has(segments.join('/'))) throw new Error(`File/directory collision: ${key}`);
    }
  }
}

function lstat(target) {
  try { return fs.lstatSync(target); } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

// Check every existing component, including differently cased names on Linux.
function inspect(root, relative) {
  let current = root;
  for (const part of relative.split('/')) {
    const parent = lstat(current);
    if (!parent) return null;
    if (!parent.isDirectory() || parent.isSymbolicLink()) throw new Error(`Unsafe parent: ${current}`);
    const aliases = fs.readdirSync(current).filter((entry) => portable(entry) === portable(part));
    if (aliases.some((entry) => entry !== part)) throw new Error(`Case/Unicode path collision: ${relative}`);
    current = path.join(current, part);
    const stat = lstat(current);
    if (!stat) return null;
    if (stat.isSymbolicLink()) throw new Error(`Symlink path rejected: ${relative}`);
  }
  return lstat(current);
}

function fileState(root, relative) {
  const stat = inspect(root, relative);
  if (!stat) return null;
  if (!stat.isFile()) throw new Error(`Expected a regular file: ${relative}`);
  return digest(fs.readFileSync(path.join(root, relative)));
}

function directoryStates(root, paths) {
  const names = new Set();
  for (const relative of paths) {
    const parts = relative.split('/');
    while (parts.length > 1) { parts.pop(); names.add(parts.join('/')); }
  }
  return [...names].sort().map((relative) => {
    const stat = inspect(root, relative);
    if (stat && !stat.isDirectory()) throw new Error(`File/directory collision: ${relative}`);
    return { path: relative, identity: stat ? identity(stat) : null };
  });
}

function readManifest(root) {
  if (fileState(root, STAGING_MANIFEST) === null) return null;
  const value = JSON.parse(fs.readFileSync(path.join(root, STAGING_MANIFEST), 'utf8'));
  if (value.schema_version !== 1 || !Array.isArray(value.files) || !value.files.length) {
    throw new Error('Invalid staging manifest');
  }
  uniquePaths(value.files);
  for (const file of value.files) {
    if (!/^[a-f0-9]{64}$/u.test(file.sha256)) throw new Error('Invalid manifest file hash');
  }
  return value;
}

function rootUnchanged(plan) {
  const stat = lstat(plan.inputRoot);
  if (!stat?.isDirectory() || stat.isSymbolicLink()
    || fs.realpathSync(plan.inputRoot) !== plan.root
    || !equal(identity(stat), plan.rootIdentity)) throw new Error('Staging root changed after planning');
}

function verifyDirectories(plan, recovery) {
  rootUnchanged(plan);
  for (const before of plan.directories) {
    const stat = inspect(plan.root, before.path);
    if (stat && !stat.isDirectory()) throw new Error(`Parent changed: ${before.path}`);
    const now = stat ? identity(stat) : null;
    if (before.identity ? !equal(now, before.identity) : (!recovery && now !== null)) {
      throw new Error(`Parent changed after planning: ${before.path}`);
    }
  }
}

function verifyStates(plan, recovery) {
  verifyDirectories(plan, recovery);
  const desired = new Map(plan.manifest.files.map((file) => [file.path, file.sha256]));
  desired.set(STAGING_MANIFEST, digest(plan.manifestBytes));
  for (const before of plan.before) {
    const now = fileState(plan.root, before.path);
    const after = desired.get(before.path) ?? null;
    if (now !== before.sha256 && (!recovery || now !== after)) {
      throw new Error(`Managed output or destination changed after planning: ${before.path}`);
    }
  }
}

function completed(plan) {
  verifyDirectories(plan, true);
  if (fileState(plan.root, STAGING_MANIFEST) !== digest(plan.manifestBytes)) return false;
  return plan.before.every((before) => {
    const after = before.path === STAGING_MANIFEST ? digest(plan.manifestBytes)
      : plan.manifest.files.find((file) => file.path === before.path)?.sha256 ?? null;
    return fileState(plan.root, before.path) === after;
  });
}

function operations(before, files) {
  const old = new Map(before.map((file) => [file.path, file.sha256]));
  const next = new Map(files.map((file) => [file.path, file.sha256]));
  return [...old.keys()].filter((name) => name !== STAGING_MANIFEST).sort().flatMap((name) => {
    if (old.get(name) === (next.get(name) ?? null)) return [];
    return [{ type: next.has(name) ? 'write' : 'remove', path: name,
      before_sha256: old.get(name), sha256: next.get(name) ?? null }];
  });
}

function seal(payload) {
  const plan = freeze({ ...payload, id: digest(JSON.stringify(payload)) });
  knownPlans.add(plan);
  return plan;
}

function journalPlan(root) {
  if (fileState(root, STAGING_JOURNAL) === null) return null;
  const journal = JSON.parse(fs.readFileSync(path.join(root, STAGING_JOURNAL), 'utf8'));
  if (journal.schema_version !== 1 || !journal.plan || journal.plan.root !== root) {
    throw new Error('Invalid staging recovery journal');
  }
  const { id, ...payload } = journal.plan;
  if (id !== digest(JSON.stringify(payload))) throw new Error('Staging journal checksum mismatch');
  uniquePaths(payload.files);
  uniquePaths(payload.manifest.files);
  for (const file of payload.files) {
    if (typeof file.content !== 'string' || digest(Buffer.from(file.content, 'base64')) !== file.sha256) {
      throw new Error('Invalid staged content in journal');
    }
  }
  for (const item of [...payload.before, ...payload.directories]) {
    if (item.path !== STAGING_MANIFEST) filename(item.path);
  }
  const expectedManifest = { schema_version: 1, provenance: canonical(payload.manifest.provenance),
    files: payload.files.map(({ path: name, sha256 }) => ({ path: name, sha256 })) };
  if (!equal(payload.manifest, expectedManifest)
    || payload.manifestBytes !== `${JSON.stringify(expectedManifest, null, 2)}\n`
    || !equal(payload.operations, operations(payload.before, payload.files))) {
    throw new Error('Invalid staging journal plan');
  }
  return seal(payload);
}

/** Plan only: no directories or files are created. Provenance is recorded, not verified. */
export function planStaging({ root, files, provenance = {} }) {
  if (typeof root !== 'string' || !root) throw new Error('An existing staging root is required');
  const inputRoot = path.resolve(root);
  const rootStat = lstat(inputRoot);
  if (!rootStat?.isDirectory() || rootStat.isSymbolicLink()) throw new Error('Staging root must be a real directory');
  root = fs.realpathSync(inputRoot);
  if (!Array.isArray(files) || !files.length) throw new Error('Staging requires a nonempty file selection');
  uniquePaths(files);
  const outputs = files.map((file) => {
    if (typeof file.content !== 'string' && !Buffer.isBuffer(file.content)) {
      throw new Error(`Content must be a string or Buffer: ${file.path}`);
    }
    const content = Buffer.from(file.content);
    return { path: file.path, content: content.toString('base64'), sha256: digest(content) };
  }).sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  const manifest = { schema_version: 1, provenance: canonical(provenance),
    files: outputs.map(({ path: name, sha256 }) => ({ path: name, sha256 })) };
  const pending = journalPlan(root);
  if (pending) {
    if (!equal(manifest, pending.manifest)) throw new Error('Pending staging transaction has different requested output');
    verifyStates(pending, true);
    return pending;
  }
  const previous = readManifest(root);
  const old = new Map((previous?.files ?? []).map((file) => [file.path, file.sha256]));
  // Reject cross-generation file/directory and portable-name collisions too.
  uniquePaths([...new Map([...(previous?.files ?? []), ...manifest.files].map((file) => [file.path, file])).values()]);
  const paths = [...new Set([...old.keys(), ...outputs.map((file) => file.path)])].sort();
  const before = paths.map((name) => ({ path: name, sha256: fileState(root, name) }));
  for (const file of before) {
    if (old.has(file.path) && file.sha256 !== old.get(file.path)) {
      throw new Error(`Managed output was manually edited or removed: ${file.path}`);
    }
    if (!old.has(file.path) && file.sha256 !== null) throw new Error(`Unmanaged destination collision: ${file.path}`);
  }
  before.push({ path: STAGING_MANIFEST, sha256: fileState(root, STAGING_MANIFEST) });
  return seal({ root, inputRoot, rootIdentity: identity(rootStat), files: outputs,
    manifest, manifestBytes: `${JSON.stringify(manifest, null, 2)}\n`, before,
    directories: directoryStates(root, paths), operations: operations(before, outputs) });
}

function temporary(plan, index) { return `.migration-staging-install-${plan.id}-${index}`; }

function atomicWrite(plan, relative, bytes, index) {
  verifyDirectories(plan, true);
  inspect(plan.root, relative);
  const scratch = temporary(plan, index);
  const stat = inspect(plan.root, scratch);
  if (stat && !stat.isFile()) throw new Error(`Unsafe transaction temporary file: ${scratch}`);
  // The journal owns this exact temporary name; a partial write is safe to retry.
  const fd = fs.openSync(path.join(plan.root, scratch), 'w', 0o644);
  try { fs.writeFileSync(fd, bytes); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
  fs.mkdirSync(path.dirname(path.join(plan.root, relative)), { recursive: true });
  inspect(plan.root, relative);
  fs.renameSync(path.join(plan.root, scratch), path.join(plan.root, relative));
}

/** Resume the same plan after interruption. Single-writer local staging, not a concurrent-writer lock. */
export function applyStaging(plan, { dryRun = false, failAfter } = {}) {
  if (!knownPlans.has(plan)) throw new Error('Apply requires a plan returned by planStaging');
  if (typeof dryRun !== 'boolean' || (failAfter !== undefined && (!Number.isInteger(failAfter) || failAfter < 0))) {
    throw new Error('Invalid staging apply options');
  }
  rootUnchanged(plan);
  const pending = journalPlan(plan.root);
  if (pending && pending.id !== plan.id) throw new Error('Another staging transaction is pending');
  const result = (status) => ({ status, manifest: plan.manifest, operations: plan.operations, recovered: Boolean(pending) });
  if (!pending && completed(plan)) return result(dryRun ? 'dry-run' : 'unchanged');
  verifyStates(plan, Boolean(pending));
  if (dryRun) return result('dry-run');
  if (!pending) {
    for (let index = 0; index <= plan.operations.length; index += 1) {
      if (inspect(plan.root, temporary(plan, index))) throw new Error('Transaction temporary filename collision');
    }
    const fd = fs.openSync(path.join(plan.root, STAGING_JOURNAL), 'wx', 0o600);
    try {
      fs.writeFileSync(fd, `${JSON.stringify({ schema_version: 1, plan }, null, 2)}\n`);
      fs.fsyncSync(fd);
    } finally { fs.closeSync(fd); }
  }
  let installed = 0;
  const interrupt = () => {
    if (installed === failAfter) throw new Error(`Injected staging interruption after ${installed} operations`);
  };
  interrupt();
  for (const [index, operation] of plan.operations.entries()) {
    verifyStates(plan, true);
    if (fileState(plan.root, operation.path) === operation.sha256) continue;
    if (operation.type === 'remove') fs.unlinkSync(path.join(plan.root, operation.path));
    else atomicWrite(plan, operation.path,
      Buffer.from(plan.files.find((file) => file.path === operation.path).content, 'base64'), index);
    installed += 1;
    interrupt();
  }
  verifyStates(plan, true);
  atomicWrite(plan, STAGING_MANIFEST, plan.manifestBytes, plan.operations.length);
  for (let index = 0; index <= plan.operations.length; index += 1) {
    const scratch = temporary(plan, index);
    if (fileState(plan.root, scratch) !== null) fs.unlinkSync(path.join(plan.root, scratch));
  }
  fs.unlinkSync(path.join(plan.root, STAGING_JOURNAL));
  return result('applied');
}
