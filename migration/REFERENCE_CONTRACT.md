# Independent legacy reference contract

This M0 reference supports the [execution plan](../DOCUSAURUS_EXECUTION_PLAN.md).
It records source-backed expectations for later migration comparisons and the D5
download consumer contract. It does not establish that the migrated site passes
those comparisons.

The production source pin is
[`b16d95ac1ee95238c070bc9f137d52718287d1cc`][reference-commit], refreshed on
October 4, 2026. The separate Docusaurus control checkpoint is
`7a164dbc02f481c2dbca01e0d000bf10bed6903d`. Source fidelity is judged against the
legacy pin; framework regressions are judged against the Docusaurus control.
Neither reference substitutes for the other.

## Evidence and comparison boundary

[reference-cases.json](reference-cases.json) contains 15 manually selected cases
and 22 source artifacts. Each artifact has its repository path, full-file
SHA-256, byte count, line count, and commit-pinned URL. Each case points to exact
line ranges, states independently expected facts, and proposes negative controls.
The JSON is a reference data file, not a test runner or a general metadata schema.

Expectations were read directly from pinned source, templates, and includes. No
converter, generated bidder manifest, metadata normalizer, or Docusaurus output
supplied the expected values. Hashes and selected code payloads were calculated
from the exact legacy source bytes. Those mechanical extractions do not decide
content meaning or render the legacy site.

This document preserves the original source-reference boundary. Subsequent
[M2 consumer evidence](M2_CONSUMERS.md) executes selected legacy template and
download behavior and tests actual migration consumers. Those newer receipts
do not retroactively turn every original case into verified rendered parity or
approve its disputed policies.

Two case statuses preserve the evidence boundary:

* **SOURCE_BACKED:** directly supported source facts or a stated projection of
  the source logic. This is not runtime verification or approval of every legacy
  behavior as the future policy.
* **DISPUTED:** conflicting authorities or source behavior requiring an explicit
  decision. The case retains the conflicting facts and has no chosen canonical
  value. It must not become a passing parity result through a default coercion.

All cases have unverified rendering; the set is pending independent review.
Future comparison receipts must bind the reference SHA, source hashes, target
tree, comparator identity, selected cases, and actual output. A selection must be
nonempty and unique. Report pass, fail, disputed, and unexecuted separately.
Disputed or unexecuted cases cannot clear the corresponding ledger scope.

An output adapter may locate a new route, table, or code block. It must not compute
expected values using the production transformation it is checking. Prose checks
may normalize layout whitespace; code checks must preserve internal bytes and
identifiers. The code cases specify the limited framing-newline allowance for
rendered snippets. Intentional corrections require a recorded reason, authority,
and replacement expectation rather than overwriting a failing fixture.

Legacy URLs and explicit fragment names are reference facts. D2/D3 still govern
their eventual compatibility mechanism and version placement. No redirect,
retirement, default-version, or hosting decision is made here.

## Bounded content references

| Cases | Source-backed expectation | Unresolved or unverified scope |
| --- | --- | --- |
| AppNexus deprecation | The [current legacy page][appnexus] names reduced support from July 1, 2026, planned deprecation in early 2027, and the Microsoft adapter. Preserve its explicit `appnexus-bid-params` anchor and the download note. | Deprecation prose does not set `enable_download: false`; do not infer removal. Final routes remain open. |
| Bidsxchange removal | [Frontmatter][bidsxchange] plus the [bidder layout][bidder-layout] produces the unavailable notice with `removed in 8.13.0`. It is excluded from the download UI but remains a bidder CSV row. | Alias identity and download eligibility are different consumer concerns. |
| AdDefend omitted flags | [AdDefend][addefend] omits USP, COPPA, supply-chain, and demand-chain flags. The [metadata template][bidder-meta] says `check with bidder`; the [contributor guide][contributor-defaults] says defaults are false. | **DISPUTED.** A documentation maintainer must choose field-specific meanings. Absence remains distinct from explicit false. |
| Example layout | The [basic example][basic-example] supplies about bullets; its [layout][example-layout] supplies the about list and both production-use notices. | A valid page, code block, or route does not prove those surrounding notices survived. |
| Basic example code | Exact `htmlCodePrebid` and `jsCode` captures are retained with byte offsets, hashes, and text. The pinned JavaScript uses `msft` and `placement_id`, not the older migration copy's identifiers. | The [web-example include][web-example] exposes result/html/js/source tabs and executes code in the result pane. No external script or example was executed here. |
| Mobile SDK tabs | The [iOS GAM page][mobile-gam] pairs v12 with `GoogleMobileAds.AdReward` and v11 with `GADAdReward`; the [tab include][gma-tabs] initially selects v12. | Both labels and payloads must survive. Keyboard operation, focus, hydration, and final fragment compatibility require runtime checks. |

