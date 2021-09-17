---
layout: page_v2
title: Setup Line Items for MoPub
description: Setup line items for MoPub
pid: 1
top_nav_section: prebid-mobile
nav_section: prebid-mobile-adops
sidebarType: 3
---




# Step-by-Step Line Item Setup for MoPub

* TOC
{:toc }

This page provides step-by-step instructions to set up Prebid Mobile line items for MoPub to serve ads on app with the Prebid SDK. It is using the Universal Prebid Creative.

## Step 1. Add a line item

- Set the **Type & Priority** to **Non-guaranteed** and **12**, respectively, so the line item will compete with all other demand
- Set the **Rate** to the price you want to target, for example $0.50, in the screenshot below

![MoPub Line Item Setup]({{site.github.url}}/assets/images/prebid-mobile/adops-line-item-setup-mopub/mopub1.png "Example MoPub Line Item"){: .pb-md-img :}

- In the **Advanced Targeting** section, in **Keywords** target **hb_pb:0.50**

![MoPub Advanced Targeting Setup]({{site.github.url}}/assets/images/prebid-mobile/adops-line-item-setup-mopub/mopub2.png "Example MoPub Advanced Targeting"){: .pb-md-img :}

For each level of pricing granularity you need, you will have to set up one line item/creative pair.

Line items must be set up to target custom keywords that include bid price information. The bid price keywords tell you how much the buyer bid on the impression.

By default, `Prebid Mobile` will send the highest bid price to Google Ad Manager using the keyword `hb_pb` but will also pass the keys `hb_pb_BIDDERCODE`. You can decide to create one set of line items for all bidders or one set of line items for each bidder.

## Step 2. Add creatives to your line item

Banner creatives must be HTML banners with the **Format** set to **Banner** that include the code shown below.

![MoPub Creative Setup]({{site.github.url}}/assets/images/prebid-mobile/adops-line-item-setup-mopub/mopub3.png "Example MoPub Creative"){: .pb-md-img :}

The **hb_cache_id** variable stands for the cache id that will load the ad markup from the bid from Prebid Cache. Within each line item, for each ad unit size there should be one creative with this content.


{: .alert.alert-success :}
You can always get the latest version of the creative code below from [the Mobile example creative file in our GitHub repo](https://github.com/prebid/prebid-universal-creative/blob/master/template/amp/dfp-creative.html).

{% highlight javascript %}

<script src = "https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/creative.js"></script>
<script>
  var ucTagData = {};
  ucTagData.adServerDomain = "";
  ucTagData.pubUrl = "%%KEYWORD:url%%";
  ucTagData.targetingKeywords = "%%KEYWORDS%%";
  ucTagData.hbPb = "%%KEYWORD:hb_pb%%";
   try {
    ucTag.renderAd(document, ucTagData);
  } catch (e) {
    console.log(e);
  }
</script>

{% endhighlight %}

## Step 3. Duplicate line items

Duplicate your line items according to your [price granularity]({{site.github.url}}/prebid-mobile/adops-price-granularity.html) setting.
