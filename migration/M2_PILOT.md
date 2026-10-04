# M2 discovery, preservation contract, and replay pilot

The bounded pilot passes. **Full M2 acceptance remains open.** This work provides
a safe staging mechanism, independently checked content expectations, and lossless
metadata records. It does not update the public documentation, approve disputed
metadata, or authorize broad regeneration.

M0/M1 are merged into `docusaurus` at
`6a64af82939bc1bc04a44b8a5b03751b86eb87e8`. This pilot was developed directly on
that branch. Production `master` was refreshed and remained
`b16d95ac1ee95238c070bc9f137d52718287d1cc`.

## Inputs and independent expectations

[The input selection](m2-pilot.json) binds two immutable snapshots:

* A: `1f6c748039ad008b9d2a4b9870a26b507e46a542`, the historical common source.
* B: `b16d95ac1ee95238c070bc9f137d52718287d1cc`, refreshed production.

The seven sources are AppNexus, Bidsxchange, TCF Control, Permutive RTD, Mobile
iOS GAM rendering, the basic JavaScript example, and the bidder CSV template.
Five bidder frontmatters feed the CSV projection; three are metadata-only inputs.
Actual includes, layouts, configuration, and three Markdown image assets are
hash-bound dependencies. Four selected documents changed between A and B; the
other three sources provide unchanged controls. Shared Mobile include changes
also occur even though the including page is unchanged.

[Independent expectations](m2-expectations.json) were selected from pinned source,
without converter output. Their verifier binds 40 source-artifact observations
and 76 code payloads across the two snapshots. Source B has 40 code blocks and
76 content checks, including complete required prose, selected tables, explicit
anchors, image details, Mobile variant pairing, and exactly five CSV records
with 24 columns. These are selected obligations, not a complete corpus audit.

## Implementation and boundaries

* [The pure adapter](../scripts/migration-convert.mjs) protects Markdown code by
  parser offsets, preserving bytes without reserializing examples. Literal
  Liquid, URLs, indentation, and blank lines inside code survive. Unknown
  includes, variables, Kramdown forms, or changed specialized code templates
  require manual review. Public `.html` links and asset paths are retained.
* LiquidJS 10.30.0 evaluates selected source includes and the CSV template.
  This is a bounded observation of source expressions, not proof of Ruby Liquid
  or Jekyll equivalence. Known metadata disputes remain unresolved.
* The example becomes static HTML/JavaScript code plus its production-use
  warnings. Its ad scripts are never executed. Interactive example execution
  remains a later integration task.
* Mobile uses a small MDX wrapper with Docusaurus Tabs and two CommonMark partials.
  This keeps raw legacy HTML and literal expressions in the appropriate parser.
  Both payloads and the v12 default are checked. The existing framework and
  converted documentation are retained outside pilot staging.
* [Metadata records](../scripts/migration-metadata.mjs) retain exact frontmatter,
  field presence/types, source identity, and separate consumer projections.
  Annotated GVL IDs, aliases, singular/plural user-ID fields, omitted values,
  explicit false/null, audio, and unknown keys are preserved. See the
  [field-policy table](M2_FIELD_POLICY.md). Valid preservation can still be
  `UNRESOLVED`; no result approves a canonical policy.
* [The staging writer](../scripts/migration-staging.mjs) checks final filenames,
  ownership, unchanged inputs, and directory boundaries before writes. It covers
  assets and configuration as well as documents. Dry runs make no changes;
  repeat runs are idempotent. A journal resumes interrupted writes and removes
  obsolete owned outputs while retaining unowned files. It assumes one writer
  and does not claim concurrent-writer locking or power-loss durability.
* The old `migrate-devdocs.mjs` writer is retired and exits unsuccessfully with a
  pointer to this pilot. Historical code remains in Git. Its original global
  rewrites changed examples, its destination check could miss an existing MDX
  file, and its hardcoded warnings ignored shared-source changes.

Acceptance reads the actual emitted files, reconstructs only the explicitly
supported Mobile wrapper, compares emitted frontmatter with preserved source
bytes, and verifies disk hashes after compilation. A parallel in-memory summary
cannot substitute for the files being compiled. The source-only checker and
rendered observations retain distinct status fields.

## Replay result and D8 recommendation

The controlled replay starts with newly generated A, applies one explicit
migration-only correction (`proccess` to `process` in the Mobile reward sentence),
then advances to B. This is a real, known three-way base. It is **not** represented
as the historical ancestor of the existing converted tree.

