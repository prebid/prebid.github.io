# Migration context and lessons

Use this reference with the [execution plan](../DOCUSAURUS_EXECUTION_PLAN.md).
The [M0 baseline report](M0_BASELINE.md) records measured state; this file explains
the decisions that should survive a fresh session.

## Evidence boundaries

* A package upgrade, successful build, unchanged routes, source-backed reference,
  rendered parity, hosted CI, and production release are different claims.
  Preserve their separate receipts and do not promote one into another.
* Current Docusaurus output is the regression control, not the legacy-fidelity
  oracle. Old templates/includes generated notices, feature tables, targeting
  keys, example warnings, and CSV records outside Markdown bodies.
* A checksum establishes identity, not correctness or independent custody.
  Local checked-in receipts remain editable. Hosted artifacts and release records
  are separate future evidence, not implied by a local receipt directory.
* Inventory path matching is candidate discovery. `moved_unverified` and
  `unresolved_mapping` are not completion percentages or confirmed missing pages.
  Retained legacy files and ambiguous/renamed destinations need disposition.

## Lessons demonstrated by the M2 pilot

* Check the actual emitted files and their raw frontmatter, not a parallel
  semantic summary. Valid Markdown can lose every required notice or metadata
  field while compilation remains green. Bind post-compilation disk bytes too.
* Shared-source includes must be dependencies. An unchanged including page can
  change through its includes; hardcoded replacement prose hides that change.
  Specialized code-template adapters need reviewed source-hash preconditions.
* Protect exact code ranges before evaluating Liquid or rewriting syntax. Include
  whitespace-controlled captures and internal placeholder collisions in controls;
  an implementation marker can occur in a legitimate example.
* Apply confinement and ownership checks to every writer, including auxiliary
  assets/configuration. A guarded document writer does not protect later writes.
* Require each expected notice branch and the exact bounded CSV membership;
  aggregate counts, nonempty records, and selected-cell matches can hide omissions
  or unexpected additions.
* Independently authored expectations can still mishandle emphasis, inline HTML,
  admonition delimiters, or included code. Correct the oracle against original
  pinned source, retain negative controls, and never adjust it merely to fit output.
* A generated historical snapshot is a known replay base only for that generated
  lineage. Do not invent ancestry for the existing migrated tree. Keep controlled
  replay, existing-tree observations, and synthetic lifecycle events separate.
* Preserve raw metadata before choosing policy. Source-backed projections can
  expose real contradictions; valid preservation does not approve canonical
  meanings. The field table and remaining M2 gates are in [M2_PILOT.md](M2_PILOT.md).
* A standard Docusaurus component still needs rendered/browser checks. The pilot
  verifies both Tabs payloads/default in SSR, while hydration, keyboard use, and
  accessibility remain distinct follow-up evidence.

## Lessons demonstrated by M2 consumer checks

* A successful `npm install` or `npm ci` can still leave an incompatible optional
  peer. Verify the complete dependency tree with `npm ls --all` after lock changes
  and use a fresh installation. Satisfy the test tool's peer explicitly without
  overriding a framework dependency that requires a different exact version.

* Measure parser differences before normalizing fields. Bare YAML scalar spellings
  and duplicate keys have different handling in the strict migration parser and
  the documented legacy parser. Preserve raw bytes, input hashes, and separate
  counts; a partially parsed census is not a complete source population.
* Run the actual template expressions and browser handlers with controlled effects.
  Reimplementing their algorithms would miss ambient Liquid scope, minimum-version
  and rename interactions, alias identity, and stale closure state after imports.
  Offline DOM tests do not establish browser layout, transport encoding, or backend
  behavior; retain that distinction in every receipt.
* Validate component uses inside embedded ESTree as well as visible MDX nodes.
  JSX nested in expressions or attributes can otherwise bypass a source gate.
  Record checked call counts; recognize imported aliases and handle React's
  intrinsic key separately from component props.
* Check array density before treating nonempty length as nonempty content.
  JavaScript `every` skips sparse holes, so an apparently valid array can render
  zero items. Preserve a dense valid restoration control.
* A UI correction should leave producer metadata intact. The bidder-index fix
  changes its strict support predicate; it does not rewrite raw strings into
  guessed booleans or silently change CSV/download membership.
* Reproduce the original findings after repairs through actual rendered components
  and the authored-content runner. Shared contract code must be included in tool
  hashes/source-drift guards as well as unit tests.
* Keep recommendations, user/maintainer decisions, and executed behavior separate.
  The concrete open choices and corpus impact are in [M2_CONSUMERS.md](M2_CONSUMERS.md).

## Lessons demonstrated by M0 tooling review

* Control build environment and installation policy explicitly. Inherited
  Docusaurus skip flags can bypass bundling and reuse old output. The collector
  rejects those overrides instead of trusting a success banner.
* Warning parsers must fail on partial or changed formats, not merely when a whole
  section is unparsed. Preserve source/target identities and nonempty coverage.
* An HTML fallback is not a valid replacement for missing image/script/download
  bytes. Exact resource existence and page-route alternatives are separate checks.
* A copied CSV can still contain unrendered Liquid. Parse data payloads and use
  independently expected fields/records; file existence and HTTP 200 are insufficient.
