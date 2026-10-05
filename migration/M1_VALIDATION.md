# M1 runtime and validation foundation

M1 implements the runtime, unprivileged CI, and authoring/regression checks in the
[execution plan](../DOCUSAURUS_EXECUTION_PLAN.md). It does not accept legacy-content
fidelity, approve production cutover, or resolve the open domain/product policies.

## Toolchain and commands

Node 24.21.0 and bundled npm 11.19.0 are pinned in `.nvmrc`, `packageManager`,
engines, CI, and the devcontainer. The pre-install check rejects different runtime
versions or inconsistent pins. The official Linux image is pinned by digest; its
Node/npm versions were executed in an isolated container. Global defaults remain
outside these scripts. Full VS Code devcontainer creation is not yet exercised.

```bash
node scripts/validate-toolchain.mjs
npm ci --include=dev --ignore-scripts
npm run typecheck
npm run test:migration
npm run validate:site -- --baseline-ref "$REVIEWED_BASE_SHA" --out .validation-results/my-check
```

Supply a full 40-character reviewed base SHA and a new receipt directory. The
candidate must be clean and have full Git history. Both acceptance builds run in
separate temporary checkouts of their pinned commits, with their own locked
installations and an ephemeral npm cache. Ignored local Markdown, JavaScript,
assets, or configuration cannot enter the candidate checkout. Existing outputs
are refused; cleanup checks every Docusaurus deletion target and its ancestors,
then verifies the targets are absent. Tracked source must remain byte-identical.
`--allow-dirty` instead builds the working tree and always records a development
probe, even if Git status is empty. Reported authored inputs must match its
captured Git-visible manifest; ignored Markdown cannot silently become covered.
The initial HEAD/index/input/tool snapshot is checked again before candidate
capture and before the verdict. These checkpoints detect drift; they cannot
detect edits restored between checkpoints or changes to ignored dependencies.

`npm run validate` combines runtime, types, tests, and the site comparison; pass
the base using `MIGRATION_BASE_SHA`. `npm run validate:content` alone reports
syntax and formatting observations. Formatting becomes a blocking regression
comparison only when paired with the independently built base report.

The root `.npmrc` enforces engines and disables lifecycle scripts, automatic
audit, and funding output. Security assessment remains separate work; disabling
automatic audit output is not a clean security verdict. Validator dependencies
are explicit. Notification tooling has its own manifest and lockfile.

## Coverage and baseline authority

* Strict TypeScript selects `src`, the TypeScript TOC plugin, Docusaurus config,
  and sidebars: initially 17 TypeScript/TSX and two JavaScript inputs. Inherited
  `allowJs` does not enable `checkJs`. Legacy assets JavaScript is excluded;
  Markdown JSX/component props are not typechecked by `tsc`.
* Source validation uses the pinned Docusaurus 3.10.2 compiler with configured
  frontmatter, Markdown/MDX mode, compatibility preprocessing, and plugins. It
  selects standard docs/pages plugins by package name, installed path, or exact
  installed factory export, plus configured versions and explicit Markdown
  partial imports. Empty/unsupported selections fail. Other plugin declarations,
  including arbitrary wrappers, are inventoried but remain outside this adapter.
* A single locale can still activate translated source through an `i18n` directory.
  The validator resolves the framework's locale configuration and rejects both
  inferred and explicit translations until localized discovery is implemented.
  Static/re-export and literal dynamic imports, including JSX attributes and
  uppercase extensions accepted by the framework, are followed within one
  uniquely owned content root. Cross-root imports fail explicitly because another
  content loader or the fallback loader may apply different compiler plugins.
* Formatting covers the established fenced-code-language rule corresponding to
  enabled Markdownlint MD040. Other Markdownlint rules are not claimed for MDX.
  Changed repository Markdown still uses the repository Markdownlint policy.
* Cold builds collect route/anchor warnings, compiler Markdown-link diagnostics,
  HTML local-target candidates, and CSV syntax/template leakage. Source, output,
  lock, tool, runtime, reports, and logs have retained identities.
* New source/target identities and increased diagnostic multiplicity fail.
  Static targets compare distinct source/tag/attribute/target groups because the
  inspector collapses repeated identical attributes. Removed routes, authored
  inputs, emitted HTML, and CSV paths fail; intentional transitions require a
  separately reviewed policy. No deletion waiver is introduced here.

There is no editable head-side warning-count allowlist. CI supplies the PR base
SHA from its event. The runner builds isolated clones of that commit and the
candidate, each with its own lock and installation. Both source validators
use the current pinned compiler/rule implementation. Incompatible compiler or
selector scopes fail and require adapter/fixture review. This ratchets resolved
findings: a later PR cannot reintroduce a fixed defect merely because it appeared
in an old inventory.

The diagnostic observer changes severities to `warn` and replaces the Markdown
link hook with structured reporting while preserving original URLs. It refuses
custom function hooks that could change URL semantics. The execution copy sits
beside the actual config to preserve preset/plugin resolution, is removed in
`finally`, and is retained in the receipt. Compiler caches are cleared so hooks
execute. This explicitly instrumented build is distinct from ordinary config use.
The original resolved reporting policies are retained in site report schema 2.
Candidate `throw` settings still fail acceptance when that category has existing
diagnostics, even when comparison against the baseline adds no new identities.
Instrumentation therefore collects the full inventory without weakening an
explicitly strict candidate policy. Older report schemas must be regenerated.

## CI and notification boundaries

