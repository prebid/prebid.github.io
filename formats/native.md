---

layout: page_v2
title: Prebid Native
description: Prebid Native
pid: 1
sidebarType: 7

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

{% assign numNative = 0 %}
{% assign nativeBidders = "" %}
{% assign bidder_pages = site.pages | where: "layout", "bidder" %}
{% for page in bidder_pages %}
{% if page.media_types contains 'native' and page.prebid_1_0_supported %}
   {% if numNative == 0 %}
        {% assign nativeBidders = page.biddercode %}
   {% else %}
        {% assign nativeBidders = nativeBidders | append: "," | append: page.biddercode %}
   {% endif %}
   {% assign numNative = numNative | plus: 1 %}
{% endif %}
{% endfor %}
{% assign nativeBidderArray = nativeBidders | split: "," %}

<table class="table table-bordered table-striped">
<tbody>
{% assign idx = 0 %}
{% assign numRows = numNative | divided_by: 4.0 | round %}
{% for row in (1..numRows) %}
<tr>
{% for col in (1..4) %}
{% assign colMod = col | minus: 1 | times: numRows %}
{% assign idx = row | minus: 1 | plus: colMod %}
{% if idx < numNative %}
<td> <a href="/dev-docs/bidders.html#{{nativeBidderArray[idx]}}">{{nativeBidderArray[idx]}}</a> </td>
{% assign idx = idx | plus: 1 %}
{% else %}
<td>&nbsp;</td>
{% endif %}
{% endfor %}
</tr>
{% endfor %}
</tbody>
</table>