* Reference hashes and code-capture bytes can be checked mechanically while field
  policies remain disputed. A null decision must not silently become a false value
  or a passing rendered-parity result.
* Keep control sources immutable during inventory. The bidder plugin writes JSON
  into its source tree during a build; capture from separate immutable source
  archives and bind the scanned file hashes to their Git commits.
* Apply output confinement at every writing entrypoint using resolved filesystem
  ancestors. A lexical outside path can point into an input tree through a symlink;
  a guard in the inventory does not protect the separate collector.
* Identify typed records independently of one required field, then require the
  complete record. Removing a capture's offset must cause failure rather than
  reducing the number of captures checked. Preserve historical receipt/tool
  identities when correcting a validator.

## Lessons demonstrated by M1 validation

* A failed frontmatter parse can poison the parser cache: a second identical
  malformed file may appear valid. Clear the exact default parser's cache before
  each parse and retain the repeated-input negative control.
* Warm MDX caches can skip diagnostic hooks. Clear caches for both sides, record
  observer execution, and compare identities/multiplicity rather than totals or
  line-number allowlists.
* Docusaurus resolves preset/plugin packages relative to its config directory.
  A diagnostic override must preserve that directory and URL behavior. Custom
  function hooks need semantic review before instrumentation.
* Source selection and emitted output retention are separate checks. A page or
  CSV disappearing must not count as a repaired warning. Intentional transitions
  need a reviewed policy rather than silently regenerated baselines.
* Rebuild the pinned PR base with the current detector. An old inventory lets
  fixed defects return; a current base comparison ratchets resolved findings.
* Snapshot candidate HEAD, index, tracked/nonignored input bytes, and tool bytes
  before the long baseline build. Recheck against that same snapshot before
  candidate capture and before the verdict, so intervening edits cannot acquire
  a false clean-checkout label. This is drift detection, not filesystem locking.
* A whole `node_modules` symlink makes cache clearing write into shared state.
  Build fixtures need private dependency/cache directories, with package-entry
  symlinks only. Type-only fixtures do not emit or clear caches.
* CI checks and receipts are distinct from branch protection and human review.
  Keep unprivileged PR builds separate from trusted-base notification execution;
  PR artifacts are not release artifacts.
* GitHub's implicit Linux shell does not enable pipeline failure propagation.
  Steps using `tee` need explicit `shell: bash` (or `pipefail`) and a control that
  makes the upstream command fail while the logger succeeds.
* Durations collected during overlapping local work are operational timings.
  Isolate performance comparisons and pin resource limits before attributing a
  speedup to Faster or another build change.

## Lessons from the pre-M2 review

* A clean Git status does not exclude ignored local build inputs. Acceptance
  builds use separate pinned checkouts; working-tree probes are explicitly weaker.
  Bind selected Markdown and selector inputs to the captured manifest as well.
* Inspect the framework's complete cleanup target set, including parent paths.
  Docusaurus can log a removal failure yet exit successfully, so require the
  targets to be absent before claiming a cold build.
* Treat NUL-delimited Git output as raw bytes/text. Trimming can collapse a leading
  whitespace filename into a different existing path and silently lose coverage.
* Resolve effective framework configuration rather than assuming that one locale
  means untranslated source, or that content plugins are always strings. Keep
  unsupported forms explicit instead of treating every unknown plugin as non-content.
* Partial compilation follows the imported file's loader, not its importer's
  options. Cross-root imports require a deliberate ownership/fallback adapter.
  Literal imports can also appear in nested expressions and JSX attributes.
* Validation identity is a head/base pair. Retargeting can change the base without
  changing the head, so subscribe to PR edits and recheck the recorded base before
  relying on a green result. A metadata-edit job skip is not a replacement check.
* Diagnostic instrumentation must preserve acceptance policy separately. Reporting
  everything as warnings is useful for inventory, but an original `throw` setting
  must still fail on existing defects even when no new identities were added.

## Source and consumer rules needing care

* The converter's unchanged-input repeatability is different from applying newer
  production snapshots. The planned replay pilot must preserve migration-only
  repairs while propagating updates, renames, deletes, and shared-include changes.
* `layout: bidder` remains a discovery dependency. Older agent instructions that
  stripped every layout were incorrect for this intermediate state.
* Do not derive a universal missing-value rule from React props. Legacy templates,
  contributor prose, CSV logic, and component defaults disagree on some fields.
  The [reference contract](REFERENCE_CONTRACT.md) retains those disputes.
* Download selection, CSV inclusion, page visibility, and release availability
  have distinct rules. Alias checkbox IDs, adapter filenames, module codes, saved
  configuration, and minimum-version handling require separate fixtures.
* Fresh production discovery may expose upstream quirks. Record observed behavior
  and a disputed correction separately; a migration is not permission to silently
  redesign the backend or reinterpret domain fields.

## Context maintenance

AGENTS.md is the durable instruction source; CLAUDE.md imports it. The earlier
CLAUDE content is preserved in the framework checkpoint's Git history. Its useful
constraints are represented by the shared guidance and plan; its volatile phase
counts, version claims, and stale broken-link policy are not active instructions.

When a later phase changes a contract or verifies a previously unexecuted claim,
update its receipt and the relevant reference section. Preserve old results as
dated evidence instead of silently rewriting their meaning. Do not accumulate
run-specific counters in always-on context.