The two example warnings come from
[not-for-production-warning.md][example-warning] and
[build-from-source-warning.md][build-warning]. Removing either warning while
retaining a compiling page is a required negative-control candidate. Other useful
controls replace the AppNexus deprecation text with stale text, swap Mobile tab
payloads, or alter a code literal without causing a syntax error.

## CSV reference

The legacy public file is `/dev-docs/bidder-data.csv`. Its
[source template][bidder-csv] defines 24 headers, selects all `layout: bidder`
pages, and renders records. The case file spells out the headers and selected
cells for AppNexus, Bidsxchange, Browsi, RtbDemand.com, and LemmaDigital.

The selected expectations deliberately distinguish consumer rules:

* `no-display` makes Browsi's banner cell `no`; video stays `yes`.
* AppNexus has `gpp_supported: true` and no `page.gpp_sids`, producing
  `some (check with bidder)` in the template logic.
* Explicit GPP sections take precedence. The comma split and space join can
  retain double spaces; the case records the observed expression's output without
  making that formatting a future policy requirement.
* `filename` overrides `aliasCode + BidAdapter`, which overrides
  `biddercode + BidAdapter`.
* Bidsxchange remains in the CSV although it is unavailable for UI download.

The false-GPP fallback references bare `gpp_sids`, while neighboring branches use
`page.gpp_sids`. Its intended scope is **DISPUTED**; the reference does not silently
repair that expression or invent a canonical false/missing rule.

A later check must parse emitted CSV, require nonempty records and the expected
columns, compare selected cells, and reject leaked YAML frontmatter or Liquid.
Correct paths and matching copied-file hashes are insufficient. Full escaping,
ordering, duplicate-key behavior, every row, and add/change/delete freshness are
still to be exercised. A fixture containing a comma or quote in a value is a useful
serialization counterexample; it is not a claim that the legacy serializer has
already been validated.

## D5 download consumer contract

This section describes the [download template][download-page] and
[JavaScript consumer][download-client] at the reference pin. It does not claim a
verified backend specification. No request was sent to the service.

| Surface | Observed contract |
| --- | --- |
| Version list | `GET https://js-download.prebid.org/versions`; the client applies `JSON.parse(data)` and reads `versions`. The first entry is labeled latest. Empty, malformed, or failed results use the visible error option. |
| Download request | `POST https://js-download.prebid.org/download`; jQuery receives `modules` and `version`, with `dataType: text`. `removedModules` is deleted before sending. Wire encoding remains unverified. |
| Download output | The response body becomes a JavaScript Blob. The default name is `prebid{version}.js`, overridden by the consumer's `Content-Disposition` filename handling. |
| Saved configuration | A second file, `prebid-config.json`, contains `{version, modules}` using the filtered, renamed request list. |
| Errors | Invalid imported JSON, version-list failures, download failures, and removed modules have distinct consumer messages recorded in the cases. Failure recovery and retries are not verified. |

