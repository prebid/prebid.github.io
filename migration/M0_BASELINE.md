# M0 local baseline and discovery results

The subsequent [pre-M1 review](PRE_M1_REVIEW.md) records two tool corrections and
their separate validation. The measurements and receipts below remain the
original M0 snapshot.

Date: October 4, 2026. Status: **local baseline captured and checked; hosted
archival/fresh Linux evidence pending M1**. This report does not declare the
documentation migrated, the independent reference cases passing, or the site ready
for production.

Implementation owner: primary Codex agent in this work session. Independent
reviews covered the inventory/reference work, collector failure modes, and future
context. Documentation-maintainer decisions remain open where marked disputed.

## Pinned inputs and retained evidence

| Input | Identity |
| --- | --- |
| Docusaurus control | `7a164dbc02f481c2dbca01e0d000bf10bed6903d` |
| Upstream migration branch | `ca35845fab8072d48c7a8ef39a125dca97b79366` |
| Production reference | `b16d95ac1ee95238c070bc9f137d52718287d1cc` |
| Common upstream base | `1f6c748039ad008b9d2a4b9870a26b507e46a542` |
| Control runtime | Node 24.18.0 / npm 11.16.0, macOS arm64 |
| History | Complete history fetched; isolated clean control checkout |
| Installation | Locked offline reinstall including dev dependencies; lifecycle scripts disabled |

The package upgrade and audited plan were checkpointed locally before M0 work.
Both reference and migration inventories used immutable Git archives; the build
used a separate managed control worktree. No inventory depended on a tree being
rewritten by the build's bidder-data plugin.

The accepted receipt is
[evidence/m0-7a164db-b16d95a/package-manifest.json](evidence/m0-7a164db-b16d95a/package-manifest.json).
It binds the retained and decoded bytes of 22 artifacts, the executed collector,
and the test/tool hashes. Larger records are gzip-compressed with deterministic
headers. Source hashes were independently checked against actual Git blobs:
1,564 selected legacy files, 1,487 selected migration files, and all 2,635 files
in the control build's tracked source manifest.

These are local repository receipts with explicit identity checks. They are not
independent immutable storage or a hosted CI result. M1 must add CI execution and
retained hosted artifacts; the associated M0 archival requirement remains open.

## Control-build observations

| Measurement | Accepted control result |
| --- | ---: |
| Docusaurus version | 3.10.2 |
| Build exit | 0, with success banner and unchanged source/tool checks |
| Route keys | 1,254 |
| Emitted HTML files | 1,239 |
| All emitted files | 3,066 |
| Compiler broken-link references | 581 |
| Compiler broken-anchor references | 100 |
| HTML references inspected | 604,445 |
| Local reference instances checked | 581,673 |
| External reference instances not requested | 6,211 |
| Static local-target candidate groups | 499 |
| CSV files with template-leakage findings | 1 |

The compiler warning counts reproduce the earlier upgrade observations. Exact
source/target pairs, routes, document IDs, text/code hashes, timestamps, and build
file hashes are retained for comparisons; counts alone are not the comparator.

The static inspector's 499 groups consist of 495 anchor-link targets, three image
targets, and one image-preload target. This is a separate candidate inventory,
not 499 newly verified defects or a substitute for hosted routing checks. It
checks `href`, `src`, and `poster`; CSS URLs, `srcset`, external services, browser
hydration, and an independent fragment resolver are outside this scan.

Three absent image paths were confirmed in the output:

* `/assets/images/intros/Sincera_Logo_Black_Green-small.png`
* `/images/partners/leader/mile.png`
* `/images/partners/leader/pubx.png`

The bidder CSV still contains frontmatter and Liquid, rather than generated rows.
Its retained finding is a migration work item, not a collector failure.

## Source ledger and production changes

| Source inventory measurement | Result |
| --- | ---: |
| Legacy source inputs | 1,461 |
| Migration source inputs | 1,349 |
| Candidate moved counterparts, unverified | 1,157 |
| Unresolved source mappings | 304 |
| Migration additions without a claimed legacy source | 75 |
| Duplicate destination claims | 0 |
| Entries declared semantically verified | 0 |
| Legacy layouts / includes | 12 / 73 |
| Migration layouts / includes | 12 / 69 |

This deliberately broad source selection includes repository prose, unrendered
Markdown, and generated-data candidates. It is not the count of published pages.
The 304 unresolved mappings are review work, not 304 proven missing pages. The
ledger records retained legacy candidates and mapping evidence instead of treating
same-name files or basename hints as completed migration.

[TEMPLATE_CATALOG.md](TEMPLATE_CATALOG.md) separately enumerates all 85 legacy
templates with source-inspected output behavior, inputs/dependencies, and next
review needs. Dynamic Liquid, conditional/global data, and external demos remain
explicit limits; inspecting a template does not execute or validate its rendering.

