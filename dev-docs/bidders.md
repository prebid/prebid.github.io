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
| **"Send All Bids" Ad Server Keys**  | Used for sending all bids to the ad server, as described in [Send All Bids to the Ad Server]({{site.baseurl}}/adops/send-all-bids-adops.html) |
| **Bid Params**                      | Ad request parameters required by a given bidder, such as the tag ID, site ID, or query string parameters                                     |

You can also download the full <a href="/dev-docs/bidder-data.csv" download>CSV data file</a>.


{% assign bidder_pages = site.pages | where: "layout", "bidder" | where: "pbjs", true %}

## Bidder List

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

{: .table .table-bordered .table-striped }
| **Bidder Code** | {{ page.biddercode }} | **Prebid.org Member** | {% if page.prebid_member == true %}yes{% else %}no{% endif %} |
| **Media Types** | {% unless page.media_types contains 'no-display' %}display{% if page.media_types contains 'video' %},{% endif %}{% endunless %}{% if page.media_types contains 'video' %} video{% endif %}{% if page.media_types != "no-display, native" and page.media_types contains 'native' %}, native{% endif %}{% if page.media_types == "no-display, native" %}native{% endif %} | **GDPR TCF1 Support** | {% if page.gdpr_supported == true %}yes{% else %}no{% endif %} |
| **User IDs** | {% if page.userIds and page.userIds != '' %}{{page.userIds}}{% else %}none{% endif %} | **GDPR TCF2 Support** | {% if page.tcf2_supported == true %}yes{% else %}no{% endif %} |
| **SChain Support** | {% if page.schain_supported  == true %}yes{% else %}no{% endif %} | **COPPA Support** | {% if page.coppa_supported == true %}yes{% else %}no{% endif %} |
| **Safeframes OK** | {% if page.safeframes_ok == false %}no{% elsif page.safeframes_ok == true %}yes{% else %}check with bidder{% endif %} | **USP/CCPA Support** | {% if page.usp_supported == true %}yes{% else %}no{% endif %} |
| **Supports Deals** | {% if page.bidder_supports_deals == false %}no{% elsif page.bidder_supports_deals == true %}yes{% else %}check with bidder{% endif %} | **Prebid.js Adapter** | yes |
| **IAB GVL ID** | {% if page.gvl_id %}{{page.gvl_id}}{% else %}check with bidder{% endif %} | **Prebid Server Adapter** | {% if page.pbs == true %}yes{% else %}no{% endif %} |
| **Floors Module Support** | {% if page.getFloor  == true %}yes{% else %}no{% endif %} |

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
