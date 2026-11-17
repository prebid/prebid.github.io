// Unit tests for pending-release-check.js: node --test .github/scripts/pending-release-check.test.js
const test = require('node:test');
const assert = require('node:assert');
const { parseLinks, crossReferences, collectLinks, decide, plannedComments, commentActions, readyLabelAction, semverKey } = require('./pending-release-check.js');

const refs = links => links.map(l => `${l.repo}#${l.number}`);

test('parseLinks: URLs and short forms, canonical repo names, de-duplicated', () => {
  const text = [
    'Related: https://github.com/prebid/prebid-server/pull/4801',
    'and https://github.com/prebid/prebid-server-java/pull/4528/files.',
    'Also prebid/Prebid.js#15661, prebid/prebid.js#15661 (same PR), prebid/prebid-server#4801 (same as above)',
    'mobile: https://github.com/prebid/prebid-mobile-ios/pull/12 and prebid/prebid-mobile-android#34',
  ].join('\n');
  assert.deepStrictEqual(refs(parseLinks(text)), [
    'prebid/prebid-server#4801',
    'prebid/prebid-server-java#4528',
    'prebid/prebid-mobile-ios#12',
    'prebid/Prebid.js#15661',
    'prebid/prebid-mobile-android#34',
  ]);
});

test('parseLinks: ignores issues, the docs repo, other orgs and other repos', () => {
  const text = [
    'https://github.com/prebid/Prebid.js/issues/123',
    'https://github.com/prebid/prebid.github.io/pull/6588',
    'prebid/prebid.github.io#6588',
    'https://github.com/someone/prebid-server/pull/1',
    'notprebid/prebid-server#5',
    'https://github.com/prebid/prebid-server-docs/pull/9',
    '#4801',
  ].join('\n');
  assert.deepStrictEqual(parseLinks(text), []);
  assert.deepStrictEqual(parseLinks(undefined), []);
  // hidden hints such as the PR template's example link
  assert.deepStrictEqual(parseLinks('Related code PR(s): <!-- e.g. https://github.com/prebid/prebid-server/pull/1234 -->'), []);
  assert.deepStrictEqual(refs(parseLinks('<!-- prebid/Prebid.js#1 --> prebid/Prebid.js#2')), ['prebid/Prebid.js#2']);
});

test('crossReferences: only PRs from code repos', () => {
  const pr = (repo, number, isPr = true, owner = 'prebid') => ({
    event: 'cross-referenced',
    source: { issue: { number, repository: { name: repo, full_name: `${owner}/${repo}` }, ...(isPr ? { pull_request: {} } : {}) } },
  });
  const timeline = [pr('prebid-server', 4766), pr('Prebid.js', 1, false), pr('prebid.github.io', 6000), pr('prebid-server', 7, true, 'someone'), { event: 'labeled' }];
  assert.deepStrictEqual(refs(crossReferences(timeline)), ['prebid/prebid-server#4766']);
});

test('collectLinks: skips bot comments and this check\'s own comments', () => {
  const links = collectLinks({
    body: 'https://github.com/prebid/prebid-server/pull/1',
    comments: [
      { body: 'Java port: prebid/prebid-server-java#2', user: { login: 'dev', type: 'User' } },
      { body: '<!-- pending-release-check:partial key=x -->\nprebid/Prebid.js#3', user: { login: 'someone', type: 'User' } },
      { body: 'preview prebid/Prebid.js#4', user: { login: 'netlify[bot]', type: 'Bot' } },
    ],
    timeline: [{ event: 'cross-referenced', source: { issue: { number: 1, pull_request: {}, repository: { name: 'prebid-server', full_name: 'prebid/prebid-server' } } } }],
    botLogin: 'github-actions[bot]',
  });
  assert.deepStrictEqual(links.map(l => `${l.repo}#${l.number} ${l.source}`), [
    'prebid/prebid-server#1 description',
    'prebid/prebid-server-java#2 comment',
  ]);
});

const go = (state, release) => ({ repo: 'prebid/prebid-server', number: 4801, state, release });
const java = (state, release) => ({ repo: 'prebid/prebid-server-java', number: 4528, state, release });

test('decide: statuses', () => {
  assert.strictEqual(decide([]).status, 'no-link');
  assert.strictEqual(decide([{ ...go('missing') }]).status, 'no-link');
  assert.strictEqual(decide([go('open')]).status, 'waiting');
  assert.strictEqual(decide([go('merged')]).status, 'waiting'); // merged, not released yet
  assert.strictEqual(decide([go('merged', 'v4.11.1')]).status, 'released');
  assert.strictEqual(decide([go('merged', 'v4.11.1'), java('merged', '4.5.0')]).status, 'released');
  assert.strictEqual(decide([go('open'), java('merged', '4.5.0')]).status, 'partial');
  assert.strictEqual(decide([go('closed')]).status, 'closed');
});

test('decide: a closed PR replaced by another PR in the same repo is not flagged', () => {
  const replaced = { ...go('closed'), number: 4700 };
  const d = decide([replaced, go('merged', 'v4.11.1')]);
  assert.strictEqual(d.status, 'released');
  assert.deepStrictEqual(d.closed, []);
  // ...but a closed PR with no replacement is, even when other code has shipped
  const d2 = decide([go('closed'), java('merged', '4.5.0')]);
  assert.strictEqual(d2.status, 'released');
  assert.strictEqual(d2.closed.length, 1);
});

