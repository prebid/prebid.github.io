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

### Search a bidder

<input type="text" id="autocomplete-filter" class="autocomplete-filter">
<script src="https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.5/awesomplete.min.js" integrity="sha512-HcBl0GSJvt4Qecm4srHapirUx0HJDi2zYXm6KUKNNUGdTIN9cBwakVZHWmRVj4MKgy1AChqhWGYcMDbRKgO0zg==" crossorigin="anonymous"></script>
<script>
var AutocompleteList = [{% for page in bidder_pages %}{ label: '{{ page.title }}', value: '{{ page.url }}' },{% endfor %}];
</script>
<script src="{{site.baseurl}}/assets/js/autocomplete.js"></script>
<div class="c-bidder-list-group" markdown="1">

### Full List

#### #-A
<ul class="c-bidder-list">
{% for page in bidder_pages %}
  {% assign firstletter = page.title | slice:0 | downcase %}
  {% unless firstletter == "0" or firstletter == "1" or firstletter == "2" or firstletter == "3" or firstletter == "4" or firstletter == "5" or firstletter == "6" or firstletter == "7" or firstletter == "8" or firstletter == "9" or firstletter == "a" %}{% continue %}{% endunless %}
  <li>
  <a href="{{ page.url }}">{{ page.title }}</a>
  </li>
{% endfor %}
</ul>

#### B-C
<ul class="c-bidder-list">
{% for page in bidder_pages %}
  {% assign firstletter = page.title | slice:0 | downcase %}
  {% unless firstletter == "b" or firstletter == "c" %}{% continue %}{% endunless %}
  <li>
  <a href="{{ page.url }}">{{ page.title }}</a>
  </li>
{% endfor %}
</ul>

#### D-G
<ul class="c-bidder-list">
{% for page in bidder_pages %}
  {% assign firstletter = page.title | slice:0 | downcase %}
  {% unless firstletter == "d" or firstletter == "e" or firstletter == "f" or firstletter == "g" %}{% continue %}{% endunless %}
  <li>
  <a href="{{ page.url }}">{{ page.title }}</a>
  </li>
{% endfor %}
</ul>

#### H-L
<ul class="c-bidder-list">
{% for page in bidder_pages %}
  {% assign firstletter = page.title | slice:0 | downcase %}
  {% unless firstletter == "h" or firstletter == "i" or firstletter == "j" or firstletter == "k" or firstletter == "l" %}{% continue %}{% endunless %}
  <li>
  <a href="{{ page.url }}">{{ page.title }}</a>
  </li>
{% endfor %}
</ul>

#### M-O
<ul class="c-bidder-list">
{% for page in bidder_pages %}
  {% assign firstletter = page.title | slice:0 | downcase %}
  {% unless firstletter == "m" or firstletter == "n" or firstletter == "o" %}{% continue %}{% endunless %}
  <li>
  <a href="{{ page.url }}">{{ page.title }}</a>
  </li>
{% endfor %}
</ul>

#### P-R
<ul class="c-bidder-list">
{% for page in bidder_pages %}
  {% assign firstletter = page.title | slice:0 | downcase %}
  {% unless firstletter == "p" or firstletter == "q" or firstletter == "r" %}{% continue %}{% endunless %}
  <li>
  <a href="{{ page.url }}">{{ page.title }}</a>
  </li>
{% endfor %}
</ul>

#### S-T
<ul class="c-bidder-list">
{% for page in bidder_pages %}
  {% assign firstletter = page.title | slice:0 | downcase %}
  {% unless firstletter == "s" or firstletter == "t" %}{% continue %}{% endunless %}
  <li>
  <a href="{{ page.url }}">{{ page.title }}</a>
  </li>
{% endfor %}
</ul>

#### U-Z
<ul class="c-bidder-list">
{% for page in bidder_pages %}
  {% assign firstletter = page.title | slice:0 | downcase %}
  {% unless firstletter == "u" or firstletter == "v" or firstletter == "w" or firstletter == "x" or firstletter == "y" or firstletter == "z" %}{% continue %}{% endunless %}
  <li>
  <a href="{{ page.url }}">{{ page.title }}</a>
  </li>
{% endfor %}
</ul>
</div>
