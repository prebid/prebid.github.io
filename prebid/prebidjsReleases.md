---

layout: page_v2
title: Prebid.js Release History
description: Noteworthy updates in Prebid.js
sidebarType: 1
---

## Important Prebid.js Releases

Not every Prebid.js release contains noteworthy core features, and
the [GitHub releases page](https://github.com/prebid/Prebid.js/releases) can be hard to search for when an important change or bugfix was made.

The table below is a summary of feature changes and important bug fixes in core of Prebid.js. Almost [all releases](https://github.com/prebid/Prebid.js/releases) have new bid adapters or updates to existing adapters -- what's listed here is limited to core functionality. Releases with only minor core changes may not be shown here, and releases with multiple important changes may be shown more than once.

{: .table .table-bordered .table-striped }
| Release | Feature |
| --- | --- |
| 8.0 | Module removals, reliabe (opt-in) transaction identifier, size mapping module & acitivy control. See the [PBJS 8 release notes](/dev-docs/pb8-notes.html) |
| 7.0 | Cleanup of deprecated 'publisherDomain' and 'fpd' config. See the [PBJS 7 release notes](/dev-docs/pb7-notes.html) |
| 6.0 | Removed transpiling for the MSIE 11 browser. [Blog post](https://prebid.org/blog/prebid-6-0-release/) |
| 5.9 | Support numeric ad targeting keys |
| 5.8 | [GPT Pre-Auction module](/dev-docs/modules/gpt-pre-auction.html) supports mcmEnabled flag |
| 5.3 | add AD_RENDER_SUCCEEDED event |
| 5.0 | See [Prebid.js 5.0 blog](https://prebid.org/blog/prebid-5-0-release/) |
| 4.43 | Support [allowSendAllBidsTargetingKeys](/dev-docs/publisher-api-reference/setConfig.html#setConfig-targetingControls) option for control over which keys are sent to the ad server |
| 4.41 | Support [suppressStaleRender](/dev-docs/publisher-api-reference/setConfig.html#auction-options) option |
| 4.40 | First Party Data [enrichment](/dev-docs/modules/enrichmentFpdModule.html) and [validation](/dev-docs/modules/validationFpdModule.html) modules are introduced |
| 4.39 | Prebid Core: removed size check on native icons and image assets |
| 4.38 | PBS Bid Adapter allows stored impression configuration |
| 4.37 | PBS bid adapter adds support for non-purpose1 consent domains |
| 4.36 | Introduced pbjs.installedModules array |
| 4.35 | Introduced pbjs.pbjs.getHighestUnusedBidResponseForAdUnitCode function |
| 4.34 | Bug fix: canBidderRegisterSync ignoring iframe sync disabled by default |
| 4.33 | [MultiBid Module](/dev-docs/modules/multibid.html) |
| 4.32 | [MASS Module](/dev-docs/modules/mass.html) introduces a custom deal render approach |
| 4.31 | PBS Bid Adapter: FPD2.0 bug fix for first party data issue |
| 4.30 | [First Party Data 2.0](/features/firstPartyData.html) changed to `ortb2`, added demand chain object to PBS Bid Adapter |
| 4.29 | PBS Bid Adapter: cooperative sync flag |
| 4.28 | Prebid Server Bid Adapter: use floors module to obtain OpenRTB floor, Support for [ignoreBidderCacheKey](/dev-docs/publisher-api-reference/setConfig.html#setConfig-vast-cache) |
| 4.27 | Update TTL logic |
| 4.26 | Bid Viewability Module (subsequently deprecated) |
| 4.25 | Extended ID permissions |
| 4.24 | Support Multiple Prebid Servers |
| 4.23 | Added skipPbsAliasing feature |
| 4.22 | Improve US Privacy API behavior in iframe |
| 4.17 | Added [getNoBidsForAdUnitCode()](/dev-docs/publisher-api-reference/getNoBidsForAdUnitCode.html) function |
| 4.16 | Bug fix: delete pubcommon test cookie, fix auctionDelay for user ID submodules with callbacks |
| 4.15 | MediaType-specific renderers, added auctionOptions.secondaryBidders |
| 4.13 | Floors Module: update to include floorMin |
| 4.11 | targetingControls.allowTargetingKeys feature |
| 4.10 | PubProvided Id UserId Submodule |
| 4.8 | GDPR updates around modules and storage manager |
| 4.6 | Removed cmpuishown event for TCF2 logic |
| 4.5 | Price Floors: Add bid object into cpmAdjustment function |
| 4.4 | DFP Video Module supports VAST 4 |
| 4.3 | DFP Video Module bug fixed |
| 4.1.1 | Release of the [GPT Pre-Auction Module](https://docs.prebid.org/dev-docs/modules/gpt-pre-auction.html). Price Floors: new signals (location: noData + floorProvider) |
| 4.0 | TCF Purpose 1 and Purpose 2 enforced by default when GDPR enforcement module turned on. Removed Digitrust userId module. Removed audienceNetworkBidAdapter. |
| 3.27.1 | DFP Video Module bug fixed |
| 3.27 | An important bug in the DFP Video Module was introduced with this release and fixed in 4.3 and 3.27.1. The dfpVideoModule only looked in adunit.sizes but adunit.sizes was stripped. Unfortunately there's not a workaround - if you use that video module, you shouldn't use Prebid.js 3.27 through 4.2 inclusive. |
| 3.24 | PBS Bid Adapter allows setting site params |
| 3.23 | If a server-side bid contains imp.ext.prebid.event.win, pbsBidAdapter listens to BidsWon events and hits the URL. |
| 3.22 | Secure creatives use event.origin rather than a hard coded adServerDomain |
| 3.21 | Price Floors Module: New Analytics signals |
| 3.17 | UserID module also exports IDs as eids |
| 3.16 | isSafariBrowser fixed for Chrome and Firefox on iOS |
| 3.15 | Advanced Size Mapping module support adunits of the same name |
| 3.14 | New [GDPR enforcement module](/dev-docs/modules/tcfControl.html) supports enforcing Purpose 1 - DeviceAccess |
| 3.13 | GDPR module supports defaultGdprScope option |
| 3.12 | Initial support for TCF2 - reading and passing consent strings, added [DeviceAccess](/dev-docs/publisher-api-reference/setConfig.html#setConfig-deviceAccess) configuration setting |
| 3.11 | [Advanced Size Mapping module](/dev-docs/modules/sizeMappingV2.html) |
| 3.10 | UserId module provide sub-module ids in ORTB eids format |
| 3.8 | [First Party Data](/dev-docs/publisher-api-reference/setConfig.html#setConfig-fpd) convention |
| 3.3 | [Prebid Ad Slot](/features/pbAdSlot.html) support |
| 3.2 | [Bidder-specific Supply Chain](/dev-docs/modules/schain.html#bidder-specific-supply-chains) support, added [static API option](/dev-docs/modules/consentManagementUsp.html) to the CCPA/USP module |
| 3.1 | pbsBidAdapter: fix for handling response currency |
| 3.0 | [Prebid.js 3.0](https://prebid.org/blog/pbjs-3) |
| 2.44 | Stopped duplicate alias user syncs |
| 2.43 | [US Privacy/CCPA Consent Module](/dev-docs/modules/consentManagementUsp.html) |
| 2.39 | Made originalCpm and originalCurrency fields in bid object always available |
| 2.37 | Fixed userSync endpoint getting called with bidder alias names |
| 2.35 | Support for delaying auctions to obtain user IDs, [sendBidsControl feature](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Send-Bids-Control) |
| 2.31 | [Supply Chain Module](/dev-docs/modules/schain.html) released |
| 2.29 | Fix to ensure native keys are not seen as custom targeting keys |
| 2.26 | PrebidServer Adapter fix to add [cur property](https://github.com/prebid/Prebid.js/issues/3951) to oRTB |
| 2.24 | User ID Module: added method pbjs.getUserIds() to retrieve userIds for use in external codes |
| 2.23 | [Updated](https://github.com/prebid/Prebid.js/issues/3894) sizeConfig logic around multiformat bids |
| 2.22 | [Safeframe issue](https://github.com/prebid/prebid-universal-creative/pull/64) resolved |
| 2.21 | Standardized COPPA support |
| 2.20 | AuctionEnd event now always execute when auction completes even when there's no callback handler |
| 2.18 | Currency Module: always adding originalCpm and originalCurrency to bid object |
| 2.17 | Ability to limit the size of keys sent to ad server via [targeting controls](/dev-docs/publisher-api-reference/setConfig.html#setConfig-targetingControls) |
| 2.16 | [User ID module](/dev-docs/modules/userId.html) refactored to support external sub-modules |
| 2.10 | [User ID module](/dev-docs/modules/userId.html) released with support for PubCommon ID and Unified ID |
| 2.10 | A bidder which responded in time is now considered a timely bidder, even if it responded with no bids. See [PR 3696](https://github.com/prebid/Prebid.js/pull/3696) |
| 2.9 | Add 'hb_cache_host' targeting for video bids when cache is set to support upcoming video cache redirector |
| 2.9 | remove removeRequestId logic. See [PR 3698](https://github.com/prebid/Prebid.js/pull/3698) |
| 2.8 | Added [s2sConfig](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Server-to-Server) `syncUrlModifier` option to modify userSync URLs |
| 2.8 | Add hb_uuid and hb_cache_id back to dfp module after having been removed in 2.7 |
| 2.6 | Update auction algorithm logic for long-form. See [PR 3625](https://github.com/prebid/Prebid.js/pull/3625) |
| 2.6 | In case Prebid.js is called from within an iFrame, matchMedia is applied to window.top, not the containing iFrame. |
| 2.5 | Fix event firing on native click. See [PR 3589](https://github.com/prebid/Prebid.js/pull/3589) |
| 2.4 | [Long Form video](/prebid-video/video-long-form.html) |
| 2.4 | Bug fix for hb_uuid/hb_cache_id. See [PR 3568](https://github.com/prebid/Prebid.js/pull/3568) |
| 2.3 | Bug fix for Firefox for some ads that use document.write See [PR 3524](https://github.com/prebid/Prebid.js/pull/3524) |
| 2.1 | Refined the bid.adId and bidRequest.bidId. See [PR 3340](https://github.com/prebid/Prebid.js/pull/3440) |
| 2.0 | The [limited bid caching](/dev-docs/faq.html#does-prebidjs-cache-bids) feature now turned off by default. |
| 1.39 | The [limited bid caching](/dev-docs/faq.html#does-prebidjs-cache-bids) feature can be optionally turned off. |
| 1.39 | Bug fix in the [currency module](/dev-docs/modules/currency.html) introduced with 1.37 where it wasn't calling for the currency conversion file when defaultRates are specified. |
| 1.37 | The default location of the [currency](/dev-docs/modules/currency.html) conversion file changed. |
| 1.36 | New NO_BID event makes a "no bids" response available to analytics adapters. |
| 1.34 | User-sync iframes are now inserted at the bottom of the head element, rather than at the top. |
| 1.30 | Bugfix to Auction Init events. The `timestamp` had been removed in 1.28 and caused issues in some Analytics Adapters. |
| 1.27 | Render outstream safeframe with prebid universal creative. |

## Further Reading

+ [Getting Started With Prebid.js](/dev-docs/getting-started.html)
