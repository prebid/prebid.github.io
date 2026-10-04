# M2 bounded metadata preservation policy

This pilot implements lossless metadata records and selected observations of
legacy consumers. It does **not** accept a complete normalized metadata contract,
restore rendered bidder pages, decide disputed fields, or complete M2.

The implementation is [migration-metadata.mjs](../scripts/migration-metadata.mjs).
The controlling requirements remain [M2 and D5](../DOCUSAURUS_EXECUTION_PLAN.md)
and the [independent reference contract](REFERENCE_CONTRACT.md). Observed consumer
rules are pinned to production source
`b16d95ac1ee95238c070bc9f137d52718287d1cc`. Each input record separately identifies
its caller-supplied source commit and source bytes; neither identity is a claim
that a Git object has been verified.

## API and evidence boundary

```js
import {
  parseMetadata,
  getMetadataField,
  validateMetadata,
} from '../scripts/migration-metadata.mjs';

const record = parseMetadata(sourceBytes, { sourcePath, sourceCommit });
const field = getMetadataField(record, 'usp_supported');
const validation = validateMetadata(record, { source: sourceBytes });
```

`parseMetadata` accepts a string or UTF-8 Buffer and performs no filesystem, Git,
network, Liquid, or JSX operations. It returns a deeply frozen, JSON-safe record:

* `provenance` retains the supplied repository-relative path and full commit,
  full-source SHA-256 and byte count, and `git_object_binding: UNVERIFIED`.
* `frontmatter` retains the exact YAML text, its SHA-256 and byte count, original
  delimiter text, and UTF-8 byte offsets. CRLF and a leading BOM are preserved.
  An absent frontmatter block is distinct from a present empty block.
* `fields` contains every present parsed key, with `presence`, `kind`, and `value`.
  The accessor reports absent keys explicitly. Missing, null, false, empty text,
  and empty lists are distinct. Raw unknown keys are never silently dropped.
* `parser` records the installed `js-yaml` version and `DEFAULT_SCHEMA`. Field
  presence refers to the parsed mapping. Jekyll runtime equivalence is unverified.
* `projections` describes bounded source logic. `SOURCE_BACKED` identifies an
  observation, `DISPUTED` retains conflicting facts and a null canonical decision,
  and `UNSUPPORTED` retains the source without inventing an output value.
* `diagnostics` identifies invalid domain types and unsupported fields/tokens.
  `disputes` records unresolved decisions separately.

Malformed YAML, duplicate/non-string keys, non-mapping roots, invalid UTF-8, cycles,
non-finite/unsafe numbers, negative zero, unsafe object keys, and non-JSON YAML
types are rejected with explicit `MetadataError.code` values. Timestamp, binary,
set, pairs, ordered-map, and merge tags are outside the pilot. Quoted dates remain
strings. Acyclic aliases containing JSON-safe values are retained; the raw YAML
keeps their lexical representation. Frontmatter is limited to 1 MiB, and parsed
graphs have explicit traversal/depth limits.

Domain errors differ from parser errors: a string `pbjs: "false"` is preserved,
reported as an invalid field type, and cannot produce an affirmative selector.
Unknown JSON-safe fields remain available with an unsupported-field diagnostic.

`validateMetadata` checks record integrity by recomputing fields and observations
from retained YAML. Supplying `source` additionally checks the full-source bytes
and framing. This is an internal consistency check, **not an independent content
oracle** and not a Git-object verifier. The fixture expectations are hand-authored
separately from the normalizer.

Validation returns `valid: false` for record corruption or invalid domain types.
An intact record with disputed or unsupported meaning can have `valid: true`
with `status: UNRESOLVED`: this approves preserving the record, not its domain
meaning. Consumers must inspect that status and individual projections. Both
`policy_approved` and `full_m2_acceptance` remain false in every result. An empty
or undisputed record cannot approve a complete migration scope.

## Bounded field policy

Every row preserves raw values. There is no selected canonical replacement for
disputed behavior. All citations in this table refer to the pinned production
source unless explicitly described as a current React consumer.

