# M2 consumer evidence and decisions

This section follows the [bounded pilot](M2_PILOT.md). Production source remains
`b16d95ac1ee95238c070bc9f137d52718287d1cc`; the inspected migration base is
`f7104eb7c56006ec6f58172168fc1aca3e42dbca`. The work separates observable behavior,
unambiguous implementation defects, and decisions that change documentation meaning.

## Decision recommendations

These recommendations are **proposed, not approved**. Counts below come from an
independent strict-parser census of all 2,408 regular Git blobs. It selected 776
bidder pages and 127 module pages, but nine bidder files have duplicate YAML keys.
Affected-page counts therefore remain partial/lower-bound. Overlapping groups
must not be added together.

A separate safe_yaml observation parsed 912 selected bidder/module frontmatters
without errors, including the nine strict-parser failures, and found 785 bidder
records. It recorded 104 field-value differences from the JavaScript parser.
This explains compatibility risk; it does not approve last-definition behavior
or establish deployed Jekyll page membership. In this legacy-parser population,
omitted COPPA and demand-chain counts are 320 and 570; USP, supply-chain, and
explicit-false safeframes counts remain 210, 223, and 118 respectively.
Six duplicate-key files repeat identical values. JWPlayer repeats `true` and
`yes`, which are equivalent under the measured legacy parser but need explicit
spelling in strict YAML. Two require content decisions: TTD's `userIds` list
versus `all`, and VideoHeroes' false versus true `tcfeu_supported`. This narrows
the cleanup work; none of the source declarations have been silently removed.

| Decision | Evidence and impact | Recommendation |
| --- | --- | --- |
| Omitted support flags | USP is absent in 210 selected bidders, COPPA in 317, supply chain in 223, demand chain in 567. Production templates display `check with bidder`; the guide says false defaults, and some React defaults are false. | Keep absence as unknown and display `check with bidder` for these four fields. Explicit false remains no. Update contributor guidance with the approved rule. This does not assign the same default to every boolean field. |
| False safeframes | 118 selected bidders explicitly declare false. Actual Liquid renders no in the detail table but `check with bidder` in CSV because its truthiness condition excludes false. | Make both projections show no for explicit false. Keep omitted/null distinct. This changes CSV output and requires an intentional-correction record. |
| GPP false fallback | 14 selected bidders reach the fallback. The unqualified variable makes output depend on ambient scope; actual Liquid changes from `None` to `check with bidder` when that ambient variable exists. | Nonempty declared sections take precedence. Otherwise explicit false means none, independently of ambient scope. Preserve true/absent-section behavior and record empty/null cases explicitly. |
| Singular/plural User IDs | 96 selected bidders use `userId`; 89 are singular-only. Seven contain both spellings, with six differing pairs. The guide and renderer read different spellings. | Recognize singular `userId` as a legacy alias for canonical `userIds`; retain both raw fields. Block conflicting dual-key records for individual review rather than silently preferring one. Preserve qualified text such as commercial-activation notes. |
| Duplicate YAML keys | Strict parsing rejects jwplayer, movingup, preciso, prismassp, smartadserver, spm, ttd, valuad, and videoheroes. `safe_yaml` observes last-definition behavior in a controlled fixture. | Treat duplicates as a content cleanup worklist before normalized adoption. Do not silently implement first/last-wins migration policy. Inspect each differing declaration and record the chosen correction. |
| Legacy YAML scalar spellings | 113 bare yes/no/on/off tokens occur across 104 strictly parsed bidder pages. The legacy parser interprets these as booleans; the JavaScript parser can retain strings. | Retain raw spelling and parser provenance. Make field-specific corrections explicit; do not globally coerce arbitrary strings. |

Raw source is retained regardless of the final choice. Recommended-but-disabled
modules have zero matches in this census, with positive controls of seven
recommended and ten disabled modules; the synthetic contradiction remains a
contract case rather than an observed corpus defect.

## Legacy runtime boundary

