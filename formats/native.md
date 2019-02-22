---
layout: page_v2
title: Prebid Native
description: Prebid Native
sidebarType: 6
---

# Prebid Native Ads
{:.no_toc}

Native ads are supported by Prebid.js for mobile web. Prebid Server support is coming soon.

## Prebid.js

### Adops

- [Setting up Prebid Native in DFP](/adops/setting-up-prebid-native-in-dfp.html)

### Developers

- [Setting up Prebid Native](/dev-docs/show-native-ads.html)

### Prebid.js bid adapters that support the Native format

<div id="dynamicTable"></div>

<script type="text/javascript">
var dynamicTableContents=[];

{% assign numNative = 0 %}
{% assign nativeBidders = "" %}
{% assign bidder_pages = site.pages | where: "layout", "bidder" %}
{% for page in bidder_pages %}
{% if page.media_types contains 'native' %}
   dynamicTableContents[{{numNative}}]={};
   dynamicTableContents[{{numNative}}].href="/dev-docs/bidders.html#{{page.biddercode}}";
   dynamicTableContents[{{numNative}}].text="{{page.title}}";
   {% assign numNative = numNative | plus: 1 %}
{% endif %}
{% endfor %}
</script>
<script src="/assets/js/dynamicTable.js" type="text/javascript" data-div="dynamicTable" data-array="dynamicTableContents"></script>