| Fields | Preserved form and bounded observation | Unresolved or unsupported behavior |
| --- | --- | --- |
| `layout`, `page_type`, `title`, `description`, `biddercode` | Strings retain source identity; `layout: bidder` selects CSV membership. Bidder projections require nonempty title/code. | No route/version policy or inferred release membership. Retain `layout` while discovery depends on it. |
| `pbjs`, `pbs`, `prebid_member`, `tcfeu_supported` | Explicit booleans remain booleans. Legacy display checks `== true`; other values that are absent/null project to `no` as an observation. | No JavaScript truthiness conversion of strings. No global canonical default is approved. |
| `enable_download`, `s2s_only`, `pbjs_version_notes` | Bidder selector requires `pbjs == true` and excludes explicit `enable_download == false`. Unavailable and server-only notices are distinct. Notes remain exact prose. | Deprecation prose never invents removal. CSV membership does not imply download or service availability. |
| `aliasCode`, `filename`, `prevBiddercode`, `redirect_from` | Filename overrides request-module identity; aliases retain their checkbox identity. Former code remains a separate notice; redirects retain raw string/array values. | No route changes or inverse alias mapping. Blank explicit identities are invalid; null/absent remains distinct in raw fields. |
| `media_types` | Comma text and string arrays retain all tokens. Legacy CSV defaults banner to yes unless `no-display` is contained, and checks video/native separately. | Tokens such as `audio` remain present with an unsupported-consumer diagnostic. No token is discarded to fit React's enum. |
| `gvl_id` | Integer, annotated text, and `none` remain distinguishable. Numeric projection is supplied only for an actual safe integer. | No `parseInt` extraction from `410 (adtelligent)` or `14 (adkernel)`; annotation is not discarded. |
| `gpp_sids`, `gpp_supported` | Nonempty section text takes precedence. CSV comma-split/space-join is recorded, including doubled spaces. True plus absent/null sections projects to `some (check with bidder)`; true plus empty text does not. | False fallback uses bare `gpp_sids` in the template and remains disputed. Missing defaults conflict with contributor prose. Array rendering is unsupported rather than guessed. |
| `usp_supported`, `coppa_supported`, `schain_supported`, `dchain_supported` | Explicit true/false projects to yes/no. | Omitted/null values retain template `check with bidder` and contributor `Default is false` as a dispute; no default wins automatically. |
| `safeframes_ok` | Explicit false is retained. Detail rendering checks false directly. | CSV adds a truthiness condition before checking false; false-case intent and Liquid runtime behavior remain disputed. |
| Other support fields, `ortb_blocking_supported` | `deals_supported`, `floors_supported`, `fpd_supported`, `dsa_supported`, `endpoint_compression`, and `pbs_app_supported` retain boolean/absent/null states. ORTB additionally preserves `partial` and `check with bidder`. | The legacy unknown display does not approve missing-field policy. PBS app detail visibility is separately conditional on `pbs`; CSV has a column for every row. |
| `multiformat_supported` | Legacy display text is preserved; documented enum values are recognized. | Additional text is retained with a consumer diagnostic, not coerced into a React enum. |
| `userIds`, `userId`, `privacy_sandbox` | Plural string values, qualified `all` text, null, and singular keys remain distinct. Legacy detail reads plural `userIds`. Privacy-sandbox raw data is retained. | Singular/plural meaning is disputed. Array rendering and privacy-sandbox projection are unimplemented. Bare `yes/no/on/off` records a YAML-schema dispute. |
| `module_code`, `modulecode`, `useridmodule`, `recommended`, `vendor_specific`, `min_js_version` | Module, analytics, and User ID categories retain separate identifiers/selector rules. Recommended selection starts checked. Minimum version remains exact source text. | Recommended plus explicitly disabled remains disputed. No semver policy, release-service check, dependency closure, saved-configuration identity, or transport implementation is introduced. |
| Other raw keys | Every JSON-safe value and original YAML text survives. Framework-only `sidebarType`, `permalink`, and `search` are pass-through fields. | Unknown keys are reported; pass-through framework values are not claimed to be fully validated. |

The observations come from `_includes/dev-docs/bidder-meta-data.html:4-71`,
`_layouts/bidder.html:38-84`, `dev-docs/bidder-data.csv:5-8`, and
`download.md:58-112`. The conflicting contributor defaults occur at
`dev-docs/bidder-adaptor.md:1347-1354`.

Useful source counterexamples include:

* Bidsxchange `gvl_id: 410 (adtelligent)` and disabled-download metadata at
  `dev-docs/bidders/bidsxchange.md:8,20-21`.
* RtbDemand singular `userId`, annotated GVL, and alias at
  `dev-docs/bidders/rtbdemand_com.md:6-15`.
* AgenticX redirect/media arrays including audio at
  `dev-docs/bidders/agenticx.md:6-11`.
* AdPort explicit-null user IDs, `none` values, and bare `no` at
  `dev-docs/bidders/adport.md:10,19-28`.
* A1Media explicit-false GPP and safeframes at
  `dev-docs/bidders/a1media.md:11,15`.

## Tests and remaining acceptance

Run with the repository-pinned Node runtime:

```bash
node --test scripts/migration-metadata.test.mjs
```

The suite uses explicit source-independent expectations for preservation,
omitted/null/false distinctions, aliases/filename precedence, removal versus CSV
membership, no-display/audio, GPP fallback/spacing, user-ID spelling, module
selection, malformed types, unsafe YAML, and tampered records. It does not create
expected values through the parser or projection implementation under test.

The existing independent reference cases still govern source fidelity. The
parent M2 work must bind real source snapshots, independently check selected
outputs and known-bad controls, and retain receipts. Passing this suite alone
does not establish those results.

Before full M2 acceptance, maintainers must resolve omitted-support policy,
GPP fallback/defaults, singular/plural user-ID meaning, and false-safeframes CSV
behavior. D5 also retains its saved-configuration identity and version/rename
interaction decisions. The bounded pilot deliberately does not resolve them.

Unimplemented scope includes live React/MDX integration, rendering notices or
feature tables, producing CSV/JSON/download files, full-corpus schema coverage,
Jekyll parser/runtime equivalence, Liquid string/array serialization, request
encoding, minimum-version filtering, saved-configuration round trips, and backend
availability. The existing `BidderFeatures` defaults and TOC consumers are not
changed by this API.
