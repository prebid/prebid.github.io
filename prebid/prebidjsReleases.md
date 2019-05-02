---

layout: page_v2
title: Prebid.js Release History
description: Noteworthy updates in Prebid.js
sidebarType: 1
---

## Prebid.js Releases

Not every Prebid.js release contains noteworthy core features, and
the [GitHub releases page](https://github.com/prebid/Prebid.js/releases) can be hard to search for when a given change or bugfix was made.

The table below is a summary of feature changes and important bug fixes in core Prebid.js.

{: .table .table-bordered .table-striped }
| Release | Feature |
| --- | --- |
| 2.10 | [User ID module](/dev-docs/modules/userId.html) |
| 2.10 | A bidder which responded in time is now considered a timely bidder, even if it responded with no bids. See [PR 3696](https://github.com/prebid/Prebid.js/pull/3696) |
| 2.9 | Add 'hb_cache_host' targeting for video bids when cache is set to support upcoming video cache redirector |
| 2.9 | remove removeRequestId logic. See [PR 3698](https://github.com/prebid/Prebid.js/pull/3698)
| 2.8 | Added [s2sConfig](/dev-docs/publisher-api-reference.html#setConfig-Server-to-Server) `syncUrlModifier` option to modify userSync URLs |
| 2.8 | Add hb_uuid and hb_cache_id back to dfp module after having been removed in 2.7 |
| 2.6 | Update auction algorithm logic for long-form. See [PR 3625](https://github.com/prebid/Prebid.js/pull/3625) |
| 2.6 | In case Prebid.js is called from within an iFrame, matchMedia is applied to window.top, not the containing iFrame. |
| 2.5 | Fix event firing on native click. See [PR 3589](https://github.com/prebid/Prebid.js/pull/3589) |
| 2.4 | [Long Form video](http://prebid.org/prebid-video/video-long-form.html) |
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
