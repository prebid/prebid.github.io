# Review of the upgrade and M0 deliverable before M1

Date: October 4, 2026. Reviewed local head:
`e3ecc676e1827b8d801df9539690639e53d9496f`, containing the Docusaurus upgrade and
M0 work above upstream `ca35845fab8072d48c7a8ef39a125dca97b79366`.
Both upstream migration and production heads were rechecked and remained at the
pins used by M0. This review did not publish a PR or deploy the site.

## Findings and corrections

Two reproducible P2 defects were corrected before proceeding:

1. **Collector output confinement used a lexical path.** An outside symlink
   pointing into the control checkout could direct receipt writes into the input
   tree. The inventory's separate path guard did not protect this entrypoint.
   The collector now resolves existing output ancestors before containment
   checking and rejects existing/dangling endpoints and dangling ancestors.
   Boundary tests prove rejection before Git, installation, or writes. The
   independent original probe now fails at the intended guard; an ordinary
   external output still proceeds normally.
2. **A missing discriminator could hide a malformed code capture.** Deleting
   `source_byte_start` caused the reference verifier to skip that record, even
   when its text was corrupted. Verification could report 15 selected cases but
   only three checked captures. Schema-v1 capture maps/payloads and partial source
   markers now identify capture records independently; their complete structure
   is required. Tests remove every required field and the markers together.
   Corrupted or incomplete records fail, while the original reference still
   verifies all four captures across its 15 cases and 22 source artifacts.

The source-inventory review found no additional demonstrated material defect
within its documented path-candidate scope. Binary content, dynamic references,
unresolved mappings, parser errors, and skipped paths remain explicit; none
become semantic migration completion claims.

These probes did not establish corruption of the original accepted M0 receipt.
That package was checked and retained without modification. The corrected tools
and their new validation are recorded separately.

## Validation

* All 25 current Node tests passed; none were skipped. Added controls cover both
  collector output-path entrypoints and partial reference-capture structures.
* Independent replay closed both original findings. The corrected normal reference
  verifies 22 source artifacts, 15 cases, four exact code captures, and four
  unresolved disputes. No domain decision or rendered-parity verdict was added.
* A fresh locked reinstall/build using the corrected collector passed against
  the unchanged, clean, full-history `7a164db` control on Node 24.18.0/npm 11.16.0.
* All **3,066 output files have identical hashes** to the retained M0 control.
  Source manifests, routes, compiler warning pairs, rendered metadata/text/code
  hashes, global data, and summary observations also match exactly.
* The configured site inputs in the working branch remain identical to the
  control: package/lock/configuration, Babel/TypeScript/sidebar configuration,
  plugins, source components/pages, documentation, static files, and versioned
  documentation. The M0/review changes affect evidence tooling and context.
* Markdown and whitespace checks pass for the changed documents. Historical
  evidence-package checksums and source-backed reference data remain unchanged.

The local review receipt is
[evidence/pre-m1-e3ecc676/package-manifest.json](evidence/pre-m1-e3ecc676/package-manifest.json).
It binds the corrected tools/tests, complete capture output, reference verification,
and the comparison with the original package. It is a local evidence snapshot,
not independently immutable custody.

Historical package hashes describe the archived tools and exact earlier source
revision; they are not expected to match later corrected tools. Validate the
archived collector and identified test revisions when checking that older package.
New runs get separate receipts instead of rewriting historical test claims.

## Readiness and remaining boundaries

The demonstrated review findings are closed. The work is ready for the proposed
PR review and the bounded M1 runtime/CI implementation. This is not production
migration or deployment acceptance.

The control still contains the known 581 broken-link references, 100 broken-anchor
references, missing-asset candidates, and unrendered bidder CSV. Those are retained
migration observations, not defects introduced by these review corrections.

Fresh Linux installation, hosted CI and artifact retention, full browser/fidelity
coverage, dependency-advisory remediation, and live backend verification remain
unperformed. The fresh build used the fixed site-control commit rather than a
GitHub PR merge ref; hosted merge-result verification remains future CI work.
