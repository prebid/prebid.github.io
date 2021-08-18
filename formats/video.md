---
layout: page_v2
title: Prebid Video
description: Prebid Video
sidebarType: 6
---

<script src="/assets/js/dynamicTable.js" type="text/javascript"></script>

# Prebid Video Ads
{:.no_toc}

Video ads are supported by both Prebid.js and Prebid Server.

## Prebid.js

### Adops

- [Prebid.js video overview](/prebid-video/video-overview.html)
- [Show video ads in Google Ad Manager](/dev-docs/show-video-with-a-dfp-video-tag.html)

### Developers

- [Getting started with video](/prebid-video/video-getting-started.html)
- [Outstream video ads](/dev-docs/show-outstream-video-ads.html)
- [Prebid Server video ads](/prebid-server/use-cases/pbs-pbjs.html)
- [Prebid Server Long Form Video](/prebid-server/use-cases/pbs-lfv.html)

### Prebid.js bid adapters that support instream and outstream video ads

<div id="dynamicTable"></div>

<script type="text/javascript">
var dynamicTableContents=[];

{% assign numVideo = 0 %}
{% assign bidder_pages = site.pages | where: "layout", "bidder" %}
{% for page in bidder_pages %}
{% if page.media_types contains 'video' %}
   dynamicTableContents[{{numVideo}}]={};
   dynamicTableContents[{{numVideo}}].href="/dev-docs/bidders.html#{{page.biddercode}}";
   dynamicTableContents[{{numVideo}}].text="{{page.title}}";
   {% assign numVideo = numVideo | plus: 1 %}
{% endif %}
{% endfor %}
</script>
<script>
  writeDynamicTable({div: "dynamicTable", data:"dynamicTableContents"});
</script>


### Prebid.js bid adapters that support only outstream video ads

<div id="dynamicTable-outstream"></div>
<script type="text/javascript">
var outstreamTableContents=[];

{% assign numOutstream = 0 %}
{% assign bidder_pages = site.pages | where: "layout", "bidder" %}
{% for page in bidder_pages %}
{% if page.media_types contains 'outstream' %}
   outstreamTableContents[{{numOutstream}}]={};
   outstreamTableContents[{{numOutstream}}].href="/dev-docs/bidders.html#{{page.biddercode}}";
   outstreamTableContents[{{numOutstream}}].text="{{page.title}}";
   {% assign numOutstream = numOutstream | plus: 1 %}
{% endif %}
{% endfor %}
</script>
<script>
  writeDynamicTable({div: "dynamicTable-outstream", data:"outstreamTableContents"});
</script>
