# Migration evidence and commands

Start with [M0_BASELINE.md](M0_BASELINE.md) for measured state and explicit limits.
The [pre-M1 review](PRE_M1_REVIEW.md) records the subsequent delivery checks and
collector/reference-verifier corrections.
[REFERENCE_CONTRACT.md](REFERENCE_CONTRACT.md) explains the independent legacy
source cases. [CONTEXT_NOTES.md](CONTEXT_NOTES.md) carries durable lessons.
[M1_VALIDATION.md](M1_VALIDATION.md) documents the current runtime, CI, and
authored-content/regression runner, including its acceptance boundaries.
[M2_PILOT.md](M2_PILOT.md) records the bounded two-snapshot converter pilot,
lossless metadata contract, independent checks, and remaining acceptance gates.
The [execution plan](../DOCUSAURUS_EXECUTION_PLAN.md) controls sequencing and open
decisions; these tools do not authorize deployment or resolve domain policies.

## Tooling checks

Use the Node/npm versions named in the selected receipt. The M0 control uses
Node 24.18.0 and npm 11.16.0. M1 uses `.nvmrc` and `packageManager`; run
`node scripts/validate-toolchain.mjs` before installing current dependencies.

```bash
node --test scripts/migration-*.test.mjs
```

The collector uses installed `cheerio`; the inventory uses installed `js-yaml`.
Both are explicitly declared in the M1 dependency manifest. Their absence is an
error, not a reason to silently weaken parsing. The reference and Git
provenance verifiers use Node built-ins.

## Capture a control build

Prepare a clean, full-history control checkout at a fixed source commit and a
populated npm cache for that lockfile. Keep it separate from active editing and
the source archives used for inventory. Set the task-specific shell variables to
the chosen paths; `MIGRATION_RECEIPT` must be a new directory outside the control.

```bash
node scripts/migration-baseline.mjs \
  --site-dir "$MIGRATION_CONTROL" \
  --out "$MIGRATION_RECEIPT" \
  --site-url https://docs.prebid.org \
  --npm-cache "$MIGRATION_NPM_CACHE"
```

The command performs a locked offline reinstall including development
dependencies with lifecycle scripts disabled, runs a production build under a
controlled environment, checks source/tool cleanliness, and retains its executed
collector. It records source/build hashes, dependency tree, commands, environment,
raw warnings, routes, document metadata, local-target candidates, and CSV findings.
It refuses an existing output, dirty/shallow source, and inherited build overrides.

`capture_status: complete` means the evidence capture completed. It does not mean
the site is launch-ready. Missing-resource candidates, compiler warnings, and CSV
findings are observations; their detectors and limitations are recorded separately.
This offline macOS recipe is not fresh-network or hosted-Linux evidence.

## Inventory and bind source provenance

Prepare immutable archives of the pinned production and migration source commits.
Set `MIGRATION_REFERENCE_SHA`, `MIGRATION_SITE_SHA`, and their archive directories.
The inventory output must be a new file outside both input roots.

```bash
node scripts/migration-inventory.mjs \
  --legacy-root "$MIGRATION_REFERENCE" \
  --migration-root "$MIGRATION_SOURCE" \
  --reference-sha "$MIGRATION_REFERENCE_SHA" \
  --site-sha "$MIGRATION_SITE_SHA" \
  --out "$MIGRATION_INVENTORY"

node scripts/migration-provenance.mjs \
  --repo . --inventory "$MIGRATION_INVENTORY" \
  --out "$MIGRATION_PROVENANCE"

node scripts/migration-reference.mjs \
  --repo . --reference migration/reference-cases.json \
  --out "$MIGRATION_REFERENCE_CHECK"
```

The inventory intentionally labels supplied SHAs as unverified. The separate
provenance command binds every scanned file to its pinned Git blob and records
the production delta since the common base. The reference command checks source
anchors, hashes, exact code captures, unique nonempty cases, and unresolved dispute
states. It does not execute rendered-fidelity comparisons or the download service.

The inventory includes repository prose as well as public-page candidates.
`moved_unverified` means a candidate path mapping exists; `unresolved_mapping`
requires review. Neither is a completion percentage. Template references are a
lexical dependency inventory, not an execution trace of Liquid or JavaScript.

## Retained evidence

The versioned evidence package under `evidence/` is an immutable-by-convention
local receipt. Its package manifest binds retained bytes, including compressed
inventories and full compiler output. It remains editable within repository write
authority; no independent custody or hosted CI is implied.

Compressed JSON is retained with its uncompressed hash. For inspection, decompress
into a new temporary file and verify that hash before giving it to the verifiers.
The human report identifies the accepted run. Earlier development probes are not
substitutes for that accepted run or a passing production gate.

Historical package hashes identify their archived tool/test revisions. Compare
them with those revisions, not automatically with corrected current scripts.

After a meaningful source/lock/tool change, generate a new receipt directory and
compare the relevant observations. Preserve historical receipts rather than
overwriting them. Hosted artifacts, fresh Linux installation, and blocking CI
comparisons have separate M1 receipts; historical M0 packages do not imply them.