Production remains 517 commits beyond the common base relative to the upstream
migration branch. The retained delta contains 565 repository file changes:
348 modifications, 175 additions, 22 deletions, and 20 detected renames. These are
repository changes, not a count of documentation pages or an automatic merge plan.
The D8 replay pilot still must choose a reliable synchronization mechanism.

The inventory parser rejected nine production frontmatter blocks for duplicate
mapping keys: jwplayer, movingup, preciso, prismassp, smartadserver, spm, ttd,
valuad, and videoheroes. This is a `js-yaml` observation, not proof that Jekyll
rejects those pages. Keep the bytes/provenance and resolve the parser/field-policy
difference before automated normalization.

## Independent content and download references

[REFERENCE_CONTRACT.md](REFERENCE_CONTRACT.md) and
[reference-cases.json](reference-cases.json) contain 15 selected cases backed by
22 pinned source artifacts. The verifier checked all source hashes, sizes, line
ranges, unique/nonempty case selection, and four exact captured code payloads.
Actual rendered parity and service execution remain unperformed.

Four cases intentionally retain null canonical decisions:

* Omitted bidder support flags: legacy rendering and contributor defaults conflict.
* CSV's false-GPP expression: a bare `gpp_sids` lookup has unresolved scope.
* Minimum-version exclusion followed by v8 module renaming: filtering identities
  may differ after renaming; patch/prerelease comparison is also unverified.
* Saved configurations serialize module codes while import selects checkbox IDs;
  alias round-trip intent needs a decision.

D5 discovery covers existing endpoints and consumer behavior, saved configuration,
aliases/filenames, recommendations, minimum versions, and release eligibility. No
backend request, new service, adapter release, or domain-policy correction occurred.

## Tool validation and independent challenges

All **22 Node tests passed with zero skipped tests**. The retained TAP output and
package manifest bind the selected tools/tests. Controls exercise empty scans,
duplicate/ambiguous mappings, malformed YAML, include cycles, raw/binary files,
output confinement and overwrite refusal, source-byte tampering, reference anchors,
disputed decisions, CSV syntax/leakage, and missing assets.

Independent review found three false-evidence paths in the initial collector:
inherited bundling-skip flags, partial warning-format loss, and HTML files being
accepted as missing resource replacements. These were corrected and challenged
again. A later dotted-API-route control prevented conservative extension handling
from labeling valid document paths as missing binary resources.

Two additional CLI probes altered an inventory hash and emptied its scan. Both
failed with exit 1 and produced no success receipt. The unmodified full inventory
also bound to the pinned Git blobs. Source and reference verification establish
identity/structure; they do not prove all selected semantic expectations correct.

The accepted run explicitly includes development dependencies. Earlier collector
development runs exposed omitted dev dependencies and path-classification issues;
they are not the retained acceptance baseline. No performance improvement is
claimed from these runs.

## Durable context and next boundary

AGENTS.md retains the original repository rules and adds concise migration
boundaries. CLAUDE.md is a bridge to that shared source. Detailed lessons live in
[CONTEXT_NOTES.md](CONTEXT_NOTES.md); run-specific counts live in this receipt.
The earlier CLAUDE content remains recoverable in the control checkpoint.

The shared context was independently critiqued with no material findings within
that review. AGENTS.md is 36 lines / 2,429 bytes; CLAUDE.md is 3 lines / 37 bytes.
Both are comfortably within their context budgets. The routing decisions were:

| Context item | Disposition and reason |
| --- | --- |
| Original lint, branch, and PR etiquette | Kept verbatim in AGENTS.md; repository-specific obligations |
| Relocation and bidder-layout dependency | Kept in shared guidance; omission caused concrete migration mistakes |
| Runtime, warning counts, SHAs, phase status | Routed to this report/receipts; volatile evidence does not belong in always-on instructions |
| Conversion recipes and directory descriptions | Referenced through source/plan; duplicating derivable implementation would drift |
| Legacy URL waiver and exclusions | Routed to decision register; unresolved policy is not a standing permission |
| Collector failure lessons | Routed to CONTEXT_NOTES.md and executable negative controls; prose alone is not enforcement |
| Duplicated Claude instructions | Replaced with shared AGENTS.md import; previous content remains in Git history |

Repository Markdown lint passes for the changed documents. `ph-lint`
and a fresh-session behavior exercise were not run; neither is implied by the
context review. No Claude import-runtime test was performed.

The next implementation boundary is **M1 runtime/CI/strict-source validation**,
including fresh Linux installation, hosted receipts, and comparisons that reject
new failures. M2 then runs the bounded replay pilot and contract tests. Existing
CSV, layout, asset, parser, and metadata findings remain visible work items.
M0 has not implemented the converter repairs, metadata normalization, Faster,
download UI, search, redirects, or production cutover.