[GitHub Pages' dependency page](https://pages.github.com/versions/) documents Ruby
3.3.4, Liquid 4.0.4, and safe_yaml 1.0.5. The probe pins and verifies the gem
archive hashes in [legacy-runtime.json](legacy-runtime.json). That published list
is not attestation of a particular deployed build.

The probe executes the actual pinned metadata template and CSV row expressions.
It does not execute a full Jekyll build or claim that fixture contexts reproduce
every page/layout variable. It separately reports the Ruby version. The initial
local probe used macOS Ruby 2.6.10; hosted validation selects documented Ruby
3.3.4. Both use the same pinned gem versions.

For local verification, use the repository-pinned Node/npm toolchain and install
the gems into an isolated directory:

```bash
gem install liquid --version 4.0.4 --install-dir .validation-results/legacy-gems --no-document --ignore-dependencies
gem install safe_yaml --version 1.0.5 --install-dir .validation-results/legacy-gems --no-document --ignore-dependencies
node scripts/migration-legacy-consumers.mjs
```

Set `PREBID_LEGACY_GEM_HOME` if the gems are elsewhere. The probe fails if packages
are absent or their versions/archive hashes differ; it never turns missing
runtime coverage into a skipped passing case.

## Implementation boundary

The bidder-index correction tests explicit boolean true, preserving raw metadata.
In the existing manifest, AdGeneration has `pbs: "no"`; JavaScript truthiness
incorrectly displayed true. Its corrected server cell is false.

Explicit consent true, false, and `check with bidder` now belong to distinct
groups. The previous unknown branch reused the unsupported list and label.
Omitted consent defaults remain unchanged while the policy above is pending.
Annotated GVL text remains visible without numeric coercion; numeric zero is
rendered inside its labeled field, without asserting membership in a live GVL.

The component contract validates explicit authoring props and rejects malformed
values before rendering. It is not the raw-frontmatter schema or an automatic
projection. Scalar User-ID/media values still need an explicit adapter before
being wired to array props. This implements M2's invalid-component requirement,
without inventing a fallback display policy for malformed raw metadata.

M1 source validation checks recognized default-import bindings, their aliases,
and literal JSX calls, including calls embedded in MDX expressions/attributes.
Dynamic expressions and spreads require a separately tested projection. Component
calls must be self-closing or empty; no child content is accepted. Ordinary
JavaScript wrappers and arbitrary React factories are outside static binding
analysis; the component's runtime guard still validates actual rendered calls.
Source-check coverage and runtime render coverage must remain separate.
The full authored selection currently checks two literal calls: AdDefend in
current documentation and its historical version. It does not imply every bidder
page already invokes the Features component.

## Download observations

The offline harness executes the pinned production `download.js` and vendored
jQuery 1.12.4 in a DOM runtime. It records requests, fake responses, downloads,
configuration bytes, URL state, selection, and errors without contacting the
backend. DOM fixture behavior is not browser layout/accessibility or deployed
service evidence.

Observed legacy defects include minimum-version/rename ordering, alias and V8
configuration identity mismatches, disabled appearance after failure, and stale
module URL state after import. Tests pin those observations so they cannot be
misreported as successful round trips. This phase does not patch legacy
production JavaScript or silently choose a new saved-configuration format.

## Verification checkpoint

Local validation passed 166 tests with zero failures or skips, strict TypeScript,
and the authored-content check over 1,221 files. The latter identified both
literal Features calls and retained the existing 216 formatting findings.
The full bidder-table comparison changed exactly one existing cell: AdGeneration's
server flag. Known-bad component values, nested JSX, sparse arrays, and React-key
handling have positive, negative, and restored controls. Original reviewer
counterexamples were independently re-run after the repairs.

The [retained local receipt](evidence/m2-consumers/manifest.json) binds the source
census, selected legacy runtime/download observations, authored checks, test log,
and implementation hashes. `INCOMPLETE_SOURCE_AUDIT` remains the correct census
status because strict parsing rejects the nine duplicate-key files. Successful
tests demonstrate the detector and bounded consumers, not a clean whole corpus.
Fresh full-site comparison and hosted CI have separate receipts.

## Remaining acceptance

Close the decisions above, then implement approved metadata projections and D5
consumer corrections with explicit compatibility fixtures. Complete the
representative browser, route/version, and generated-data integration checks
before adopting a real migration batch. Passing the narrower checks here does
not complete M2 or establish broad content parity.
