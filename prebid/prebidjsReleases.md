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
| 3.16 | isSafariBrowser fixed for Chrome and Firefox on iOS |
| 3.15 | Advanced Size Mapping module support adunits of the same name |
| 3.14 | New [GDPR enforcement module](/dev-docs/modules/gdprEnforcement.html) supports enforcing Purpose 1 - DeviceAccess |
| 3.13 | GDPR module supports defaultGdprScope option |
| 3.12 | Initial support for TCF2 - reading and passing consent strings, added [DeviceAccess](/dev-docs/publisher-api-reference.html#setConfig-deviceAccess) configuration setting |
| 3.11 | [Advanced Size Mapping module](/dev-docs/modules/sizeMappingV2.html) |
| 3.10 | UserId module provide sub-module ids in ORTB eids format |
| 3.8 | [First Party Data](/dev-docs/publisher-api-reference.html#setConfig-fpd) convention |
| 3.3 | [Prebid Ad Slot](/features/pbAdSlot.html) support |
| 3.2 | [Bidder-specific Supply Chain](/dev-docs/modules/schain.html#bidder-specific-supply-chains) support, added [static API option](/dev-docs/modules/consentManagementUsp.html) to the CCPA/USP module |
| 3.1 | pbsBidAdapter: fix for handling response currency |
| 3.0 | [Prebid.js 3.0](/blog/pbjs-3) |
| 2.44 | Stopped duplicate alias user syncs |
| 2.43 | [US Privacy/CCPA Consent Module](/dev-docs/modules/consentManagementUsp.html) |
| 2.39 | Made originalCpm and originalCurrency fields in bid object always available |
| 2.37 | Fixed userSync endpoint getting called with bidder alias names |
| 2.35 | Support for delaying auctions to obtain user IDs, [sendBidsControl feature](/dev-docs/publisher-api-reference.html#setConfig-Send-Bids-Control) |
| 2.31 | [Supply Chain Module](/dev-docs/modules/schain.html) released | 
| 2.29 | Fix to ensure native keys are not seen as custom targeting keys |
| 2.26 | PrebidServer Adapter fix to add [cur property](https://github.com/prebid/Prebid.js/issues/3951) to oRTB |
| 2.24 | User ID Module: added method pbjs.getUserIds() to retrieve userIds for use in external codes |
| 2.23 | [Updated](https://github.com/prebid/Prebid.js/issues/3894) sizeConfig logic around multiformat bids |
| 2.22 | [Safeframe issue](https://github.com/prebid/prebid-universal-creative/pull/64) resolved |
| 2.21 | Standardized COPPA support |
| 2.20 | AuctionEnd event now always execute when auction completes even when there's no callback handler |
| 2.18 | Currency Module: always adding originalCpm and originalCurrency to bid object |
| 2.17 | Ability to limit the size of keys sent to ad server via [targeting controls](/dev-docs/publisher-api-reference.html#setConfig-targetingControls) |
| 2.16 | [User ID module](/dev-docs/modules/userId.html) refactored to support external sub-modules |
| 2.10 | [User ID module](/dev-docs/modules/userId.html) released with support for PubCommon ID and Unified ID |
| 2.10 | A bidder which responded in time is now considered a timely bidder, even if it responded with no bids. See [PR 3696](https://github.com/prebid/Prebid.js/pull/3696) |
| 2.9 | Add 'hb_cache_host' targeting for video bids when cache is set to support upcoming video cache redirector |
| 2.9 | remove removeRequestId logic. See [PR 3698](https://github.com/prebid/Prebid.js/pull/3698)
| 2.8 | Added [s2sConfig](/dev-docs/publisher-api-reference.html#setConfig-Server-to-Server) `syncUrlModifier` option to modify userSync URLs |
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

+ [Getting Started With Prebid.js]({{site.github.url}}/overview/getting-started.html)
