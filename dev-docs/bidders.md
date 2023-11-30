---
layout: page_v2
title: Prebid.js Bidder Params
description: Documentation on bidders' params
sidebarType: 1
---

# Prebid.js Bidder Params

This page contains documentation on the specific parameters required by each supported bidder.
These docs only apply to Prebid.js bidders. For Prebid Server, AMP, or Prebid Mobile, see the
[Prebid Server Bidders](/dev-docs/pbs-bidders.html) page.

For each bidder listed below, you'll find the following information:

{: .table .table-bordered .table-striped }
| **Features**                     | A table of features supported by the adapter.  |
| **"Send All Bids" Ad Server Keys**  | Used for sending all bids to the ad server, as described in [Send All Bids vs Send Top Price]({{site.baseurl}}/adops/send-all-vs-top-price.html) |
| **Bid Params**                      | Ad request parameters required by a given bidder, such as the tag ID, site ID, or query string parameters                                     |

You can also download the full <a href="/dev-docs/bidder-data.csv" download>CSV data file</a>.

{% assign bidder_pages = site.pages | where: "layout", "bidder" | where: "pbjs", true | sort_natural: "title" %}

{: .alert.alert-warning :}
Publishers are advised to check with legal counsel before doing business with any particular bidder.

## Search a bidder

TODO. Show all bidders along with a search box
