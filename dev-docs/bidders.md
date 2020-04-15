---
layout: page_v2
title: Bidder Params
description: Documentation on bidders' params
sidebarType: 1
---

# Bidder Params

This page contains documentation on the specific parameters required by each supported bidder.
These docs only apply to Prebid.js bidders. For Prebid Server, AMP, or Prebid Mobile, see the
[Prebid Server Bidders]({{site.baseurl}}/dev-docs/prebid-server-bidders.html) page.

For each bidder listed below, you'll find the following information:

{: .table .table-bordered .table-striped }
| **Bidder Code**                     | The unique code Prebid.js uses to identify the bidder                                                                                         |
| **"Send All Bids" Ad Server Keys**  | Used for sending all bids to the ad server, as described in [Send All Bids to the Ad Server]({{site.baseurl}}/adops/send-all-bids-adops.html) |
| **"Default Deal ID" Ad Server Key** | Used for enabling deals using Prebid.js, as described in [Enable Deals in Prebid]({{site.baseurl}}/adops/deals.html)                          |
| **Bid Params**                      | Ad request parameters required by a given bidder, such as the tag ID, site ID, or query string parameters                                     |

In addition to the bidder-specific parameters, there are <a href="#common-bidresponse">common parameters</a> that appear in all bid responses.

For information about which bidders support video and native demand, see <a href="#bidder-video-native">this list of bidders with video and native demand</a>.

{% assign bidder_pages = site.pages | where: "layout", "bidder" %}

- [Bidders](#bidders)
- [Common Bid Response Parameters](#common-bid-response-parameters)
- [Bidders with Video and Native Demand](#bidders-with-video-and-native-demand)

## Bidders

<ul>
{% for page in bidder_pages %}
<li>
<a href="#{{ page.biddercode }}">{{ page.title }}</a>
</li>
{% endfor %}
</ul>



<div class="bs-docs-section" markdown="1">

<a name="common-bidresponse"></a>

## Common Bid Response Parameters
{: .no_toc }

The following parameters in the `bidResponse` object are common across all bidders.

{: .table .table-bordered .table-striped }
| Name     | Type    | Description                                                                                                                                                       | Example                                                                 |
|----------+---------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------+-------------------------------------------------------------------------|
| `bidder` | String  | Unique bidder code used by ad server's line items to identify the bidder                                                                                          | `"appnexus"`                                                            |
| `adId`   | String  | Unique identifier of a bid creative. Used by the line item's creative as in [this example]({{site.baseurl}}/adops/send-all-bids-adops.html#step-3-add-a-creative) | `"123"`                                                                 |
| `pbLg`   | String  | Low granularity price bucket: $0.50 increment, capped at $5, floored to 2 decimal places (0.50, 1.00, 1.50, ..., 5.00)                                            | `"1.50"`                                                                |
| `pbMg`   | String  | Medium granularity price bucket: 0.10 increment, capped at $20, floored to 2 decimal places (0.10, 0.20, ..., 19.90, 20.00)                                       | `"1.60"`                                                                |
| `pbHg`   | String  | High granularity price bucket: 0.01 increment, capped at $20, floored to 2 decimal places (0.01, 0.02, ..., 19.99, 20.00)                                         | `"1.61"`                                                                |
| `size`   | String  | Size of the bid creative; concatenation of width and height by 'x'                                                                                                | `"300x250"`                                                             |
| `width`  | Integer | Width of the bid creative in pixels                                                                                                                               | `300`                                                                   |
| `height` | Integer | Height of the bid creative in pixels                                                                                                                              | `250`                                                                   |
| `adTag`  | String  | Creative's payload in HTML                                                                                                                                        | `"<html><body><img src=\"https://cdn.com/creative.png\"></body></html>"` |

<a name="bidders-with-video-and-native-demand"></a>
<a name="bidder-video-native"></a>

## Bidders with Video and Native Demand
{: .no_toc }

{% assign bidder_pages = site.pages | where: "layout", "bidder" %}
<table class="table table-bordered table-striped">
<thead><tr>
<th>Bidder</th>
<th>Supported Media Types</th>
</tr></thead>
<tbody>
{% for page in bidder_pages %}
{% if page.media_types and page.media_types contains "video" or page.media_types contains "native" %}
<tr><td> {{page.biddercode}} </td><td> {% if page.media_types contains 'video' and page.media_types contains 'native' %} video, native {% elsif page.media_types contains 'native' %} native {% elsif page.media_types contains 'video' %} video {% endif %} </td></tr>
{% endif %}
{% endfor %}
</tbody>
</table>
</div>

{% for page in bidder_pages %}

<div class="bs-docs-section" markdown="1">
<h2><a name="{{ page.biddercode }}" >{{ page.title }}</a></h2>

{% if page.s2s_only == true %}
<h3>Note:</h3> This is a S2S adapter only.
{% endif %}

<h3>Features</h3>

{: .table .table-bordered .table-striped }
| **Bidder Code** | {{ page.biddercode }} | **Prebid.org Member** | {% if page.prebid_member == true %}yes{% else %}no{% endif %} |
| **Media Types** | display{% if page.media_types contains 'video' %}, video{% endif %}{% if page.media_types contains 'native' %}, native{% endif %} | **GDPR Support** | {% if page.gdpr_supported == true %}yes{% else %}no{% endif %} |
| **User IDs** | {% if page.userIds and page.userIds != '' %}{{page.userIds}}{% else %}none{% endif %} | **COPPA Support** | {% if page.coppa_supported == true %}yes{% else %}no{% endif %} |
| **SChain Support** | {% if page.schain_supported  == true %}yes{% else %}no{% endif %} | **USP/CCPA Support** | {% if page.usp_supported == true %}yes{% else %}no{% endif %} |


<h3>"Send All Bids" Ad Server Keys</h3>

<font size="-1">These are the bidder-specific keys that would be targeted within GAM in a Send-All-Bids scenario. GAM truncates keys to 20 characters.</font>

{: .table .table-bordered .table-striped }
| <code>{{ "hb_pb_" | append: page.biddercode | slice: 0,20 }}</code> | <code>{{ "hb_bidder_" | append: page.biddercode | slice: 0,20 }}</code> | <code>{{ "hb_adid_" | append: page.biddercode | slice: 0,20 }}</code> |
| <code>{{ "hb_size_" | append: page.biddercode | slice: 0,20 }}</code> | <code>{{ "hb_source_" | append: page.biddercode | slice: 0,20 }}</code> | <code>{{ "hb_format_" | append: page.biddercode | slice: 0,20 }}</code> |
| <code>{{ "hb_cache_host_" | append: page.biddercode | slice: 0,20 }}</code> | <code>{{ "hb_cache_id_" | append: page.biddercode | slice: 0,20 }}</code> | <code>{{ "hb_uuid_" | append: page.biddercode | slice: 0,20 }}</code> |

{% if page.prevBiddercode %}

This bidder previously had a bidder code of `{{ page.prevBiddercode }}`, but prefers new configurations to use `{{ page.biddercode }}`.

{% endif %}

{% if page.bidder_supports_deals != false %}

<h3>"Deal ID" Ad Server Key</h3>

<code>{{ "hb_deal_" | append: page.biddercode | slice: 0,20 }}</code>

{% endif %}

{{ page.content }}

</div>

{% endfor %}