| Method | Observed result | Limitation |
| --- | --- | --- |
| Three-way reconciliation from generated A plus repair to generated B | Seven selected sources; zero textual conflicts; independent checks pass; repair retained | Measures a controlled replay, not the cost of reconciling every existing migration edit |
| Regeneration from B plus explicit repair | Same content checks pass; raw metadata retained; repair retained | Specialized adapters and repairs still need review when source contracts change |
| Existing migrated source at `6a64af8` | Source-only gaps are recorded separately | Imported components are not expanded; these failures are not a rendered-parity verdict |

A separately labeled synthetic include edit regenerates both TCF and Permutive
and leaves other selected documents unchanged. Tests exercise synthetic output
addition, rename, deletion, dry run, interrupted recovery, conflicting local
edits, and an overlapping upstream repair. The lifecycle test concerns owned
output management; automatic discovery of arbitrary upstream renames is not
implemented.

**Use staged regeneration for reviewed, source-owned pilot outputs, with explicit
repairs and a manual comparison against existing migration work.** Both controlled
methods are viable. No measured result justifies restarting the whole migration.
Retain existing framework/components, record each adopted output's ownership and
source/dependencies, and use reconciliation where existing edits have not yet
been represented as reviewed repairs. Zero textual conflicts is not zero reviewer
effort; human review time has not been measured.

## Verification and receipts

Use Node 24.21.0 / npm 11.19.0 and the locked development dependencies:

```bash
npm run verify:toolchain
npm run typecheck
npm run test:migration
node scripts/migration-pilot.mjs --out /tmp/prebid-m2-new-run
```

Use a new output directory under the system temporary directory or the existing
`.validation-results` directory. The pilot reads source from Git objects, verifies
the selected hashes, generates isolated files, runs the independent checker,
and compiles every selected document/partial through Docusaurus 3.10.2. Missing
Git history or an empty selection fails. This command does not build or publish
the main site.

Local validation on the recorded toolchain:

* 131 tests passed, zero failures/skips; strict TypeScript passed.
* Source A/B, controlled reconciliation, regeneration, and synthetic shared-include
  checks passed. Six emitted frontmatters retain exact source bytes; all nine
  metadata records pass preservation validation, with disputes still explicit.
* Eight compilation units passed: seven CommonMark files and one MDX wrapper,
  including two imported partials. Five CSV rows remain separate from Markdown.
* A separate small production build passed. Its six HTML pages contain the
  selected required prose and both Mobile code payloads; v12 is initially selected.
  No external example script was emitted as an executable script element.
* Native Tabs SSR did not emit `aria-controls`. Browser hydration, keyboard
  interaction, and accessibility equivalence remain unverified; do not treat
  choosing the standard component as proof of those behaviors.

[Retained receipts](evidence/m2-pilot/manifest.json) identify the report, tests,
build log, rendered observations, and HTML hashes. Historical failed probes are
not accepted receipts. Repository receipts remain within ordinary write authority;
hashes identify bytes, not independent custody. Full-site regression and hosted
CI are separate from this bounded result.

The negative controls remove individual required notices, alter exact example
bytes and variant pairing/defaults, drop frontmatter, add an unexpected CSV row,
hide content in code/comments, discard the repair, remove a Mobile partial, and
introduce malformed MDX. Writer controls cover final-extension collisions,
changed destinations, symlinks, unusual paths, dry runs, and interrupted recovery.
Controls are followed by restored positive cases; no green result relies on an
empty selection.

## Work required before full M2 acceptance

1. Resolve the field-policy disputes with documentation maintainers: omitted
   support flags, false-GPP fallback, false-safeframes CSV/detail behavior, and
   singular/plural user-ID handling. Preserve observations until authority is
   recorded; do not choose defaults from JavaScript truthiness.
2. Exercise the D5 consumer behavior against that approved contract: alias and
   saved-configuration round trips, V8 renames, minimum-version ordering, patch
   and prerelease behavior, and recommended-but-disabled modules. Existing
   reference fixtures remain source evidence, not executed consumer coverage.
3. Connect domain/component validation to the actual bidder/module consumers.
   The M1 test command runs pilot validator controls, but this does not mean all
   authored bidder pages or React calls are now domain-validated.
4. Confirm route/version/hosting decisions D2/D3/D6 before adopting staged paths.
   Finish rendered/browser checks and record intentional corrections separately
   from source preservation. The isolated site intentionally has unresolved
   links to documents outside the slice.
5. Apply the chosen mechanism to a reviewed content batch, recording actual
   manual conflicts/review effort and disposition of existing migration edits.
   Broader source discovery, rename matching, and complete generated-data/layout
   restoration remain M3/M5 work.

This is a concrete checkpoint for those decisions. It provides tested mechanisms
and source facts without turning unresolved policy into implementation defaults.
