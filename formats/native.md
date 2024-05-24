---
layout: page_v2
title: Prebid Native
description: Prebid Native
sidebarType: 6
---

<script src="/assets/js/dynamicTable.js" type="text/javascript"></script>

# Prebid Native Ads

{:.no_toc}

## Prebid Server

At a high level, Prebid Server just passes native parameters through to
bid adapters. See [Prebid Server Native](/prebid-server/features/pbs-native.html) for more information.

## Prebid SDK

See the separate pages for

- [iOS](/prebid-mobile/pbm-api/ios/pbm-nativeadunit-ios.html)
- [Android](/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html#native-api)

## Prebid.js

Native ads are supported by Prebid.js for mobile web.

### Adops

- [Setting up Prebid Native in Google Ad Manager](/adops/gam-native.html)

### Developers

- [Prebid Native Implementation](/prebid/native-implementation.html)

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
<script>
  writeDynamicTable({div:"dynamicTable", data:"dynamicTableContents"});
</script>
