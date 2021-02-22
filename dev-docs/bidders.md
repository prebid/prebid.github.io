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

### Search a bidder

<input type="text" id="bidder-filter" class="bidder-filter">
<script src="https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.5/awesomplete.min.js" integrity="sha512-HcBl0GSJvt4Qecm4srHapirUx0HJDi2zYXm6KUKNNUGdTIN9cBwakVZHWmRVj4MKgy1AChqhWGYcMDbRKgO0zg==" crossorigin="anonymous"></script>
<script>
var BidderList = [{% for page in bidder_pages %}{ label: '{{ page.title }}', value: '/dev-docs/bidders/{{ page.biddercode }}' },{% endfor %}];
</script>
<script src="{{site.baseurl}}/assets/js/autocomplete.js"></script>
<div class="c-bidder-list-group" markdown="1">

### Full List

{% assign a_bidder_pages = bidder_pages | where: "list_group", "0a" %}
#### #-A
<ul class="c-bidder-list">
{% for page in a_bidder_pages %}
<li>
<a href="bidders/{{ page.biddercode }}">{{ page.title }}</a>
</li>
{% endfor %}
</ul>

{% assign bc_bidder_pages = bidder_pages | where: "list_group", "bc" %}
#### B-C
<ul class="c-bidder-list">
{% for page in bc_bidder_pages %}
<li>
<a href="bidders/{{ page.biddercode }}">{{ page.title }}</a>
</li>
{% endfor %}
</ul>

{% assign dg_bidder_pages = bidder_pages | where: "list_group", "dg" %}
#### D-G
<ul class="c-bidder-list">
{% for page in dg_bidder_pages %}
<li>
<a href="bidders/{{ page.biddercode }}">{{ page.title }}</a>
</li>
{% endfor %}
</ul>

{% assign hl_bidder_pages = bidder_pages | where: "list_group", "hl" %}
#### H-L
<ul class="c-bidder-list">
{% for page in hl_bidder_pages %}
<li>
<a href="bidders/{{ page.biddercode }}">{{ page.title }}</a>
</li>
{% endfor %}
</ul>

{% assign mo_bidder_pages = bidder_pages | where: "list_group", "mo" %}
#### M-O
<ul class="c-bidder-list">
{% for page in mo_bidder_pages %}
<li>
<a href="bidders/{{ page.biddercode }}">{{ page.title }}</a>
</li>
{% endfor %}
</ul>

{% assign pr_bidder_pages = bidder_pages | where: "list_group", "pr" %}
#### P-R
<ul class="c-bidder-list">
{% for page in pr_bidder_pages %}
<li>
<a href="bidders/{{ page.biddercode }}">{{ page.title }}</a>
</li>
{% endfor %}
</ul>

{% assign st_bidder_pages = bidder_pages | where: "list_group", "st" %}
#### S-T
<ul class="c-bidder-list">
{% for page in st_bidder_pages %}
<li>
<a href="bidders/{{ page.biddercode }}">{{ page.title }}</a>
</li>
{% endfor %}
</ul>

{% assign uz_bidder_pages = bidder_pages | where: "list_group", "uz" %}
#### U-Z
<ul class="c-bidder-list">
{% for page in uz_bidder_pages %}
<li>
<a href="bidders/{{ page.biddercode }}">{{ page.title }}</a>
</li>
{% endfor %}
</ul>
</div>
