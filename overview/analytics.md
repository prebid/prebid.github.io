---
layout: page_v2
title: Analytics for Prebid.js
description: Prebid.js Analytics Adapters
sidebarType: 1
---

# Prebid.js Analytics Adapters

There are many analytics adapter plugins available to track header bidding performance for your site.

## Video Overview

{% include vimeo-iframe.html id="957374949" title="957374949" %}

Further Content:

- [Transcript of this video](/overview/analytics-video.html)
- [Prebid.js Events](https://docs.prebid.org/dev-docs/publisher-api-reference/getEvents.html)
- [All videos](/overview/all-videos.html)

## How to Integrate an Analytics Adapter

Each analytics provider has specific instructions for using their system, but these are the general steps:

- Create an account with the analytics vendor and obtain the necessary IDs
- Build Prebid.js package with the vendor's analytics adapter

```javascript
gulp bundle --modules=exAnalyticsAdapter,xyzBidAdapter
```

- If required, load analytics JavaScript from vendor directly on the page
- Call the [`pbjs.enableAnalytics()` function](/dev-docs/publisher-api-reference/enableAnalytics.html)

e.g.

```javascript
pbjs.que.push(function() {
  pbjs.enableAnalytics({
    provider: 'NAME',
    options: {
    [...]
    }
  });
});
```

## Analytics Adapters

{% assign analytics_pages = site.pages | where: "layout", "analytics" %}

## Search for analytics adapters

<input type="text" id="autocomplete-filter" class="autocomplete-filter">
<script src="https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.5/awesomplete.min.js" integrity="sha512-HcBl0GSJvt4Qecm4srHapirUx0HJDi2zYXm6KUKNNUGdTIN9cBwakVZHWmRVj4MKgy1AChqhWGYcMDbRKgO0zg==" crossorigin="anonymous"></script>
<script>
var AutocompleteList = [{% for page in analytics_pages %}{ label: '{{ page.title }}', value: '{{ page.url }}' },{% endfor %}];
</script>
<script src="{{site.baseurl}}/assets/js/autocomplete.js"></script>
<div class="c-analytic-list-group" markdown="1">

## Full List

### #-A
<ul class="c-analytic-list">
{% for page in analytics_pages %}
  {% assign firstletter = page.title | slice:0 | downcase %}
  {% unless firstletter == "0" or firstletter == "1" or firstletter == "2" or firstletter == "3" or firstletter == "4" or firstletter == "5" or firstletter == "6" or firstletter == "7" or firstletter == "8" or firstletter == "9" or firstletter == "a" %}{% continue %}{% endunless %}
  <li>
  <a href="{{ page.url }}">{{ page.title }}</a>
  </li>
{% endfor %}
</ul>

### B-C

<ul class="c-analytic-list">
{% for page in analytics_pages %}
  {% assign firstletter = page.title | slice:0 | downcase %}
  {% unless firstletter == "b" or firstletter == "c" %}{% continue %}{% endunless %}
  <li>
  <a href="{{ page.url }}">{{ page.title }}</a>
  </li>
{% endfor %}
</ul>

### D-G

<ul class="c-analytic-list">
{% for page in analytics_pages %}
  {% assign firstletter = page.title | slice:0 | downcase %}
  {% unless firstletter == "d" or firstletter == "e" or firstletter == "f" or firstletter == "g" %}{% continue %}{% endunless %}
  <li>
  <a href="{{ page.url }}">{{ page.title }}</a>
  </li>
{% endfor %}
</ul>

### H-L

<ul class="c-analytic-list">
{% for page in analytics_pages %}
  {% assign firstletter = page.title | slice:0 | downcase %}
  {% unless firstletter == "h" or firstletter == "i" or firstletter == "j" or firstletter == "k" or firstletter == "l" %}{% continue %}{% endunless %}
  <li>
  <a href="{{ page.url }}">{{ page.title }}</a>
  </li>
{% endfor %}
</ul>

### M-O

<ul class="c-analytic-list">
{% for page in analytics_pages %}
  {% assign firstletter = page.title | slice:0 | downcase %}
  {% unless firstletter == "m" or firstletter == "n" or firstletter == "o" %}{% continue %}{% endunless %}
  <li>
  <a href="{{ page.url }}">{{ page.title }}</a>
  </li>
{% endfor %}
</ul>

### P-R

<ul class="c-analytic-list">
{% for page in analytics_pages %}
  {% assign firstletter = page.title | slice:0 | downcase %}
  {% unless firstletter == "p" or firstletter == "q" or firstletter == "r" %}{% continue %}{% endunless %}
  <li>
  <a href="{{ page.url }}">{{ page.title }}</a>
  </li>
{% endfor %}
</ul>

### S-T

<ul class="c-analytic-list">
{% for page in analytics_pages %}
  {% assign firstletter = page.title | slice:0 | downcase %}
  {% unless firstletter == "s" or firstletter == "t" %}{% continue %}{% endunless %}
  <li>
  <a href="{{ page.url }}">{{ page.title }}</a>
  </li>
{% endfor %}
</ul>

### U-Z

<ul class="c-analytic-list">
{% for page in analytics_pages %}
  {% assign firstletter = page.title | slice:0 | downcase %}
  {% unless firstletter == "u" or firstletter == "v" or firstletter == "w" or firstletter == "x" or firstletter == "y" or firstletter == "z" %}{% continue %}{% endunless %}
  <li>
  <a href="{{ page.url }}">{{ page.title }}</a>
  </li>
{% endfor %}
</ul>

## Related Topics

- [Integrate with the Prebid Analytics API]({{site.baseurl}}/dev-docs/integrate-with-the-prebid-analytics-api.html) (For developers)
