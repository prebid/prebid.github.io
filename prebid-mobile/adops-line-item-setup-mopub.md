---
layout: page
title: Setup Line Items for MoPub
description: Setup line items for MoPub
pid: 1
top_nav_section: prebid-mobile
nav_section: prebid-mobile-adops
---


<div class="bs-docs-section" markdown="1">

# Step by Step Line Item Setup for MoPub

* TOC
{:toc }

This page describes step by step how to set up Prebid Mobile line items for MoPub to serve ads on app with the Prebid SDK. It is using the Universal Prebid Creative.

## Step 1. Add a line item

- Set the **Type & Priority** to **Non-guaranteed** and **12**, respectively, so the line item will compete with all other demand
- Set the **Rate** to the price you want to target, for example $0.50, in the screenshot below

{: .pb-med-img :}
  ![MoPub Line Item Setup]({{site.github.url}}/assets/images/prebid-mobile/adops-line-item-setup-mopub/mopub1.png "Example MoPub Line Item")

- In the **Advanced Targeting** section, in **Keywords** target **hb_pb:0.50**

{: .pb-med-img :}
  ![MoPub Advanced Targeting Setup]({{site.github.url}}/assets/images/prebid-mobile/adops-line-item-setup-mopub/mopub2.png "Example MoPub Advanced Targeting")

For each level of pricing granularity you need, you will have to set up one line item/creative pair.

Line items must be set up to target custom keywords that include bid price information. The bid price keywords tell you how much the buyer bid on the impression.

By default, `Prebid Mobile` will send the highest bid price to DFP using the keyword `hb_pb` but will also pass the keys `hb_pb_BIDDERCODE`. You can decide to create one set of line items for all bidders or one set of line items for each bidder.

## Step 2. Add creatives to your line item

Banner creatives must be HTML banners with the **Format** set to **Banner** that include the code shown below.

{: .pb-med-img :}
  ![MoPub Creative Setup]({{site.github.url}}/assets/images/prebid-mobile/adops-line-item-setup-mopub/mopub3.png "Example MoPub Creative")

The **hb_cache_id** variable stands for the cache id that will load the ad markup from the bid from Prebid Cache. Within each line item, for each ad unit size there should be one creative with this content. 


{: .alert.alert-success :}
You can always get the latest version of the creative code below from [the Mobile example creative file in our GitHub repo](https://github.com/prebid/prebid-universal-creative/blob/master/template/amp/dfp-creative.html).

{% include dev-docs/amp-creative.md %}

## Step 3. Duplicate line items

Duplicate your line items according to your [price granularity]({{site.github.url}}/prebid-mobile/adops-price-granularity.html) setting. 

</div>