Bidder UI selection requires `pbjs: true` and does not include
`enable_download: false` pages. Alias adapters retain their own checkbox IDs while
using the underlying adapter's module code. For example, RtbDemand.com's ID is
`rtbdemand_comBidAdapter` and its module code is `adkernelBidAdapter`.
LemmaDigital's explicit filename selects `lemmaDigitalBidAdapter` for both.
Analytics, User ID, recommended, general, and vendor-specific modules have
separate template branches, recorded in the JSON rather than collapsed into one
eligibility predicate. The recommended branch does not test `enable_download`;
the meaning of conflicting flags is not resolved here.

The minimum-version cases use the actual `gppControl_usstates` minimum `8.10.0`
and `storageControl` minimum `10.0.0`. The client compares major and minor numbers;
patch and prerelease precedence are not checked. This describes a source limit,
not permission to treat that approximation as a new compatibility policy.

Version 8 maps `tcfControl`, `consentManagementTcf`, and `paapiForGpt` to
`gdprEnforcement`, `consentManagement`, and `fledgeForGpt`. A combined synthetic
minimum-version/rename case is **DISPUTED**: removal names are collected before
renaming, then filtering compares against renamed names. Separate happy-path
tests of the two operations would miss this interaction.

Configuration round-tripping also remains **DISPUTED**. Export records request
module codes; import looks up checkbox IDs. The alias case records that mismatch
without inventing an inverse mapping or declaring which identity users should
save. V8-renamed modules need the same round-trip scrutiny. Normal imports,
malformed JSON, an empty module array, and unknown values must be distinguished.

Finally, the [README release workflow][release-workflow] and
[contributor instructions][release-guide] say adapter documentation merges after
the adapter ships in a release. Template membership and the client minimum filter
do not independently prove selected-version service availability. Keep source
membership, UI eligibility, and service release availability as separate facts.
No backend replacement or release-policy change follows from this inventory.

## Remaining verification

This reference covers selected facts, not whole-page or site parity. Jekyll
rendering, Docusaurus comparisons, browser interaction, clipboard output, live
examples, service availability, full include dependency closure, CSV edge cases,
all metadata values, and accessibility remain unverified. The references include
counterexamples to make later tests discriminating; they are not executed tests.

Before a case clears migration coverage, independently review its expectations,
verify its pinned source hashes, implement a bounded comparator, demonstrate a
known-bad control, and retain the actual result. Resolve disputed domain policies
with the appropriate maintainer; unchanged-input replay or a passing build cannot
resolve them.

[reference-commit]: https://github.com/prebid/prebid.github.io/commit/b16d95ac1ee95238c070bc9f137d52718287d1cc
[appnexus]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/dev-docs/bidders/appnexus.md#L18-L53
[bidsxchange]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/dev-docs/bidders/bidsxchange.md#L1-L21
[addefend]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/dev-docs/bidders/addefend.md#L1-L11
[bidder-layout]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_layouts/bidder.html#L38-L52
[bidder-meta]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/dev-docs/bidder-meta-data.html#L33-L42
[contributor-defaults]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/dev-docs/bidder-adaptor.md#L1347-L1354
[basic-example]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/dev-docs/examples/basic-example.md#L1-L99
[example-layout]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_layouts/example.html#L27-L64
[example-warning]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/dev-docs/not-for-production-warning.md#L1
[build-warning]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/dev-docs/build-from-source-warning.md#L1
[web-example]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/code/web-example.html#L9-L79
[mobile-gam]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/prebid-mobile/modules/rendering/ios-sdk-integration-gam.md#L249-L260
[gma-tabs]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/code/gma-versions-tabs.html#L1-L61
[bidder-csv]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/dev-docs/bidder-data.csv#L1-L8
[download-page]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/download.md#L58-L112
[download-client]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/assets/js/download.js#L15-L282
[release-workflow]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/README.md#L96-L107
[release-guide]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/dev-docs/bidder-adaptor.md#L1410-L1413
