---

layout: page_v2
title: Prebid Video
description: Prebid Video
pid: 1
sidebarType: 7

---

# Prebid Video Ads
{:.no_toc}

Video ads are supported by Prebid.js. Prebid Server support is coming soon.

## Prebid.js

### Adops

- [Prebid.js video overview](/prebid-video/video-overview.html)
- [Show video ads in DFP](/dev-docs/show-video-with-a-dfp-video-tag.html)

### Developers

- [Getting started with video](/prebid-video/video-getting-started.html)
- [Outstream video ads](/dev-docs/show-outstream-video-ads.html)

### Prebid.js bid adapters that support video ads

{% assign numVideo = 0 %}
{% assign videoBidders = "" %}
{% assign bidder_pages = site.pages | where: "layout", "bidder" %}
{% for page in bidder_pages %}
{% if page.media_types contains 'video' and page.prebid_1_0_supported %}
   {% if numVideo == 0 %}
        {% assign videoBidders = page.biddercode %}
   {% else %}
        {% assign videoBidders = videoBidders | append: "," | append: page.biddercode %}
   {% endif %}
   {% assign numVideo = numVideo | plus: 1 %}
{% endif %}
{% endfor %}
{% assign videoBidderArray = videoBidders | split: "," %}

<table class="table table-bordered table-striped">
<tbody>
{% assign idx = 0 %}
{% assign numRows = numVideo | divided_by: 4.0 | round %}
{% for row in (1..numRows) %}
<tr>
{% for col in (1..4) %}
{% assign colMod = col | minus: 1 | times: numRows %}
{% assign idx = row | minus: 1 | plus: colMod %}
{% if idx < numVideo %}
<td> <a href="/dev-docs/bidders.html#{{videoBidderArray[idx]}}">{{videoBidderArray[idx]}}</a> </td>
{% assign idx = idx | plus: 1 %}
{% else %}
<td>&nbsp;</td>
{% endif %}
{% endfor %}
</tr>
{% endfor %}
</tbody>
</table>