test('decide: an inferred PBS-Java release makes a waiting PR partial, never released', () => {
  assert.strictEqual(decide([go('open')], [{ ...java('merged', '4.5.0'), query: 'sevio' }]).status, 'partial');
  assert.strictEqual(decide([go('open')], [{ ...java('merged') }]).status, 'waiting');
  assert.strictEqual(decide([], [{ ...java('merged', '4.5.0') }]).status, 'no-link');
});

test('plannedComments: one comment per kind, keyed by the PRs involved', () => {
  // editOnly comments (withdrawing an earlier "released" one) are never posted on their own
  const posted = (...args) => plannedComments(...args).filter(c => !c.editOnly);
  const released = plannedComments(decide([go('merged', 'v4.11.1')]), ['Pending PBS Release']);
  assert.deepStrictEqual(released.map(c => [c.kind, c.key]), [['released', 'prebid/prebid-server#4801']]);
  assert.match(released[0].body, /^<!-- pending-release-check:released key=prebid\/prebid-server#4801 -->/);
  assert.match(released[0].body, /release v4\.11\.1/);

  const partial = posted(decide([go('open'), java('merged', '4.5.0')]), ['Pending PBS Release']);
  assert.deepStrictEqual(partial.map(c => c.kind), ['partial']);
  assert.match(partial[0].body, /prebid\/prebid-server-java#4528 \(PBS-Java\): merged, and included in release 4\.5\.0/);
  assert.match(partial[0].body, /prebid\/prebid-server#4801 \(PBS-Go\): still open/);
  assert.match(partial[0].body, /only one of PBS-Go and PBS-Java/);
  const pbjs = { repo: 'prebid/Prebid.js', number: 1, state: 'merged', release: '11.51.0' };
  const [mixed] = posted(decide([go('open'), pbjs]), []);
  assert.doesNotMatch(mixed.body, /only one of PBS-Go and PBS-Java/);

  assert.deepStrictEqual(posted(decide([go('closed')]), []).map(c => c.kind), ['closed']);
  assert.deepStrictEqual(posted(decide([]), ['Pending PBS Release']).map(c => c.kind), ['no-link']);
  assert.deepStrictEqual(posted(decide([go('open')]), []), []);
});

test('commentActions: post once, edit when the key changes, otherwise nothing', () => {
  const bot = 'github-actions[bot]';
  const [planned] = plannedComments(decide([go('merged', 'v4.11.1')]), []);
  assert.strictEqual(commentActions([planned], [], bot)[0].action, 'post');
  const same = { id: 1, user: { login: bot }, body: planned.body };
  assert.strictEqual(commentActions([planned], [same], bot)[0].action, 'none');
  const stale = { id: 2, user: { login: bot }, body: '<!-- pending-release-check:released key=prebid/prebid-server#1 -->\nold' };
  assert.deepStrictEqual(commentActions([planned], [stale], bot).map(a => [a.action, a.id]), [['edit', 2]]);
  // someone else quoting the marker doesn't count as the check's comment
  const quoted = { id: 3, user: { login: 'dev' }, body: planned.body };
  assert.strictEqual(commentActions([planned], [quoted], bot)[0].action, 'post');
});

test('semverKey orders version tags numerically', () => {
  const tags = ['v4.9.0', 'v4.11.1', '3.0.0', 'v4.11.0'];
  assert.deepStrictEqual(tags.sort((a, b) => semverKey(b).localeCompare(semverKey(a))), ['v4.11.1', 'v4.11.0', 'v4.9.0', '3.0.0']);
});

test('readyLabelAction: added when released, removed when no longer released', () => {
  const ready = 'Ready to merge: code released';
  assert.strictEqual(readyLabelAction('released', ['Pending PBS Release']), 'add');
  assert.strictEqual(readyLabelAction('released', [ready]), null);
  assert.strictEqual(readyLabelAction('partial', [ready]), 'remove');
  assert.strictEqual(readyLabelAction('waiting', [ready]), 'remove');
  assert.strictEqual(readyLabelAction('waiting', []), null);
  assert.strictEqual(readyLabelAction('error', [ready]), null); // an API failure doesn't change anything
});

test('a released comment is edited, never posted, when the PR stops being released', () => {
  const bot = 'github-actions[bot]';
  const [released] = plannedComments(decide([go('merged', 'v4.11.1')]), []);
  const priorReleased = { id: 7, user: { login: bot }, body: released.body };
  // a new, still-open PBS-Java dependency: partial
  const later = plannedComments(decide([go('merged', 'v4.11.1'), java('open')]), []);
  const actions = commentActions(later, [priorReleased], bot);
  const withdraw = actions.find(a => a.kind === 'released');
  assert.deepStrictEqual([withdraw.action, withdraw.id], ['edit', 7]);
  assert.match(withdraw.body, /no longer ready/);
  assert.match(withdraw.body, /prebid-server-java#4528 \(PBS-Java\): still open/);
  assert.strictEqual(actions.find(a => a.kind === 'partial').action, 'post');
  // without an earlier released comment there is nothing to withdraw
  assert.strictEqual(commentActions(later, [], bot).find(a => a.kind === 'released').action, 'none');
  // unchanged on the next run
  const edited = { ...priorReleased, body: withdraw.body };
  assert.strictEqual(commentActions(later, [edited], bot).find(a => a.kind === 'released').action, 'none');
  // and back to released later: edited again
  assert.strictEqual(commentActions(plannedComments(decide([go('merged', 'v4.11.1'), java('merged', '4.6.0')]), []), [edited], bot)[0].action, 'edit');
});
