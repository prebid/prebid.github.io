---
layout: page_v2
title: Setting up Prebid Multi-Format in Google Ad Manager
head_title: Setting up Prebid Multi-Format in Google Ad Manager
description: Setting up Prebid Multi-Format in Google Ad Manager
pid: 3

top_nav_section: adops
nav_section: tutorials
sidebarType: 3
---



# Setting up Prebid Multi-Format in Google Ad Manager
{: .no_toc}

This page shows how to set up your ad server so that you can serve multi-format ads.

Multi-Format ads allow you to declare multiple media types on a single ad unit.  For example, you can set up one ad on the page that could show a banner, native, or outstream video ad, depending on which had the highest bid.

{: .alert.alert-info :}
For instructions on how to set up multi-format ads from the engineering side, see [Show Multi-Format Ads with Prebid.js]({{site.baseurl}}/dev-docs/show-multi-format-ads.html).

* TOC
{: toc }

{: .alert.alert-info :}
Manually configuring GAM for Prebid can be a fair amount of work.
Consider using our official command line tool, [Prebid Line Item Manager](/tools/line-item-manager.html), to create the setup. Using this tool may save you time and help you avoid mistakes.

## Step 1. Add an Ad Unit

In Google Ad Manager, [create an ad unit](https://support.google.com/admanager/answer/177203).

Decide what combination of formats will be permitted on the ad unit.  This will determine what sizes you allow to serve.  The ad unit's sizes must be configured properly to support the combination of formats that will be permitted.

If your ad unit will support native ads, you may want to create a custom **Prebid Native Format** and at least one **Prebid Native Style**.  Examples of each are given in [Setting up Prebid Native in Google Ad Manager][nativeAdSetup].

## Step 2. Add an Order

In Google Ad Manager, create a new order.  This order will be associated with the multiple line items needed to run multi-format auctions.

## Step 3. Add Line Items and Creatives for each Media Type

Multi-format ad units which support native require at least two distinct sets of line items and creatives:

+ One for [banners and/or outstream video][bannerAdSetup].  Banners and outstream videos will serve into a Google Ad Manager banner creative.

+ One for [native][nativeAdSetup].  Native ads will serve into a native creative with native format and styles.

### Banner/Outstream

Follow the instructions for creating line items and creatives in [Send all bids to the ad server][bannerAdSetup], with the following changes:

+ Add key-value targeting for **'hb_format' is ('banner' OR 'video')**
    + This will ensure that the appropriate ad server line item is activated for banner / outstream bids
    + For bidder-specific line items, specify `hb_format_{BIDDER_CODE}`, e.g., `hb_format_appnexus`

    ![Set hb_format to 'banner,video']({{site.baseurl}}/assets/images/ad-ops/multi-format/hb_format_video_banner.png)

+ Make sure that you're targeting the right sizes for both banner ads and any outstream ads you want to serve in this slot, e.g.,
    + 1x1 for outstream (or whatever size you pass into Google Ad Manager as your outstream impression)
    + whatever banner sizes are valid for your site / use case

### Native

Follow the instructions for creating line items, creatives, custom native formats, and native styles in [Show Native Ads][nativeAdSetup], with the following changes:

+ Add key-value targeting for **'hb_format' is 'native'**

    ![Set 'hb_format' to 'native']({{site.baseurl}}/assets/images/ad-ops/multi-format/hb_format_native.png)

+ Make sure you're targeting the right sizes for the native ads you want to serve:
    + Fixed-size native, where you specify one or more absolute sizes
    + Fluid, which expands to fit whatever space it's put in
    + For more information on fluid vs. fixed, see [the Google Ad Manager docs](https://support.google.com/admanager/answer/6366914)

## Related Topics

+ [Show Multi-Format Ads with Prebid.js]({{site.baseurl}}/dev-docs/show-multi-format-ads.html) (Engineering setup)
+ [Multi-Format Example]({{site.baseurl}}/dev-docs/examples/multi-format-example.html) (Example code)



<!-- Reference Links -->

[bannerAdSetup]: /adops/send-all-bids-adops.html
[nativeAdSetup]: /adops/gam-native.html
