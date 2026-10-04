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