`Docusaurus validation` runs on PRs targeting `docusaurus` or stacked
`codex/docusaurus-*` branches, pushes to `docusaurus`, and manual dispatch with an
explicit base SHA. PR edits are included so retargeting a stacked PR reruns the
comparison against its new base even when the head SHA is unchanged. Title/body
edits also rerun validation; the job is never replaced by a successful skipped
check. A green check remains evidence for its recorded head/base pair; advancing
the base still requires current integration validation and maintainer merge rules.
It checks out the exact candidate with full history, pins
actions to commits, and does not persist credentials. Its token is read-only;
notification/deployment secrets and cross-run cache restoration/saving are absent. Logs,
reports, manifests, and controls upload on success or failure for 30 days.
The job has a 45-minute operational ceiling for the cold comparison and controls.
This is a provisional timeout, not the performance budget reserved for M4.

The privileged notification event checks out only its trusted base SHA, installs
separate locked dependencies without lifecycle scripts, and supplies credentials
only to the existing notification execution step. The notification script is
unchanged. Tests do not send mail; delivery is not exercised as a control.

Configuration, compiler plugins, and full MDX builds execute code. Repository
workflows and validators remain PR-editable; these are reviewed controls, not a
tamper-proof boundary. Branch protection and human approval remain maintainer
responsibilities. Release work must rebuild reviewed source with a trusted or
empty cache, without promoting arbitrary PR artifacts.

## Initial observations and limits

The retained [local evidence package](evidence/m1-3d8cfd6b/package-manifest.json)
binds clean macOS ARM64 and fresh Linux ARM64 runs at
`3d8cfd6b7f6635bc5dbcdb40a543eeec6f4a592e`, compared with the M0 checkpoint. Both
full comparisons passed with no new findings or lost routes/inputs/HTML/CSVs.
The Linux run used empty installation caches, disabled lifecycle scripts, and
the pinned image with 4 CPUs and 6 GiB memory; its 58 tests passed without skips.
The notifier's locked packages installed and resolved without sending mail.

The later source-state guard adds six controls; the expanded local suite passed
all 64 tests. Use the final published head's hosted CI receipt to verify that
guard's full orchestration. The archived local builds deliberately retain their
original commit identity rather than being relabeled as a later revision.
Local timing includes overlapping work and is not a controlled performance
benchmark. Legacy Jekyll verification was attempted but its executable/gems were
unavailable; this does not stand in for a Jekyll build.

The macOS development comparison against `0791a5b7a9c84f7ff4be1433a4bcb34f17f00c0d`
compiled 1,221 files (469 Markdown, 752 MDX), including four explicit partial
imports, with zero syntax failures. Both builds produced 1,254 route keys and
1,239 HTML files, with zero new findings in each covered category.

| Existing observation | Count |
| --- | ---: |
| Broken route references | 581 |
| Broken anchor references | 100 |
| Broken Markdown-link occurrences | 97 |
| Missing local-target groups | 499 |
| Code fences without a language | 216 |
| CSV files with unrendered templates | 1 |

These overlapping inventories are unresolved and must not be added into a defect
total. They do not establish deployed-host failures or content fidelity.

Permanent controls include clean/broken/restored type and build fixtures,
repeated malformed frontmatter, MD/MDX syntax, empty selections, missing imports,
line-shift-stable comparisons, broken internal links, missing image bytes, missing
CSVs, and output-path safety. Execution counts and platform acceptance belong in
receipts and exact-head CI checks.

No browser hydration, deployed redirects, CSS/srcset graph, legacy semantic
fidelity, domain component props, independent CSV field semantics, or indirect
JS-to-MDX import discovery is established by the source validator. The full build
still resolves indirect imports. M2 must establish domain/content contracts.

## Pre-M2 review

The pre-M2 review exercised alternate valid source spellings and local filesystem
state, rather than extending the original happy-path fixtures alone. It corrected
translation/plugin/import selection, PR-retarget triggering, ignored-input
isolation, complete cache cleanup, and byte-preserving Git filename handling.
Historical receipts above keep their original source and detector identities;
the corrected runner produces new receipts and requires current-head CI.

## Route inventory correction during M2

Schema 3 replaces the route-removal guard's use of internal chunk keys with
statically parsed declarations from generated `routes.js`. Docusaurus 3.10.2
constructs `routesChunkNames.json` keys from a path plus a hash of its route
configuration; content changes can alter these keys without removing a URL.
Historical 1,254-key observations remain valid as internal-key counts and must
not be relabeled as distinct public paths.

The current collector retains both raw generated files, verifies every
`ComponentCreator(path, hash)` join, and separately records distinct paths, leaf
paths, and routing contexts. It compares removal of paths, leaves, and contexts
(`path`, `exact`, ancestry, and leaf status), with multiplicity. Internal hashes
and chunk IDs remain provenance, not route identities. Removing a `/` leaf while
retaining `/` wrappers must still fail. Legitimate hash-looking URL suffixes are
preserved literally; no suffix-stripping heuristic is used.

Schema-2 reports require regeneration for comparison. Generator-backed controls
cover hash-only churn, real path and leaf deletion, malformed joins, and empty
coverage. Existing HTML/CSV/authored-input retention guards remain active.
This is route-declaration retention, not browser navigation, routing-order,
fragment compatibility, or legacy-URL parity. The historical M0 collector still
labels its older inventory explicitly as internal chunk keys.

The [M2 consumer follow-up](M2_CONSUMERS.md) also adds bounded literal component
call validation and runtime prop guards; older receipts above retain their
original, narrower source-validation scope.

## Next dependency

M2 starts with the bounded two-snapshot reconciliation/converter pilot and the
existing source reference cases. Resolve disputed metadata with maintainers and
add the required-notice semantic negative control before accepting converted
content. A green M1 run does not authorize bulk production-content merging or
metadata deletion.
