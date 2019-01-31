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
| 2.0 | The "[limited bid caching](/dev-docs/faq.html#does-prebidjs-cache-bids)" feature turned off by default. |
| 1.39 | {::nomarkdown}<ul><li>The <a href="/dev-docs/faq.html#does-prebidjs-cache-bids">limited bid caching</a> feature can be optionally turned off.</li><li>Bug fix in the <a href="/dev-docs/modules/currency.html"</a>currency module</a> introduced with 1.37: calling for the currency conversion file even when defaultRates are specified.</li>{:/} |
| 1.37 | The default location of the [currency](/dev-docs/modules/currency.html) conversion file changed. |
| 1.36 | New NO_BID event makes a "no bids" response available to analytics adapters. |
| 1.34 | User-sync iframes are now inserted at the bottom of the head element, rather than at the top. |
| 1.30 | Bugfix to Auction Init events. The `timestamp` had been removed in 1.28 and caused issues in some Analytics Adapters. |
| 1.27 | Render outstream safeframe with prebid universal creative. |

## Further Reading

+ [Getting Started With Prebid.js]({{site.github.url}}/overview/getting-started.html)
