# Legacy template behavior catalog

Source reference: [`b16d95ac1ee95238c070bc9f137d52718287d1cc`](https://github.com/prebid/prebid.github.io/tree/b16d95ac1ee95238c070bc9f137d52718287d1cc), inspected October 4, 2026. This catalog accounts for **12 layouts and 73 includes: 85 exact paths**. Every path below links to that pinned source, including templates without a literal consumer in the inventory.

Evidence level throughout: **source-inspected behavior**. The source describes the output or activity below; this is not evidence that Jekyll rendered it successfully, that an external service still works, or that Docusaurus preserves it. The inventory used for enumeration was `/tmp/prebid-m0-inventory-pinned.json`; source bytes were read from `/tmp/prebid-m0-reference-b16d95a`. Those temporary locations are collection inputs, not durable verification receipts. The source pin and the inventory's file hashes identify the reference.

This complements the bounded cases in [REFERENCE_CONTRACT.md](REFERENCE_CONTRACT.md). Each row identifies further review work, not an accepted migration result. No external scripts, demos, forms, or services were executed during this catalog pass.

## How to read dependencies

**Shell** means the shared head, top navigation, sidebar, and footer includes described below. It brings page/site metadata, navigation data, CSS, JavaScript, search, and analytics dependencies along with the content wrapper. Common layouts omit the footer for a page titled `Credits`; some also test `page.layout != "home"`. `page.is_full_screen`, where present, skips automatic body decoration, not the entire shell.

**No literal consumer** means the inventory found no literal include or parsed layout reference. It does not establish that the file is unused: dynamic includes, Jekyll defaults/plugins, and external consumers remain outside that inference. In particular, `video_sample` computes its include from `page.videoType`; its video partials must not be retired based on zero literal references.

Static prose/code partials still depend on their caller's Markdown processing, heading context, link policy, and assets. A field, SDK method, legal statement, or product claim summarized here is a fact about the pinned documentation, not an independent confirmation of the underlying product.

## Layouts — 12

| Exact source | Generated behavior and dependencies / consumer role | Next review need |
| --- | --- | --- |
| [_layouts/analytics.html][L01] | Shell; analytics pages receive `page.title` as H1 and an automatic Features H2 before `content`, unless `is_full_screen` is set. No feature table is generated here. | Confirm heading hierarchy, full-screen behavior, and whether Features is intentional for every analytics page. |
| [_layouts/api_prebidjs.html][L02] | Shell; publisher API pages receive an H2 title and links back to the publisher API index both before and after content. Full-screen mode bypasses those additions. | Preserve back-link destinations/fragments and establish title ownership without duplicate headings. |
| [_layouts/bidder.html][L03] | Shell; bidder title, unavailable notice from `enable_download`/`pbjs_version_notes`, server-only notice from `s2s_only`, metadata Features table, content, eleven bidder-specific targeting keys truncated to 20 characters, former-code text from `prevBiddercode`, and index links. Uses the global `page` metadata through the bidder partial. | Review every automatic block, false/missing values, aliases/removals, long bidder codes, and full-screen bypass against the metadata contract. |
| [_layouts/example.html][L04] | Shell; heading from `page.description`, optional `why_link`, bullets from `page.about`, non-production warning before content, build-selection warning after it, and fixed further-reading links. | Preserve warnings and list ordering; distinguish executable example content from its explanatory wrapper. |
| [_layouts/fourofour.html][L05] | Head and top navigation; fixed 404 title/message and `/assets/images/404image.png`. Does not insert page content, sidebar, or footer. | Verify the actual host's 404 routing plus image and accessible alternative text. |
| [_layouts/home.html][L06] | Head/nav plus hardcoded product, format, repository, subscription, and social sections; six inline format icons; HubSpot form script; footer and another direct `body-end` include. Uses fixed links/assets rather than page content. | Reconcile current product/link content; decide subscription behavior; review duplicate script initialization and responsive/accessibility behavior separately from parity. |
| [_layouts/internal_api_prebidjs.html][L07] | Publisher-API-style shell with internal API index links around H2 title/content; `is_full_screen` bypass. | Preserve the internal API return destination and title semantics. |
| [_layouts/page_v2.html][L08] | General Shell/content wrapper. Adds the partner listing only when `page.description == "Partners"`; contains an inactive commented sidebar script. | Preserve conditional partner output and navigation state; do not promote commented code into required behavior. |
| [_layouts/pb-video-template.html][L09] | Shell and `myElement1` player container; loads JW Player CDN code, shows a debug alert, fetches `/assets/js/video/{page.videoMFile}.js`, then calls `loadVideoData()`. No literal consumer. | Establish intended consumers/retirement, dynamic script allowlist, player license/dependencies, and whether debug behavior should be corrected. |
| [_layouts/test.html][L10] | Older bidder Shell: title, bidder code, server-only notice, and three untruncated keys unless `biddercode_longer_than_12` is true; full-screen bypass. No literal consumer. | Decide whether to retire this older variant; do not confuse its key policy with the current bidder layout. |
| [_layouts/userid.html][L11] | Shell; User ID return links, H2 title, and automatic table of `useridmodule`, `eidsource`, `bidRequestUserId`, and code-formatted `example`, followed by content. | Verify missing fields, example escaping, table preservation, and return-link fragments. |
| [_layouts/video_sample.html][L12] | Computes `/video/{page.videoType}.html` and includes it dynamically, then nav/sidebar/content, optional Partners output, and conditional footer. The selected include supplies document/head/player setup. | Resolve actual `videoType` values to pinned partials; verify document boundaries and each demo's external dependencies. A literal-only graph does not resolve this edge. |

## Shared site shell and navigation — 7 includes

| Exact source | Generated behavior and dependencies / consumer role | Next review need |
| --- | --- | --- |
| [_includes/head.html][I01] | Opens the HTML/head/body shell and includes `head--common.html`; used by ordinary layouts. | Assign document ownership to the target framework; retain required metadata without nested document tags. |
| [_includes/head--common.html][I02] | Description/title from `page.description`, `page.head_title`, and `page.title`; favicon/site-verification metadata; `site.baseurl` CSS/scripts; jQuery, docs/main/home scripts, Bootstrap, Prism CSS, DocSearch CSS, and a consentmanager bootstrap with browser globals, locators, and remote delivery. | Inventory required assets/metadata. Honor the provisional consentmanager/Algolia exclusions without assuming the associated demo gating and search behavior are automatically replaced. |
| [_includes/nav.html][I03] | Builds header dropdown groups from `site.data.dropdown_v2`, including titles, classes, IDs, links, and click IDs; exposes a search container. Uses Bootstrap collapse/dropdowns. | Check data types/order, menu hierarchy, keyboard/focus behavior, search replacement, and all destination URLs. |
| [_includes/left_nav.html][I04] | Generates a multi-level collapsible sidebar from `site.data.sidebar`; active/open state uses `page.url`, `sidebarType`, and special API/bidder layout handling. Category headings can be non-links. | Pin expected state for ordinary/API/bidder pages. Inspect the source's mixed comparison syntax and unquoted `bidder` conditions through bounded rendering instead of assuming intended behavior. |
| [_includes/footer.html][I05] | License text from `site.license`/`licenseUrl`, year from `site.time`, privacy link, Google Analytics initialization/consent defaults, jQuery external-HTTP-link adjustment, Prism loading, and `body-end.html`. | Separate visible footer parity from analytics policy and script effects; verify license values, year, and any deliberate integration removal. |
| [_includes/body-end.html][I06] | Loads DocSearch v3 and initializes the header search widget against the configured Algolia index; a transformation deduplicates results by URL origin/path. Also included directly by the home layout. | Resolve search policy before porting; preserve any chosen result behavior and prevent duplicate initialization. No remote index quality was checked. |
| [_includes/partners.html][I07] | Converts `site.data.partners` into JavaScript arrays for leader, technology, publisher, and community tables, then invokes `/assets/js/dynamicTable.js`. Logos/links are data-driven; the buyer table is HTML-commented. | Verify member data, escaped values, assets, grouping, and link behavior; do not treat the commented buyer output as active browser content. |

## Inline format artwork — 6 includes

| Exact source | Generated behavior and dependencies / consumer role | Next review need |
| --- | --- | --- |
| [_includes/icon__format--amp.svg][I08] | Static inline SVG paths, fixed colors, clipping ID, and 99×83 viewBox; used in the home AMP card. | Preserve viewBox/clipping and accessible labeling in its parent; inspect visual output. |
| [_includes/icon__format--ctv.svg][I09] | Static inline SVG paths with clipping IDs and an approximately 375×375 viewBox; used in the home Connected TV card. | Check scaling relative to other format icons and ID collisions if reused. |
| [_includes/icon__format--display.svg][I10] | Static inline SVG paths, fixed colors, clipping ID, and 99×83 viewBox; home Display card. | Verify appearance, clipping, and parent labeling. |
| [_includes/icon__format--multi-format.svg][I11] | Static inline SVG paths/clipping and 99×83 viewBox; home Multi-Format card. | Verify appearance, clipping, and parent labeling. |
| [_includes/icon__format--native.svg][I12] | Static inline SVG paths with multiple clipping IDs and 99×83 viewBox; home Native card. | Preserve all clip references and check repeated-instance IDs. |
| [_includes/icon__format--video.svg][I13] | Static inline SVG paths/clipping and 99×83 viewBox; home Video card. | Verify appearance, clipping, and parent labeling. |

SVG structure and attributes were inspected; path geometry was omitted from the inspection display. This is not a visual comparison or a new icon design.

## Notices and reference tables — 18 includes

| Exact source | Generated behavior and dependencies / consumer role | Next review need |
| --- | --- | --- |
| [_includes/alerts/alert_important.html][I14] | Important alert wrapper around `include.content`, with Markdown-in-span, icon, and `role="alert"`. | Preserve supplied content, severity, inline Markdown, and accessible semantics. |
| [_includes/alerts/alert_note.html][I15] | Note wrapper around `include.content`, with Markdown-in-span and info icon. | Preserve content and appropriate note semantics when converting admonitions. |
| [_includes/alerts/alert_tip.html][I16] | Tip wrapper around `include.content`, with Markdown-in-span and check icon. | Preserve content, heading, and inline formatting. |
| [_includes/alerts/alert_warning.html][I17] | Warning wrapper around `include.content`, with Markdown-in-span and warning icon. | Preserve warning text and visibility; test content supplied through Liquid captures. |
| [_includes/dev-docs/bidder-meta-data.html][I18] | Generates the bidder Features table from global `page` fields. Uses different missing/false defaults across flags; media display depends on `no-display`; GPP prefers `gpp_sids` then support fallback; app support is conditional on `pbs`. Includes IDs, member status, privacy, compression, blocking, deals, formats, and user IDs. | Use a field-policy table and representative missing/false/partial cases. Review the unqualified `gpp_sids` reference in one condition; do not silently copy inconsistent defaults. |
| [_includes/dev-docs/build-from-source-warning.md][I19] | Static information notice that example builds contain all adapters/modules, with a Download link; used by example pages and authoring guidance. | Preserve message and link as visible content. |
| [_includes/dev-docs/fingerprinting.md][I20] | Static warning about fingerprinting-like APIs and build classification. | Preserve warning styling/text; content-policy changes require a recorded decision. |
| [_includes/dev-docs/loads-external-javascript.md][I21] | Static disclosure that a module loads external, non-open-source, unreviewed code. | Preserve the complete disclosure and its visibility. |
| [_includes/dev-docs/native-assets.md][I22] | Markdown table mapping native asset names to descriptions and `##hb_native_*##` macros. | Verify all table rows/cells and literal macros; inspect the unusual separator syntax under the target parser. |
| [_includes/dev-docs/native-image-asset-sizes.md][I23] | Explanatory text and literal JavaScript examples for native image/icon sizes versus aspect ratios. | Preserve fenced examples byte-for-byte where possible and retain both alternatives. |
| [_includes/dev-docs/not-for-production-warning.md][I24] | Static warning that the CDN example Prebid.js build is unsuitable for production; used by the example layout. | Ensure automatic insertion remains attached to executable examples. |
| [_includes/dev-docs/pbjs-adapter-required-for-pbs.md][I25] | Static warning linking the client adapter requirement to `transformBidParams`, plus a GitHub issue link. | Preserve the referenced warning while separately reviewing its applicability to current releases. |
| [_includes/dev-docs/storageAllowed.md][I26] | Static notice on legal review, browser storage disclosures, and potential redundancy with user ID systems. | Preserve text and info styling; distinguish migration parity from legal/content updating. |
| [_includes/dev-docs/vendor-exception.md][I27] | Static warning plus an extra sentence interpolating `include.gvlId` when supplied. | Test both parameter-present and parameter-absent output; preserve the ID and full warning. |
| [_includes/legal-warning.html][I28] | Shared legal disclaimer in a Markdown-enabled warning block; used throughout privacy/consent documentation. | Retain full disclaimer and rendering; no legal adequacy assessment is implied. |
| [_includes/default-keyword-targeting.md][I29] | H1 and table for `hb_pb`, `hb_adid`, and `hb_bidder`; no literal consumer. | Locate intended use or record retirement; preserve heading level and literal keys if retained. |
| [_includes/send-all-bids-keyword-targeting.md][I30] | H1, 20-character/case-sensitivity explanation, truncation example, and bidder-specific targeting table; no literal consumer. | Reconcile with the current bidder layout, verify examples/links, and record retained or retired use. |
| [_includes/adops/adops-creative-declaration.html][I31] | GAM creative-provider declaration guidance with an external help link and local setup screenshot; no literal consumer. | Determine current use and content currency; preserve the image/link or record retirement explicitly. |

## Tabs, examples, media, and service hooks — 12 includes

| Exact source | Generated behavior and dependencies / consumer role | Next review need |
| --- | --- | --- |
| [_includes/code/gma-versions-tabs.html][I32] | Bootstrap GMA v12/v11 tabs with IDs based on `include.id` and XML-escaped Swift from `include.gma12`/`gma11`; used by iOS guidance. | Preserve both examples/default selection, unique IDs, ARIA relationships, keyboard operation, and literal code. |
| [_includes/code/mobile-sdk.html][I33] | Kotlin/Swift tabs from `include.id`, `kotlin`, and `swift`, with XML-escaped code and language classes. | Verify duplicate container IDs and the Swift tab ID spelling; preserve language labels and copyable examples. |
| [_includes/code/web-example.html][I34] | Result/HTML/JS/source tabs. Executes `include.js`, inserts `include.html`, and selects Prebid/GPT/AST loaders from `include.scripts`; empty selection defaults to Prebid+GPT. Produces a separate source view using page title and CDN URLs. | Establish demo execution/isolation and script ordering; verify escaped code versus active result and generated source equivalence. Review the comment's differing stated default. |
| [_includes/docs/combined-ad-experience-controls.html][I35] | Android/iOS tabs applying `markdownify` to `include.kotlin`/`swift`, rather than escaping code; parameterized IDs. No literal consumer. | Resolve consumer/retirement and preserve rich Markdown semantics if retained. |
| [_includes/example_tab.html][I36] | Attempts an examples index from `site.pages`, layout filters, `pid` sorting, URLs/titles, and optional Beta badges; includes a separate `player_example` query. No literal consumer. | Review Liquid syntax and actual consumers before rebuilding this dynamic index; do not infer successful legacy output. |
| [_includes/live_demo.html][I37] | Google Visualization loading, local log-diagram script, example iframe, open/refresh controls, and chart/loading elements. Uses `site.github.url`, jQuery, and access to iframe contents; referenced by deprecated homepage content. | Confirm retention and iframe/origin behavior; locate demo/chart dependencies and handle external library failure before claiming functionality. |
| [_includes/loadScript.html][I38] | Defines a global Promise-returning loader that appends a script to `document.head` and resolves/rejects on load/error; used by three video partials. | Preserve or replace loading/error semantics; account for global name and duplicate invocation. |
| [_includes/astjs.html][I39] | Consent-gated `text/plain` loader for Microsoft's AST SDK, selected by web examples. | Decide demo loading under the target integration policy; do not equate copying this inert tag with executing AST. |
| [_includes/gptjs.html][I40] | Consent-gated asynchronous `text/plain` loader for Google Publisher Tag; used by web/video examples. | Verify chosen gating, load order, and `googletag` availability in a controlled demo environment. |
| [_includes/prebidjs-non-prod.html][I41] | Consent-gated asynchronous loader for jsDelivr's `prebid.js@latest` non-production build; shared by examples/video. | Preserve the non-production warning and explicitly decide version/gating behavior; network delivery remains unverified. |
| [_includes/vimeo-iframe.html][I42] | Responsive Vimeo iframe from `include.id`/`title`; initial `about:blank` plus consent-gated remote URL and player API script. | Preserve title/aspect ratio and select replacement gating/loading behavior; verify actual video availability separately. |
| [_includes/wth_form.html][I43] | Was-this-page-helpful radio form, named with `page.title`, posting to an external SimpleForm endpoint. No literal consumer. | Decide use/retirement and service ownership before enabling submissions; no form was sent during inspection. |

## Mobile documentation partials — 16 includes

These partials principally inject documentation, tables, images, and code. References to SDKs, ad servers, CDN creatives, or tracking describe the app integration; they are not automatically browser dependencies of the documentation page. The exception needing special inspection is the literal script-containing HTML sample in `gam-native-adops.html`.

| Exact source | Generated behavior and dependencies / consumer role | Next review need |
| --- | --- | --- |
| [_includes/mobile/adunit-config-android.md][I44] | Original Android API configuration text/code: impression ORTB merging, refresh APIs and 3.0 removal notice, GPID, ad position, and impression tracking with stated `burl` limitation. Used by GAM/Next-Gen original API pages. | Preserve Kotlin/code fences, warnings, version qualifications, headings, and links; confirm any language-label correction explicitly. |
| [_includes/mobile/adunit-config-ios.md][I45] | Original iOS API text/Swift for ORTB merging, refresh, GPID, ad position, impression tracking, SKAdNetwork StoreKit flow, and SKOverlay. | Preserve platform-specific methods, all sections, and links; independently review SDK currency if updating content. |
| [_includes/mobile/banner-params.md][I46] | Banner parameter reference: deprecated class notice, sizes, interstitial percentage constraints, and API-framework enum values/links. Used across platform recipes. | Preserve required conditions, enum values, warning, and heading anchors. |
| [_includes/mobile/gam-native-adops.html][I47] | Nested GAM setup instructions and an HTML native-creative sample containing literal PUC tracking script tags inside `<pre>`; image/title/macros and follow-up links. No literal consumer. | Determine use; inspect whether example markup stays inert code, then preserve macros and setup sequence or record retirement. |
| [_includes/mobile/intro-admob.md][I48] | Shared AdMob overview/prerequisites, mediation flow diagram, integration steps, AdOps link, and tracking table. Builds platform links with `include.platform`. | Render Android/iOS parameter cases; preserve diagram, links, table values, and SDK-version note. |
| [_includes/mobile/intro-applovin.md][I49] | MAX-specific prerequisites, waterfall/adapter explanation and diagram, integration/AdOps steps, tracking table, and platform-dependent links. | Preserve MAX-specific distinctions and both platform links; handle wording corrections separately from parity. |
| [_includes/mobile/intro-bidding-only.md][I50] | GMA bidding-only overview, tradeoff/prerequisite tables, diagram, detailed rendering/tracking flow, steps, and creative/cache/AdOps matrix; `include.platform` selects URLs. | Check all tables and diagrams, platform substitution, native/video distinctions, and dated tracking notes. |
| [_includes/mobile/intro-custom.md][I51] | Custom/no-ad-server guidance comparing bidding-only versus SDK rendering, two flow diagrams, tradeoffs, prerequisites, integration steps, and platform-specific links. | Preserve both alternatives, images, conditional guidance expressed in prose, and all platform link variants. |
| [_includes/mobile/intro-nextgen-bidding-only.md][I52] | Next-Gen counterpart of bidding-only guidance: SDK-specific URLs/text, flow, creative/cache matrix, tracking table, and platform substitution; current literal caller is Android. | Verify distinctions from GMA and intended platform scope; do not infer a second platform implementation from reusable parameters. |
| [_includes/mobile/intro-nextgen-prebid-rendered.md][I53] | Next-Gen SDK-rendered flow including event handoff, rewarded VAST, native and third-party rendering, integration/AdOps matrices, and tracking/version notes. | Preserve complete flow/table semantics; resolve internal narrative-versus-table discrepancies through content review rather than automatic normalization. |
| [_includes/mobile/intro-prebid-rendered.md][I54] | GMA SDK-rendered equivalent, with instream-video row and explicit bidding-only application-code qualification; diagrams/tables and `include.platform` URLs. | Verify both platform expansions, instream distinction, rendered HTML examples in prose, and tracking/version claims. |
| [_includes/mobile/native-params.md][I55] | Native request parameter reference: assets, trackers, defaults, context, placements, sequence, URL support, privacy, and extensions; links the external Native specification. | Preserve supported/unsupported distinctions, defaults, field spelling, and anchors. |
| [_includes/mobile/rendering-adunit-config-android.md][I56] | Android rendering API ad-position explanation, AdCOM reference, and Kotlin method example. | Preserve method/code and placement-reference fragment. |
| [_includes/mobile/rendering-adunit-config-ios.md][I57] | iOS rendering API ad-position explanation, AdCOM reference, and Swift property example. | Preserve platform difference and placement-reference fragment. |
| [_includes/mobile/rewarded-server-side-configuration.md][I58] | Rewarded `rwdd` passthrough schema table, completion/close rules, app-supplied ORTB example, stored-request JSON, and proposal link; reused by rendering integrations. | Preserve every field/default/example, HTML-in-table formatting, JSON literals, and source updates shared by all consumers. |
| [_includes/mobile/video-params.md][I59] | Video request parameter reference: deprecated placement and replacement `plcmt`, default values, removed SDK class warnings, API/playback/protocol/creative-attribute enums, MIME/bitrate/duration, and skippability. | Preserve numeric enum mappings, deprecation/removal notices, required MIME semantics, and all anchors. |

## Older API browser partials — 3 includes

No literal consumer was recorded for any of these three; that is a review input, not retirement approval.

| Exact source | Generated behavior and dependencies / consumer role | Next review need |
| --- | --- | --- |
| [_includes/api/pb-api-search-results.html][I60] | jQuery-driven search: reads URL parameters, fetches a sandbox filename list and HTML documents, extracts title/description/category strings, and inserts result HTML or no-result text. | Establish use and sandbox-data availability; review query encoding, content insertion, and asynchronous completion before retaining. |
| [_includes/api/pb-api-template.html][I61] | Static example endpoint/arguments/response markup with placeholder values and a Hide Arguments button; relies on CSS/possible external handlers. | Locate intended authoring/runtime role, button wiring, and ID reuse; otherwise record retirement. |
| [_includes/api/pb-api-test.html][I62] | API categories from `site.data.pb-api`; query-selected sandbox HTML loads into panels; search redirects, optional bid-response samples, hash navigation, and Prism invocation. | Confirm data, sandbox paths, jQuery/Prism timing, query behavior, and content insertion if retaining. |

## Video example partials — 11 includes

These are executable document/head fragments selected principally through dynamic video dispatch. They depend on caller markup and global functions as well as their explicit nested includes. Several use consentmanager or older consent-class conventions; removing a consent integration does not define whether these scripts should execute, remain inert, or be replaced. External player/CDN/ad-server/media availability and behavior were not exercised.

| Exact source | Generated behavior and dependencies / consumer role | Next review need |
| --- | --- | --- |
| [_includes/video/head.html][I63] | Shared head plus non-production Prebid; loads Brid player with consent attributes. For a specific `page.videoType`, defines an instream auction, GAM video URL handoff, and custom bidder-targeting functions. No literal consumer. | Resolve intended dispatch value/callers and player initialization; identify current ad/cache behavior before retention. |
| [_includes/video/mock-video-bid.html][I64] | Configures Prebid debugging interception to return a fixed video bid/VAST; used by JW/Video.js examples. The mock still references external MP4 and click-through URLs. | Preserve controlled mock semantics, ensure the debugging module exists, and distinguish mocked auction evidence from network media playback. |
| [_includes/video/pb-is-jw01.html][I65] | Common head, non-production Prebid, loader, and mock; loads hosted JW library, sets an example license value, auctions instream video using local cache, then supplies GAM VAST XML to `window.runJWPlayer`. | Resolve dynamic consumer, caller callback/DOM, consent behavior, license/library availability, and rejected/no-bid paths. |
| [_includes/video/pb-is-jw02.html][I66] | Similar instream/mock/local-cache flow, but loads the versioned JW 8.0.5 player script; expects the same caller callback. | Preserve the distinct player variant only if needed; verify compatibility, load failure, and callback ownership. |
| [_includes/video/pb-is-vjs.html][I67] | Common/Prebid/loader/mock includes plus Video.js 6.4 and VAST/VPAID assets; calls `runVideoJSCode`, then passes a callback delivering GAM VAST XML to `invokeVideoPlayer`. | Account for both caller globals, player/plugin versions, CSS, callback ordering, and failure paths. |
| [_includes/video/pb-lf-fw.html][I68] | Common/Prebid head with external jQuery/UI, Popper, and FreeWheel manager; consent-gated ad-pod auction and FreeWheel targeting. Generates bid/key/pod tables, reads an industry mapping from localStorage, and supplies playback timers/skip controls using caller elements/globals. | Resolve mixed consent conventions, placeholder cache endpoint, player dependencies, DOM/global ownership, and data/table correctness before any demo claim. |
| [_includes/video/pb-os-basic-ima.html][I69] | Only a document shell and common head; IMA/demo behavior must come from the caller or other assets. | Inspect its actual dynamic caller and avoid attributing an IMA integration to this empty wrapper alone. |
| [_includes/video/pb-os-dfp.html][I70] | Common/Prebid/GPT includes; outstream auction, one-shot ad-server initialization, timeout fallback, GPT slot setup, targeting, and refresh. | Verify caller container, no-bid/timeout behavior, ad-server identifiers, gating, and external dependencies. |
| [_includes/video/pb-os-nas-renderer.html][I71] | Common/Prebid includes; custom AN outstream renderer from an external CDN, inline/VAST response handling, auction, and highest-bid rendering. The VAST-fetch branch references `resp`. | Verify that fallback variable/response handling, empty-bid behavior, external renderer, and target DOM before preserving executable behavior. |
| [_includes/video/pb-os-nas.html][I72] | Common/Prebid includes; outstream auction without an ad server, renders the highest bid when present, otherwise logs a warning. | Verify dynamic caller, renderer supplied with the bid, target container, timeout, and no-bid outcome. |
| [_includes/video/pb-vm-vjs.html][I73] | Common head, consent-gated Video.js 7.20.2, IMA SDK, contrib-ads and videojs-ima scripts/CSS, then non-production Prebid. Caller owns the actual video-module setup. | Review player/plugin order, integrity attributes, consent activation, caller code, and external media behavior. |

## Remaining evidence boundaries

The catalog covers the 85 template files, not every transitive JavaScript/CSS/image/data implementation or every document caller. Dependencies named here require their own pinned inputs and representative checks. Source comments and dormant branches are distinguished where encountered; no exhaustive Liquid execution or browser reachability analysis was performed.

Next review should select expected semantic facts independently from these sources and the bounded reference cases, resolve intentionally retired output, then test the chosen target behavior. Neither an inventory match nor this catalog should change a ledger entry to verified.

[L01]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_layouts/analytics.html
[L02]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_layouts/api_prebidjs.html
[L03]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_layouts/bidder.html
[L04]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_layouts/example.html
[L05]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_layouts/fourofour.html
[L06]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_layouts/home.html
[L07]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_layouts/internal_api_prebidjs.html
[L08]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_layouts/page_v2.html
[L09]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_layouts/pb-video-template.html
[L10]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_layouts/test.html
[L11]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_layouts/userid.html
[L12]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_layouts/video_sample.html
[I01]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/head.html
[I02]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/head--common.html
[I03]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/nav.html
[I04]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/left_nav.html
[I05]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/footer.html
[I06]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/body-end.html
[I07]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/partners.html
[I08]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/icon__format--amp.svg
[I09]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/icon__format--ctv.svg
[I10]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/icon__format--display.svg
[I11]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/icon__format--multi-format.svg
[I12]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/icon__format--native.svg
[I13]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/icon__format--video.svg
[I14]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/alerts/alert_important.html
[I15]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/alerts/alert_note.html
[I16]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/alerts/alert_tip.html
[I17]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/alerts/alert_warning.html
[I18]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/dev-docs/bidder-meta-data.html
[I19]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/dev-docs/build-from-source-warning.md
[I20]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/dev-docs/fingerprinting.md
[I21]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/dev-docs/loads-external-javascript.md
[I22]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/dev-docs/native-assets.md
[I23]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/dev-docs/native-image-asset-sizes.md
[I24]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/dev-docs/not-for-production-warning.md
[I25]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/dev-docs/pbjs-adapter-required-for-pbs.md
[I26]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/dev-docs/storageAllowed.md
[I27]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/dev-docs/vendor-exception.md
[I28]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/legal-warning.html
[I29]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/default-keyword-targeting.md
[I30]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/send-all-bids-keyword-targeting.md
[I31]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/adops/adops-creative-declaration.html
[I32]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/code/gma-versions-tabs.html
[I33]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/code/mobile-sdk.html
[I34]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/code/web-example.html
[I35]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/docs/combined-ad-experience-controls.html
[I36]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/example_tab.html
[I37]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/live_demo.html
[I38]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/loadScript.html
[I39]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/astjs.html
[I40]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/gptjs.html
[I41]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/prebidjs-non-prod.html
[I42]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/vimeo-iframe.html
[I43]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/wth_form.html
[I44]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/mobile/adunit-config-android.md
[I45]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/mobile/adunit-config-ios.md
[I46]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/mobile/banner-params.md
[I47]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/mobile/gam-native-adops.html
[I48]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/mobile/intro-admob.md
[I49]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/mobile/intro-applovin.md
[I50]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/mobile/intro-bidding-only.md
[I51]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/mobile/intro-custom.md
[I52]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/mobile/intro-nextgen-bidding-only.md
[I53]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/mobile/intro-nextgen-prebid-rendered.md
[I54]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/mobile/intro-prebid-rendered.md
[I55]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/mobile/native-params.md
[I56]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/mobile/rendering-adunit-config-android.md
[I57]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/mobile/rendering-adunit-config-ios.md
[I58]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/mobile/rewarded-server-side-configuration.md
[I59]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/mobile/video-params.md
[I60]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/api/pb-api-search-results.html
[I61]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/api/pb-api-template.html
[I62]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/api/pb-api-test.html
[I63]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/video/head.html
[I64]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/video/mock-video-bid.html
[I65]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/video/pb-is-jw01.html
[I66]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/video/pb-is-jw02.html
[I67]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/video/pb-is-vjs.html
[I68]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/video/pb-lf-fw.html
[I69]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/video/pb-os-basic-ima.html
[I70]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/video/pb-os-dfp.html
[I71]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/video/pb-os-nas-renderer.html
[I72]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/video/pb-os-nas.html
[I73]: https://github.com/prebid/prebid.github.io/blob/b16d95ac1ee95238c070bc9f137d52718287d1cc/_includes/video/pb-vm-vjs.html
