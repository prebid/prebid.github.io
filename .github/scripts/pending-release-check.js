// Pending release check: for each open docs PR labelled as waiting on a code release ("Pending PBS Release" etc.),
// find the linked code PRs, check whether each is merged and included in its repo's latest release, and say so on
// the docs PR. Docs maintainers still merge by hand; this only labels and comments.
//
// Usage: node pending-release-check.js
//   GITHUB_TOKEN       token for the GitHub API (in Actions, the job's GITHUB_TOKEN)
//   GITHUB_REPOSITORY  docs repo (default prebid/prebid.github.io)
//   DRY_RUN            anything but "false" prints what would happen without labelling or commenting.
//                      Writes also require GITHUB_ACTIONS=true, so a local run never writes.
//   PR_NUMBERS         optional comma-separated docs PR numbers to check instead of every pending PR
//   GITHUB_STEP_SUMMARY optional file for the Markdown status table (printed to stdout otherwise)
//   BOT_LOGIN          author of this check's own comments (default github-actions[bot])
//
// Each kind of comment (released, partial, closed, no-link) is posted at most once per PR. It carries a hidden
// marker with a key (the code PRs it is about); when the key changes, the same comment is edited, not reposted.
const fs = require('fs');

const PENDING_LABELS = [
  'Pending PBS Release',
  'Pending PBJS Release',
  'Pending Next Major Release',
  'Pending Prebid Module Release',
  'Pending Prebid Mobile Release',
];
const READY_LABEL = { name: 'Ready to merge: code released', color: '0e8a16', description: 'Linked code PRs are merged and in a release; set by pending-release-check' };
const MARKER = 'pending-release-check';
const WORKFLOW_URL = 'https://github.com/prebid/prebid.github.io/blob/master/.github/workflows/pending-release-check.yml';

// Code repos whose PRs a docs PR can wait on, keyed by lower-case name. GitHub repo names are case-insensitive.
const CODE_REPOS = {
  'prebid.js': { repo: 'prebid/Prebid.js', product: 'Prebid.js' },
  'prebid-server': { repo: 'prebid/prebid-server', product: 'PBS-Go' },
  'prebid-server-java': { repo: 'prebid/prebid-server-java', product: 'PBS-Java' },
  'prebid-mobile-ios': { repo: 'prebid/prebid-mobile-ios', product: 'Prebid Mobile iOS' },
  'prebid-mobile-android': { repo: 'prebid/prebid-mobile-android', product: 'Prebid Mobile Android' },
  'prebid-universal-creative': { repo: 'prebid/prebid-universal-creative', product: 'Prebid Universal Creative' },
};
const codeRepo = name => CODE_REPOS[String(name).toLowerCase()];
const product = repo => (codeRepo(repo.split('/')[1]) || { product: repo }).product;
const ref = link => `${link.repo}#${link.number}`;

// ---- Link parsing

