---
layout: page_v2
title: Prebid Server Bidder Params
description: Documentation on bidders' params
sidebarType: 5
---

# Prebid Server Bidder Params

This page contains documentation on the specific parameters required by each supported bidder.
These docs only apply to Prebid Server bidders. For Prebid.js bidders see the
[Prebid.js Bidders](/dev-docs/bidders.html) page.

For each bidder listed below, you'll find the following information:

{: .table .table-bordered .table-striped }
| **Features**                     | A table of features supported by the adapter.  |
| **"Send All Bids" Ad Server Keys**  | Used for sending all bids to the ad server, as described in [Send All Bids vs Send Top Price](/adops/send-all-vs-top-price.html) |
| **Bid Params**                      | Ad request parameters required by a given bidder, such as the tag ID, site ID, or query string parameters                                     |

You can also download the full <a href="/dev-docs/bidder-data.csv" download>CSV data file</a>.

{% assign bidder_pages = site.pages | where: "layout", "bidder" | where: "pbs", true %}

{: .alert.alert-warning :}
Publishers are advised to check with legal counsel before doing business with any particular bidder.

## Prebid Server Bidder List

<ul>
{% for page in bidder_pages %}
<li>
<a href="#{{ page.biddercode }}">{{ page.title }}</a>
</li>
{% endfor %}
</ul>

## Bidder Documentation

{% for page in bidder_pages %}

<div class="bs-docs-section" markdown="1">
<a name="{{ page.biddercode }}" ></a>
<h2>{{ page.title }}</h2>

<h4>Features</h4>

{% include dev-docs/bidder-meta-data.html page=page %}

<h3>"Send All Bids" Ad Server Keys</h3>

<font size="-1">These are the bidder-specific keys that would be targeted within GAM in a Send-All-Bids scenario. GAM truncates keys to 20 characters.</font>

{: .table .table-bordered .table-striped }
| <code>{{ "hb_pb_" | append: page.biddercode | slice: 0,20 }}</code> | <code>{{ "hb_bidder_" | append: page.biddercode | slice: 0,20 }}</code> | <code>{{ "hb_adid_" | append: page.biddercode | slice: 0,20 }}</code> |
| <code>{{ "hb_size_" | append: page.biddercode | slice: 0,20 }}</code> | <code>{{ "hb_source_" | append: page.biddercode | slice: 0,20 }}</code> | <code>{{ "hb_format_" | append: page.biddercode | slice: 0,20 }}</code> |
| <code>{{ "hb_cache_host_" | append: page.biddercode | slice: 0,20 }}</code> | <code>{{ "hb_cache_id_" | append: page.biddercode | slice: 0,20 }}</code> | <code>{{ "hb_uuid_" | append: page.biddercode | slice: 0,20 }}</code> |
| <code>{{ "hb_cache_path_" | append: page.biddercode | slice: 0,20 }}</code> | <code>{{ "hb_deal_" | append: page.biddercode | slice: 0,20 }}</code> | |

{% if page.prevBiddercode %}

This bidder previously had a bidder code of `{{ page.prevBiddercode }}`, but prefers new configurations to use `{{ page.biddercode }}`.

{% endif %}

{{ page.content }}

</div>

{% endfor %}
