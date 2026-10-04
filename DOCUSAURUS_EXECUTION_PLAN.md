# Docusaurus adoption and migration execution plan

Status: execution underway, October 4, 2026. The Docusaurus 3.10.2 upgrade and
M0/M1 foundation are merged into `docusaurus` through
[PR #6785](https://github.com/prebid/prebid.github.io/pull/6785) and
[PR #6786](https://github.com/prebid/prebid.github.io/pull/6786), at `6a64af8`.
The [M0 evidence](migration/M0_BASELINE.md) and
[M1 validation](migration/M1_VALIDATION.md) retain their historical identities.
The [bounded M2 pilot](migration/M2_PILOT.md) is implemented and locally verified;
full M2 acceptance remains open on metadata authority, consumer validation, and
the explicitly listed integration checks. M3 and later remain unimplemented.

The [pre-implementation audit](DOCUSAURUS_PLAN_AUDIT.md) records the October 4
discovery pass, its evidence, the corrections incorporated here, and its limits.

## Purpose and document ownership

Complete the framework adoption with reproducible validation, preserve the
meaning of the documentation, and prepare a separately controlled production
cutover. These are two different completion claims:

* **Track A: framework and migration foundation.** Runtime, CI, validation,
  converter safety, metadata/layout fidelity, and measured build optimizations.
* **Track B: production migration.** Current production content, remaining
  features, final URLs/versioning/search, deployment, and rollback.

Use this document for the current proposed sequence and acceptance criteria.
[DOCUSAURUS_UPGRADE.md](DOCUSAURUS_UPGRADE.md) records the upgrade assessment.
[MIGRATION_PLAN.md](MIGRATION_PLAN.md),
[MIGRATION_TRACKING.md](MIGRATION_TRACKING.md), and
[MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md) remain preserved historical records.
Their old counts, completed-phase labels, and next-step statements are not
current verification. Policy differences are recorded below, not silently erased.

Before executing a milestone, name its implementation owner and reviewer in its
issue or PR. Documentation/product decisions need a documentation maintainer;
deployment needs a maintainer with the relevant hosting authority. No individuals
are assigned by this plan. Each completion record must link the exact commit,
checks, artifacts, remaining exceptions, and next dependency.

## Starting evidence and limits

The upstream migration base is `ca35845fab8072d48c7a8ef39a125dca97b79366`.
The local branch is `codex/docusaurus-3.10.2`. At the initial planning snapshot its
package/configuration upgrade and documentation were uncommitted. They were then
checkpointed at `7a164dbc02f481c2dbca01e0d000bf10bed6903d`; M0 binds that control
tree and lockfile to its retained build and source inventories.

| Observation | Verified state at this snapshot |
| --- | --- |
| Docusaurus | Five directly declared packages pinned to 3.10.2 |
| Local installation/build | Clean locked install and production build passed on Node 24.18.0 / npm 11.16.0 |
| Build inventory | 1,254 route keys; 1,239 emitted HTML files |
| Link inventory | 581 broken link references and 100 broken anchor references; exact source/target pairs unchanged by the package upgrade |
| Existing source typecheck | Scoped check selects 19 Docusaurus source/configuration files and passes |
| Strict source typecheck | Three diagnostics: plugin/options typing and an implicit-any configuration callback |
| Repository-wide typecheck | Same 15 legacy JavaScript syntax errors before and after the package upgrade |
| Content placeholders | 22 `IncludeTodo` uses across 21 documentation files |
| Dependency audit | 48 affected-package entries after upgrade, down from 63; not a measured count of exploitable production vulnerabilities |
| Production-content divergence | 517 commits behind the inspected `master` snapshot, `b16d95ac1ee95238c070bc9f137d52718287d1cc`; refresh before reconciliation |
| Runtime proof limits | No fresh Linux CI install, Faster trial, full-history timestamp comparison, exhaustive content/browser audit, or production cutover |

The initial audit checkout was shallow and its receipts were temporary. M0 now
uses full history and retained repository evidence; see its report for updated
scope. The original 3.9.2 build used a different Node version, so its timing is
not a valid performance control for the next trial.

Specific evidence changes the work priorities:

* The [old bidder layout](_layouts/bidder.html) rendered availability notices,
  Features, and targeting keys automatically. Built AppNexus content lacks the
  Features section; Bidsxchange's source records removal in 8.13.0 but the built
  page omits that notice. The earlier AdDefend smoke check exercised the one
  current bidder source that explicitly invokes `BidderFeatures`.
* The [bidder plugin](_plugins/toc-plugin.ts) writes JSON into tracked source and
  processes only `current`. Cache staleness has not been demonstrated, but
  freshness and version separation need explicit tests before relying on caching.
* The historical converter performed substitutions across fenced examples and
  checked conflicts before selecting the final `.mdx` name. M2 retires that writer
  and tests a bounded replacement in staging; broader conversion remains gated.
* The [introduction](docs/content/intro.mdx) renders an image at an absent
  `/assets/images/...` path although its `/images/...` counterpart exists.
  Route/link counts alone do not establish asset or content parity.
* `static/bidder-data.csv` is still a Jekyll template. The inspected build copies
  its 2,865 bytes and 80 Liquid tags unchanged to `build/bidder-data.csv`, while
  documentation also links absent CSV paths. Downloadable data needs semantic
  validation; a successful response or matching file hash is not enough.

## Scope and decision register

The recommended defaults below are proposals. Open decisions block their named
dependent work; they do not block unrelated runtime, validation, or fixture work.

| ID | Decision and proposed default | Resolve before |
| --- | --- | --- |
| D1 | **Production-content authority:** reconcile against a newly pinned `master` snapshot, preserving later upstream changes in a reconciliation ledger; do not treat the stale migration copy as current content authority. | M0 inventory and each M5 content batch |
| D2 | **URL compatibility:** inventory old-to-new public URLs and propose preserving them through routes or redirects. The old plan explicitly waived developer-URL preservation; that waiver has not been reconfirmed here. Record redirects, deliberate retirements, and any accepted breakage; include fragment IDs and downloadable files. | Route-affecting M2/M3 contracts; final confirmation at M5/M7 |
| D3 | **Version policy:** preserve current plugin boundaries during foundation work. Propose a useful current-documentation default and defer historical backfill. Decide how to retire/reclassify the `0.0.1` sample, and whether Java/Go or iOS/Android need independent version histories. | Route-affecting M2 contracts and M3 versioned manifests; final confirmation at M5 |
| D4 | **Search and exclusions:** retain the recorded exclusions of Algolia and consentmanager provisionally. Resolve whether replacement search is a launch requirement and select its implementation separately. Docusaurus support for DocSearch/AskAI is not authorization to adopt either. Consent documentation is distinct from an excluded site integration. | M6 search and M7 launch criteria |
| D5 | **Download behavior:** preserve the current maintained service contract; inventory endpoints, saved configuration, aliases/filenames, release eligibility, minimum versions, and errors. Legacy notes mention Firebase, while existing JavaScript calls `js-download.prebid.org`; do not infer a backend replacement requirement. | Read-only discovery/fixtures at M0/M2, before accepting the shared M3 contract; UI/integration at M6 |
| D6 | **Deployment and release ownership:** confirm hosting workflow, domain handling, preview isolation, release owner, observation period, and previous-release restoration procedure. Choose host-dependent URL behavior early without publishing anything. | Hosting/route capability check before route-affecting M2/M3 contracts; deployment authority and rehearsal at M7 |
| D7 | **Compatibility and performance budgets:** retain existing browser targets initially; choose test browsers, memory/time limits, and acceptable regression thresholds after the M0 control run and before the Faster trial. | M4 adoption decision |
| D8 | **Reconciliation mechanism:** compare updating the converted tree with regenerating into isolated staging from pinned production sources plus explicit reviewed migration overrides. Retain reusable framework/components in either case; select by replay correctness and measured review effort, not an assumed rewrite or merge advantage. | Bounded M2 pilot acceptance before broad M3b/M5 work |

Out of the initial implementation batch: public deployment, wholesale redesign,
blanket `future.v4: true`, React/TypeScript major upgrades, historical-version
backfill, a new download backend, and new paid search/AI services. They are not
prerequisites for the framework foundation. Review the existing dependency
advisories as a separate bounded maintenance change.

## Milestones and dependency order

Start M1 once M0 has pinned the source and reproduced the control build; the broader
reference inventory can continue in parallel. M2 contract/fixture work can overlap
M1, but M2 acceptance requires the M1 runner and the bounded D8 replay pilot.
M3 depends on M1 and the metadata/conversion contracts from M2. Adopt Faster at M4
after M1 and the generated-data checks in M3a, although an isolated baseline
experiment can run earlier. Broader layout restoration in M3b
can continue alongside that trial and must finish for its relevant M5/M6 content
scope. M7 is a separate release milestone.

### M0 — Establish a reproducible baseline and coverage inventory

Local results and remaining hosted-evidence requirements are recorded in
[M0_BASELINE.md](migration/M0_BASELINE.md). The following criteria remain the
contract; local capture does not imply hosted CI or semantic fidelity passed.

* Record source SHA, local diff, lock digest, toolchain, full-history strategy,
  environment, selected inputs, commands, results, and artifact checksums.
  Include relevant untracked files in the source manifest; a Git diff alone does
  not identify all build inputs. Trusted release evidence uses reviewed commits.
* Reproduce the 3.10.2 control build on the intended runtime. Capture route keys,
  HTML files, source/target warning pairs, assets, document metadata, and sample
  rendered content. Keep missing-asset findings separate from Docusaurus warnings.
* Enumerate every legacy layout/include and its generated behavior. Build a
  source-to-destination ledger with states: migrated and verified, moved but
  incomplete, not migrated, deliberately retired, or deferred with a reason.
  Include generated CSV/JSON/downloads and their public URLs, not just HTML pages.
* Capture the production source snapshot and identify post-fork additions,
  modifications, deletions, and renames. Record a resynchronization process.
* Inventory the D5 consumer contract now, using maintained source/service
  documentation and captured fixtures. Include alias/filename overrides,
  release-dependent availability, minimum versions, saved configuration, and
  generated data files. Live integration remains an M6 task.
* Store reusable checks/fixtures in the repository and publish run receipts as
  retained CI artifacts. A temporary local path or a prose count is insufficient.

Use two different baselines: the existing Docusaurus build for detecting framework
regressions, and an independent legacy-content reference for judging migration
fidelity. A ledger entry becomes verified only when it links pinned source plus
its layout/include dependencies and independently reviewed expected semantic facts.
Obtain bounded legacy rendered specimens where practical; otherwise record facts
directly from pinned source/templates and mark unverified rendering explicitly.
Do not derive the expectations with the same converter/normalizer being tested or
declare today's incomplete Docusaurus output to be the fidelity reference. Cover
meaningful text, code, notices, values, links/IDs, and downloadable records. Keep
intentional corrections distinct from parity, with their reasons recorded.

**Exit:** nonempty, reproducible inventories; named coverage gaps; source snapshot
and artifact identities bound together. No existing warning is silently accepted
as launch-ready. Re-estimate work after this inventory rather than treating the
earlier rough 4–8 engineer-week range as a delivery commitment.

### M1 — Runtime, CI, and authored-content validation

Implementation and commands: [M1 validation guide](migration/M1_VALIDATION.md).
Exact execution receipts and PR checks determine acceptance; existing warning
inventories remain migration work, and notification-only CI does not prove a
Docusaurus build ran.

* Pin a supported Node 24 release and npm policy across developer setup, engines,
  CI, and the devcontainer. Validate a fresh locked Linux installation as well as
  the local macOS setup. Define dependency lifecycle-script handling explicitly.
* Add a Docusaurus PR build for the relevant branches, with read-only permissions
  and no notification/deployment secrets available to PR build steps.
  Treat MDX/plugin code from PRs as executable untrusted input: never build a PR
  head under a privileged `pull_request_target` job. Isolate its cache/artifact
  writes from trusted release work; release candidates use the reviewed source
  and a trusted cache or a clean build, not arbitrary PR-produced output.
* Give notification tooling its own locked dependency installation and narrowly
  scoped secrets; changing its Node version alone does not fix its unpinned install.
* Add a permanent Docusaurus-scoped `typecheck`, fix the three strict diagnostics,
  and adopt `strict: true` for that scope. Track legacy JavaScript separately.
* Add MDX-aware authoring validation covering both `.md` and `.mdx`, with a runner
  for syntax and formatting checks. Domain-metadata/component validators join
  this runner after M2 defines their contracts; source typechecking cannot replace
  them.
* Turn currently ignored Markdown-link diagnostics into an observable inventory
  before fixing its baseline. Existing 581/100 counts are not that full inventory.
* Test the initial guards with known failures: a broken internal link, missing
  asset, and a bad source type. Require failure and nonempty input coverage.
  Add a semantic control after M2: remove a required notice while preserving a
  valid page and route. Its content check must fail even if compilation and link
  checking remain green.

**Exit:** fresh Linux installation, scoped strict types, authored-content checks,
and build pass; deliberately broken fixtures fail. Warning comparisons reject new
source/target failures, not merely higher aggregate counts. Any broader inventory
must be versioned with its detector and reviewed rather than silently rebaselined.

### M2 — Converter safety and the content contract

The [bounded pilot receipt and open gates](migration/M2_PILOT.md) are the current
checkpoint. It selects staged regeneration for reviewed source-owned outputs
with explicit repairs and manual reconciliation of existing migration work.
Both controlled replay methods passed; this is not authority for a wholesale
restart or full M2 acceptance. The field-policy decisions remain unresolved.

* Specify preserved behavior for frontmatter, headings/IDs, tables, warnings,
  includes, code examples, raw HTML, links, images, and format-specific syntax.
* Separate pure transformations from filesystem/Git operations. Protect fenced
  blocks and inline code; test real legacy examples containing Liquid and URLs.
* Validate the final output extension and destination before any move/write.
  Exercise conflict, dry-run, repeated-run, and interrupted-batch recovery cases.
  Use argument-array Git calls rather than shell-interpolated paths, constrain
  writes to the selected staging/output roots, and test unusual filenames and
  path/symlink escapes without executing an attack against the working tree.
* Emit current admonition syntax. Use MDX comments/heading IDs only where the
  selected parser supports them; preserve the actual existing anchor IDs.
* Define normalized bidder/module metadata, including legacy string/array forms,
  alias/removal fields, numeric IDs, unknown versus false, and unsupported fields.
  Preserve provenance and report unsupported data instead of dropping it.
  Start with the observed fields and consumer projections, not a general content
  platform. A small field-policy table records raw forms, missing/false/unknown
  meanings, legacy rendering, chosen value, and behavior per consumer. Resolve
  conflicting meanings with documentation maintainers: legacy templates, the
  contributor guide, and current React defaults already disagree on some omitted
  support flags. Include `no-display` and the `gpp_supported`/`gpp_sids` fallback.
* Implement domain-metadata/component validators against that contract in the M1
  runner. Include malformed-data and invalid MDX component-use controls.

Before scaling conversion, run one bounded end-to-end pilot for D8. Select a small
representative slice: an upstream-changed bidder, removed/aliased bidder, an
include-heavy module, a Mobile MDX page, a code example, and a generated CSV.
Compare continued reconciliation and regeneration into isolated staging. Apply
two pinned source snapshots, preserve a deliberate migration-only repair, change
a shared include, and exercise additions, renames, and deletions. Use independently
expected results, record conflicts/reviewer effort, and prove obsolete output is
removed. Repeatability on unchanged input alone does not prove synchronization.
Choose the mechanism from this evidence and retain reusable work; do not restart
already converted sections wholesale or require a generic generator in advance.

**Exit:** fixtures prove content/code preservation and destination safety; parser
behavior is checked for both `.md` and `.mdx`; invalid metadata/component cases
fail; the D5 consumer fixtures fit the contract; the D8 replay pilot selects a
workable reconciliation mechanism. Skipped/manual files remain explicit ledger
entries. The converter cannot claim success from an empty selection.

### M3 — Generated data and layout fidelity

**M3a: generated-data correctness required before cached adoption.**

* Generate deterministic manifests keyed by documentation instance and version.
  Prefer Docusaurus-generated data APIs over rewriting tracked source files.
* Use one normalized metadata contract for rendering, indexes, and download
  selection, with distinct consumer rules; data presence does not imply a feature
  should be advertised or an unavailable adapter should become downloadable.
* Generate downloadable data, including the bidder CSV, as explicit consumers.
  Verify public path, headers/schema, nonempty record population, independently
  expected representative cells, escaping, and add/change/delete freshness.
  Reject unrendered frontmatter/Liquid in data payloads; file presence and HTTP
  success do not establish valid content.
* Validate current generated consumers and their version boundaries, including
  unchanged-input source cleanliness and changed-input freshness.

**M3a exit:** manifest/consumer checks pass and instance/version data remain
separate. Known layout omissions stay in the coverage ledger and are not cleared
by this result. This permits the M4 comparison without waiting for every legacy
layout to be restored.

**M3b: restore automatic layout content for the relevant migration batches.**

* Restore bidder Features, unavailable/server-only notices, alias/former-code
  information, and targeting keys through shared page behavior. Inventory and
  restore equivalent automatic output for other legacy layouts.
* Validate representative rendered cases: AdDefend, AppNexus, Bidsxchange,
  server-only adapters, aliases, optional/unknown metadata, and multiple versions.
* Check actual MDX component use and normalized data, not only `.tsx` files.
* Update contributor templates/guides and applicable agent instructions with the
  contract change. Exercise a synthetic new adapter through the documented steps:
  source file, validation, preview, detail page, index, CSV, and correct download
  eligibility. Preserve the existing relationship between actual adapter release
  and documentation/download availability; the fixture must not trigger a release.

**M3b exit:** expected notices/tables/values render and agree with authoritative
frontmatter. Intentional content restoration updates the coverage ledger without
being mistaken for a framework regression. Finish this work before accepting its
content scope at M5/M6, rather than making all layout work a prerequisite to M4.

### M4 — Controlled Faster adoption and storage configuration

* Pin `@docusaurus/faster` to the same Docusaurus version. Introduce explicit flags
  in stages: metadata/shared MDX work, bundling/minification, then persistent cache
  and optional static-generation workers. Keep a working conventional build path.
* For `gitEagerVcs`, compare dates/authors against full Git history and validate
  sitemap timestamps. The shallow assessment checkout cannot prove equivalence.
* Persist Rspack's build cache separately from the npm download cache. Key it by
  relevant toolchain/platform/lock/config inputs and test invalidation explicitly.
* Compare cold, warm, edit, rename, delete, and restored-input builds. Bidder data,
  imported partials, configuration, and assets must update in cached output.
* Worker threads require `future.v4.removeLegacyPostBuildHeadAttribute: true`;
  audit post-build consumers and metadata first, or leave workers disabled.
  Persistent caching requires the Rspack bundler. Do not enable all v4 flags.
* Use the same source, runtime, machine/resource limits, and dependency policy for
  timing controls; repeat timing-sensitive comparisons at least five times per
  cache state. Report median/range and memory use, not a single favorable run.
* Set a stable storage namespace deliberately. Automatic naming uses configured
  `url + baseUrl`, not the branch name; define preview behavior and test any
  preference reset/migration separately from build performance.

**Exit:** measurable benefit within D7 budgets; identical required route/content/
metadata behavior; no stale artifacts after changes; representative browser checks
pass. If a flag fails or its benefit is unproven, retain the conventional path.

### M5 — Reconcile production content and complete migration batches

* Resolve D1–D3 before final routing. Inventory legacy URLs, redirects/retirements,
  canonical URLs, version dropdown destinations, edit links, and sitemap entries.
  Confirm the earlier D6 host-capability check: explicitly choose trailing-slash
  behavior and test `.html` URLs, fragments, query strings, asset/download paths,
  direct navigation, and refresh. Local client navigation is not hosting proof.
* Migrate small content batches using the hardened converter and manual cases.
  Include content generated by layouts, not just file bodies or route existence.
* Reconcile current `master` changes throughout the effort. Recheck the source SHA
  before each batch and before launch; document collisions and reviewer decisions.
  Use the D8 mechanism and record the last synchronized production SHA. Before
  release, agree a short content hold or final-delta replay and where new
  contributions land; after rollback, replay any intervening accepted edits.
* Replace placeholders and deferred dynamic indexes. Each batch updates the
  coverage ledger and reduces known failures without introducing new ones.

**Exit:** every in-scope source has a verified destination or an explicitly recorded
retirement; production updates are accounted for; selected URL/version policy is
implemented and tested. Previously moved Mobile content is reviewed, not restarted.

### M6 — Product behavior and documentation experience

* Port the download UI against the confirmed D5 contract, including version/module
  eligibility, saved configuration, aliases/removals, service errors, and download
  results. Use fixtures first, then an agreed integration-test environment.
* Implement the D4 search decision and test useful queries, version filtering,
  missing results, and navigation. Do not add excluded services implicitly.
* Complete homepage/navigation, missing media/examples, and shared Tabs/DocCards
  where reuse improves authoring. Keep visual redesign and optional live-code/AI
  features outside the core parity requirement.
* Check images and asset requests, keyboard dropdowns, tab behavior, focus,
  mobile layout, light/dark contrast, and Firefox code selection/copy. Check
  authored notices and values in rendered output, not just screenshots or counts.

**Exit:** agreed user journeys work in the selected browser matrix; no placeholders
or unexplained missing content remain in launch scope; functional service and
search evidence are distinguished from mocked checks.

### M7 — Production rehearsal, cutover, and rollback

* Resolve D6. Create a staging preview and confirm indexing policy, canonical
  domain, redirects, direct deep-link requests, 404s, sitemap, and custom-domain
  handling. Root `CNAME` currently is not copied into `build`; choose the mechanism
  appropriate to the deployment method rather than assuming it is preserved.
* Make link/anchor/asset failures blocking for launch scope. Any accepted exception
  needs an exact target, reason, owner, and review date; it must not hide broad
  missing sections behind a warning-only build.
* Capture the final production-content SHA and the exact deployable artifact.
  Retain the prior Jekyll release and hosting configuration before switching.
  Build the production candidate once from reviewed source/configuration, package
  it with checksums, test that package, and promote that exact package. A source,
  dependency, environment, or configuration change creates a new candidate and
  requires relevant validation; do not silently rebuild during deployment.
* Use a protected deploy job with the required narrow hosting permissions and a
  dependency on successful trusted build/validation. Bind release and rollback
  records to artifact identities. Rehearse host-specific domain/redirect behavior
  without changing production or exposing its credentials to PR preview code.
  If preview needs different build-time settings, label it a separate artifact
  and validate the production candidate independently before promotion.
* Rehearse deployment and restoration. Specify who executes them, smoke checks,
  rollback triggers, observation duration, and how in-flight content changes are
  handled. Keep review/CI success separate from actual deployment evidence.

**Exit:** the intended artifact is verified at the public domain, critical journeys
and compatibility checks pass, and the observation/rollback owner has the retained
release. Public publication is a separate release action, not part of plan writing.

## Change boundaries, evidence, and stopping conditions

Keep reviewable changes separate: existing framework upgrade; runtime/validation;
converter fixtures; metadata/layout restoration; Faster experiments; individual
content batches; product features; deployment. Avoid mixing a large content move
with a dependency or bundler switch that would obscure the cause of a regression.

For every implementation change, record the hypothesis, expected affected outputs,
commands/input counts, comparison result, exceptions, and rollback. Re-run relevant
checks after source/lock changes; replace stale receipts with evidence for the new
tree. Do not edit expected results merely to make a check pass.

Stop a batch when source content would be overwritten, coverage unexpectedly
shrinks, generated output becomes stale, required metadata changes unexpectedly
or outside its recorded contract, or the pinned input snapshot changes underneath
reconciliation. New upstream commits enter the reconciliation ledger; they do
not invalidate work against an unchanged pinned input. Preserve the failing case.
Revert the bounded change or disable the relevant performance flag while
diagnosing; do not delete the prior implementation or waive the failing check.

The first proposed implementation batch is M0–M1. M2 can follow with fixtures;
M3a precedes adopting cached generated-data behavior. Later policy decisions can
be resolved at their dependency points. This bounds the next step without turning
all remaining production work into one oversized change.

## Primary framework references

* [Docusaurus 3.10 release notes](https://docusaurus.io/blog/releases/3.10)
* [Docusaurus configuration and Faster flag requirements](https://docusaurus.io/docs/api/docusaurus-config#future)
* [Stable storage configuration](https://docusaurus.io/docs/api/docusaurus-config#storage)
* [Admonition syntax](https://docusaurus.io/docs/markdown-features/admonitions)
* [Plugin lifecycle APIs](https://docusaurus.io/docs/api/plugin-methods/lifecycle-apis)
* [Docusaurus hosting and URL behavior](https://docusaurus.io/docs/deployment)
* [GitHub Pages artifact workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