// Code PR references in free text: full URLs (github.com/prebid/prebid-server/pull/123) and short forms
// (prebid/prebid-server#123). Issue links and other repos are ignored. Returns [{ repo, number }], de-duplicated.
function parseLinks(text) {
  const found = new Map();
  const add = (name, number) => {
    const known = codeRepo(name);
    if (known) found.set(`${known.repo}#${number}`, { repo: known.repo, number: Number(number) });
  };
  const body = String(text || '');
  for (const m of body.matchAll(/github\.com\/prebid\/([\w.-]+?)\/pull\/(\d+)/gi)) add(m[1], m[2]);
  for (const m of body.matchAll(/(?<![\w./-])prebid\/([\w.-]+?)#(\d+)\b/gi)) add(m[1], m[2]);
  return [...found.values()];
}

// Code PRs that mention the docs PR (GitHub "cross-referenced" timeline events).
function crossReferences(timeline) {
  const found = [];
  for (const event of timeline || []) {
    const issue = event.event === 'cross-referenced' && event.source && event.source.issue;
    if (!issue || !issue.pull_request || !issue.repository) continue;
    const known = codeRepo(issue.repository.name);
    if (known) found.push({ repo: known.repo, number: issue.number });
  }
  return found;
}

const isOwnComment = (comment, botLogin) => String(comment.body || '').includes(`<!-- ${MARKER}:`) ||
  (comment.user && comment.user.login === botLogin);

// All code PRs a docs PR points at: its description, human comments, and code PRs that mention it.
function collectLinks({ body, comments = [], timeline = [], botLogin }) {
  const links = new Map();
  const add = (list, source) => list.forEach(l => { if (!links.has(ref(l))) links.set(ref(l), { ...l, source }); });
  add(parseLinks(body), 'description');
  add(parseLinks(comments.filter(c => !isOwnComment(c, botLogin) && !(c.user && c.user.type === 'Bot')).map(c => c.body).join('\n')), 'comment');
  add(crossReferences(timeline), 'cross-reference');
  return [...links.values()];
}

// ---- Decision

// links: [{ repo, number, state: 'open'|'closed'|'merged'|'missing', release?: tag }], release set when merged and
// included in the latest release. inferred: unlinked PBS-Java counterparts found by search (advisory only).
// Returns { status, released, pending, closed, inferred } where status is one of
//   no-link  no code PR found
//   closed   every linked code PR was closed unmerged
//   released every remaining linked code PR is in a release
//   partial  some released, some not (or an inferred PBS-Java counterpart has shipped)
//   waiting  nothing released yet
function decide(links, inferred = []) {
  const prs = links.filter(l => l.state !== 'missing');
  // A closed PR doesn't count if the same repo has another linked PR that is open or merged (it was replaced).
  const replaced = l => prs.some(o => o !== l && o.repo === l.repo && o.state !== 'closed');
  const closed = prs.filter(l => l.state === 'closed' && !replaced(l));
  const active = prs.filter(l => l.state !== 'closed');
  const released = active.filter(l => l.state === 'merged' && l.release);
  const pending = active.filter(l => !(l.state === 'merged' && l.release));
  const shippedInferred = inferred.filter(l => l.release);
  let status;
  if (!prs.length) status = 'no-link';
  else if (!active.length) status = 'closed';
  else if (!pending.length) status = 'released';
  else if (released.length || shippedInferred.length) status = 'partial';
  else status = 'waiting';
  return { status, released, pending, closed, inferred: shippedInferred };
}

// The comments a decision calls for: [{ kind, key, body }]. The key changes only when the PRs involved change, so a
// new release of an already-reported PR doesn't rewrite the comment.
function plannedComments(decision, pendingLabels) {
  const describe = l => {
    const name = `${l.repo}#${l.number} (${product(l.repo)})`;
    if (l.state === 'merged' && l.release) return `${name}: merged, and included in release ${l.release}`;
    if (l.state === 'merged') return `${name}: merged, not in a release yet`;
    if (l.state === 'closed') return `${name}: closed without being merged`;
    return `${name}: still open`;
  };
  const list = items => items.map(l => `- ${describe(l)}`).join('\n');
  const key = items => items.map(ref).sort().join(',');
  const footer = `<sub>Posted by the daily [pending release check](${WORKFLOW_URL}), which reads the code PRs linked from this ` +
    'PR (description, comments, and code PRs that mention it). It edits this comment if that changes.</sub>';
  const comment = (kind, k, text) => ({ kind, key: k, body: `<!-- ${MARKER}:${kind} key=${k} -->\n${text}\n\n${footer}` });
  const out = [];
  const { status, released, pending, closed, inferred } = decision;
  if (status === 'released') {
    out.push(comment('released', key(released),
      `The code this PR documents has been released:\n\n${list(released)}\n\n` +
      `This PR looks ready to merge, so it has the "${READY_LABEL.name}" label. ` +
      'The pending-release label stays until a docs maintainer merges it.'));
  }
  if (status === 'partial') {
    const found = inferred.map(l => `- ${describe(l)}. Not linked here: found by searching ${product(l.repo)} PR titles for \`${l.query}\`, so please check it is the right PR.`);
    const shipped = [...released, ...inferred];
    const pbsSplit = shipped.some(l => l.repo === 'prebid/prebid-server-java') && pending.some(l => l.repo === 'prebid/prebid-server') ||
      shipped.some(l => l.repo === 'prebid/prebid-server') && pending.some(l => l.repo === 'prebid/prebid-server-java');
    out.push(comment('partial', key([...released, ...pending, ...inferred]),
      `Part of the code this PR documents has been released, but not all of it:\n\n${[list(released), ...found, list(pending)].filter(Boolean).join('\n')}\n\n` +
      'This PR keeps waiting for the rest; this note just makes the status visible.' +
      (pbsSplit ? ' Bidder pages cannot yet say a bidder is in only one of PBS-Go and PBS-Java, so the page waits for both.' : '')));
  }
  if (closed.length) {
    out.push(comment('closed', key(closed),
      `${list(closed)}\n\nA linked code PR was closed without being merged, so this docs PR may no longer be needed. ` +
      'If the code moved to another PR, please link it here.'));
  }
  if (status === 'no-link') {
    out.push(comment('no-link', 'none',
      `This PR is labelled ${pendingLabels.map(l => `"${l}"`).join(', ')}, but no linked code PR was found. ` +
      'Please add a link to the code PR to the description or a comment, for example ' +
      '`https://github.com/prebid/prebid-server/pull/1234` or `prebid/prebid-server-java#1234`, ' +
      'so this PR can be merged once that code is released.'));
  }
  return out;
}

// What to do with each planned comment given the existing ones: post, edit (key changed) or nothing.
function commentActions(planned, existing, botLogin) {
  return planned.map(p => {
    const prior = existing.find(c => c.user && c.user.login === botLogin && String(c.body || '').includes(`<!-- ${MARKER}:${p.kind} `));
    if (!prior) return { action: 'post', ...p };
    const priorKey = (String(prior.body).match(new RegExp(`<!-- ${MARKER}:${p.kind} key=(\\S*) -->`)) || [])[1];
    return priorKey === p.key ? { action: 'none', ...p } : { action: 'edit', id: prior.id, ...p };
  });
}

// ---- GitHub API

function client(token) {
  let calls = 0;
  async function request(method, url, body) {
    calls++;
    const res = await fetch(url.startsWith('http') ? url : `https://api.github.com${url}`, {
      method,
      headers: {
        accept: 'application/vnd.github+json',
        'x-github-api-version': '2022-11-28',
        'user-agent': 'pending-release-check',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...(body ? { 'content-type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 404) return { status: 404, data: null, headers: res.headers };
    if (!res.ok) throw new Error(`${method} ${url}: ${res.status} ${(await res.text()).slice(0, 200)}`);
    return { status: res.status, data: res.status === 204 ? null : await res.json(), headers: res.headers };
  }
  async function paginate(url) {
    const items = [];
    let next = `${url}${url.includes('?') ? '&' : '?'}per_page=100`;
    while (next) {
      const { data, headers } = await request('GET', next);
      items.push(...(data || []));
      next = ((headers.get('link') || '').match(/<([^>]+)>;\s*rel="next"/) || [])[1];
    }
    return items;
  }
  return { request, paginate, get: url => request('GET', url).then(r => r.data), calls: () => calls };
}

const semverKey = tag => (String(tag).match(/\d+/g) || []).slice(0, 3).map(n => n.padStart(8, '0')).join('.');

function memo(fn) {
  const cache = new Map();
  return key => { if (!cache.has(key)) cache.set(key, fn(key)); return cache.get(key); };
}

function makeLookups(gh) {
  // Latest release tag; repos that only tag (no GitHub releases) fall back to the highest version-like tag.
  const latestRelease = memo(async repo => {
    const release = await gh.get(`/repos/${repo}/releases/latest`);
    if (release) return release.tag_name;
    const tags = (await gh.get(`/repos/${repo}/tags?per_page=100`)) || [];
    const versions = tags.map(t => t.name).filter(n => /^v?\d+\.\d+/.test(n)).sort((a, b) => semverKey(b).localeCompare(semverKey(a)));
    return versions[0] || null;
  });
  // Is the commit in the tag? compare {tag}...{sha}: "behind" or "identical" means the tag contains it.
  const inTag = memo(async key => {
    const [repo, tag, sha] = key.split(' ');
    const cmp = await gh.get(`/repos/${repo}/compare/${encodeURIComponent(tag)}...${sha}?per_page=1`);
    return !!cmp && (cmp.status === 'behind' || cmp.status === 'identical');
  });
  const pull = memo(async key => {
    const [repo, number] = key.split('#');
    return gh.get(`/repos/${repo}/pulls/${number}`);
  });
  // State of a linked code PR, and its release when merged.
  async function resolve(link) {
    const pr = await pull(ref(link));
    if (!pr) return { ...link, state: 'missing' }; // an issue number, or no such PR
    const state = pr.merged_at ? 'merged' : pr.state === 'open' ? 'open' : 'closed';
    const out = { ...link, state, title: pr.title, createdAt: pr.created_at, sha: pr.merge_commit_sha };
    if (state === 'merged' && pr.merge_commit_sha) {
      const tag = await latestRelease(link.repo);
      if (tag && await inTag(`${link.repo} ${tag} ${pr.merge_commit_sha}`)) out.release = tag;
    }
    return out;
  }
  return { resolve, latestRelease };
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// PBS-Java often ships a port of a PBS-Go adapter first, without the docs PR linking it. For a "Pending PBS Release"
// PR with an unreleased PBS-Go link and no PBS-Java link, look for merged PBS-Java PRs whose title names a bidder
// whose page this PR changes. Advisory only: it can lead to a "partial" note, never to the ready label.
async function inferJava(gh, lookups, { number, labels, links }) {
  if (!labels.includes('Pending PBS Release')) return [];
  if (links.some(l => l.repo === 'prebid/prebid-server-java')) return [];
  const goPending = links.filter(l => l.repo === 'prebid/prebid-server' && l.state !== 'closed' && l.state !== 'missing' && !l.release);
  if (!goPending.length) return [];
  const files = await gh.paginate(`/repos/${process.env.GITHUB_REPOSITORY || 'prebid/prebid.github.io'}/pulls/${number}/files`);
  const codes = [...new Set(files.map(f => (f.filename.match(/^dev-docs\/bidders\/([\w-]+)\.md$/) || [])[1]).filter(Boolean))].slice(0, 3);
  const since = new Date(Math.min(...goPending.map(l => Date.parse(l.createdAt) || Date.now())) - 180 * 864e5);
  const found = [];
  for (const code of codes) {
    await sleep(2500); // the search API allows 30 requests a minute
    const q = encodeURIComponent(`repo:prebid/prebid-server-java is:pr is:merged in:title ${code}`);
    const result = await gh.get(`/search/issues?q=${q}&per_page=10`);
    const word = new RegExp(`(^|[^a-z0-9])${code.replace(/[-]/g, '[- ]?')}($|[^a-z0-9])`, 'i');
    for (const item of (result && result.items) || []) {
      if (!word.test(item.title) || Date.parse(item.created_at) < since) continue;
      found.push({ ...(await lookups.resolve({ repo: 'prebid/prebid-server-java', number: item.number })), query: code, source: 'search' });
    }
  }
  return found;
}

// ---- Main

const STATUS_TEXT = {
  released: 'all code released',
  partial: 'partly released',
  waiting: 'waiting for release',
  closed: 'code PR closed unmerged',
  'no-link': 'no code PR link',
  error: 'error',
};

async function main() {
  const repo = process.env.GITHUB_REPOSITORY || 'prebid/prebid.github.io';
  const botLogin = process.env.BOT_LOGIN || 'github-actions[bot]';
  const write = process.env.DRY_RUN === 'false' && process.env.GITHUB_ACTIONS === 'true';
  const gh = client(process.env.GITHUB_TOKEN);
  const lookups = makeLookups(gh);
  const log = msg => console.log(write ? msg : `[dry-run] ${msg}`);

  // Open PRs per pending label (the issues API lists PRs too; labels= is an AND, so one call per label).
  const prs = new Map();
  for (const label of PENDING_LABELS) {
    for (const issue of await gh.paginate(`/repos/${repo}/issues?state=open&labels=${encodeURIComponent(label)}`)) {
      if (issue.pull_request) prs.set(issue.number, issue);
    }
  }
  const only = (process.env.PR_NUMBERS || '').split(',').map(Number).filter(Boolean);
  const numbers = [...prs.keys()].filter(n => !only.length || only.includes(n)).sort((a, b) => b - a);

  let labelReady = false;
  const ensureLabel = async () => {
    if (labelReady) return;
    labelReady = true;
    if (await gh.get(`/repos/${repo}/labels/${encodeURIComponent(READY_LABEL.name)}`)) return;
    log(`create label "${READY_LABEL.name}"`);
    if (write) await gh.request('POST', `/repos/${repo}/labels`, READY_LABEL);
  };

  const rows = [];
  for (const number of numbers) {
    const issue = prs.get(number);
    const labels = issue.labels.map(l => l.name);
    const pendingLabels = labels.filter(l => PENDING_LABELS.includes(l));
    const row = { number, title: issue.title, pendingLabels, links: [], actions: [] };
    rows.push(row);
    try {
      const comments = await gh.paginate(`/repos/${repo}/issues/${number}/comments`);
      const timeline = await gh.paginate(`/repos/${repo}/issues/${number}/timeline`);
      const links = [];
      for (const link of collectLinks({ body: issue.body, comments, timeline, botLogin })) links.push(await lookups.resolve(link));
      const inferred = await inferJava(gh, lookups, { number, labels, links });
      const decision = decide(links, inferred);
      Object.assign(row, { links, inferred, status: decision.status });

      for (const c of commentActions(plannedComments(decision, pendingLabels), comments, botLogin)) {
        if (c.action === 'none') continue;
        row.actions.push(`${c.action} ${c.kind} comment`);
        log(`#${number}: ${c.action} ${c.kind} comment (key ${c.key})`);
        if (!write) continue;
        if (c.action === 'post') await gh.request('POST', `/repos/${repo}/issues/${number}/comments`, { body: c.body });
        else await gh.request('PATCH', `/repos/${repo}/issues/comments/${c.id}`, { body: c.body });
      }
      if (decision.status === 'released' && !labels.includes(READY_LABEL.name)) {
        await ensureLabel();
        row.actions.push(`add label "${READY_LABEL.name}"`);
        log(`#${number}: add label "${READY_LABEL.name}"`);
        if (write) await gh.request('POST', `/repos/${repo}/issues/${number}/labels`, { labels: [READY_LABEL.name] });
      }
    } catch (e) {
      row.status = 'error';
      row.actions.push(e.message);
      console.log(`::warning::#${number}: ${e.message}`);
    }
  }

  // ---- Report
  const linkText = l => {
    const state = l.state === 'merged' ? (l.release ? `released in ${l.release}` : 'merged, unreleased') : l.state;
    return `[${l.repo.replace('prebid/', '')}#${l.number}](https://github.com/${l.repo}/pull/${l.number}) ${state}` +
      (l.source === 'search' ? ' (found by search)' : '');
  };
  const cell = s => String(s).replace(/\|/g, '\\|');
  const counts = {};
  rows.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1; });
  const summary = [
    `## Pending release check${write ? '' : ' (dry run)'}`,
    '',
    `${rows.length} open PRs with a pending-release label: ` +
      Object.entries(counts).map(([s, n]) => `${n} ${STATUS_TEXT[s] || s}`).join(', ') + '.',
    '',
    '| PR | Label | Status | Code PRs | Action |',
    '| --- | --- | --- | --- | --- |',
    ...rows.map(r => `| #${r.number} ${cell(r.title)} | ${r.pendingLabels.join(', ')} | ${STATUS_TEXT[r.status] || r.status} | ` +
      `${[...r.links, ...(r.inferred || [])].map(linkText).join('<br>') || '-'} | ` +
      `${cell(r.actions.map(a => (write ? a : `would ${a}`)).join('; ') || '-')} |`),
    '',
    `${gh.calls()} API requests.`,
  ].join('\n');
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + '\n');
  console.log(summary);
}

module.exports = { parseLinks, crossReferences, collectLinks, decide, plannedComments, commentActions, semverKey, READY_LABEL, PENDING_LABELS };

if (require.main === module) {
  main().catch(e => {
    console.error(e);
    process.exit(1);
  });
}
