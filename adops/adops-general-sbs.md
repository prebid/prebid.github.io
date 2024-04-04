---
layout: page_v2
title: General Ad Server Prebid Setup
head_title: General Ad Server Prebid Setup
description: General step-by-step instructions for setting up line items for Prebid within an ad server.
#note the sidebar type needs to reflect the section this file is displayed in. See _data/sidenav.yml for the side nav categories.
sidebarType: 3
---

# General Ad Server Prebid Setup
{: .no_toc }

* TOC
{: toc }

## Overview

Prebid.org provides step-by-step instructions for manually configuring Prebid in the following ad servers:

* [Google Ad Manager](/adops/step-by-step.html)
* [Xandr Monetize Ad Server](/adops/setting-up-prebid-with-the-appnexus-ad-server.html)
* [Freewheel](/adops/setting-up-prebid-video-in-freewheel.html)
* [Smart Ad Server](/adops/setting-up-prebidjs-with-Smart-Ad-Server.html)

If you’re using a different ad server, you can use the general instructions provided here and adapt them to your ad server.

{: .alert.alert-info :}
Prebid.org documentation is open source, so if you would like to add instructions for your ad server, create a PR in our [Github repository](https://github.com/prebid/prebid.github.io).

## Getting Started

{: .alert.alert-info :}
We recommend reviewing the [Ad Ops Planning Guide](/adops/adops-planning-guide.html) before adding items to your ad server.

At a high level, configuring an ad server to work with Prebid involves creating a set of always-on objects in your ad server that listen for bids and, when chosen, return the appropriate ad creative that will render the ad for the winning bid.

For the purposes of this discussion, we’re going to refer to the elements in your ad server that contain the details of the bid, such as the price, priority, and media format, as “line items.” Line Items live in a container that we’ll refer to as an "order". These elements may have different names in your ad server.

It will be important to understand how your ad server targets line items at runtime. It's not required, but many Prebid publishers set up two
parallel sets of line items: one for display ads and one for video ads. In this kind of setup, you'll need to consider
how the ad server will choose between competing Prebid line items besides the price. Some ad servers filter
eligible line items by size and some may understand the mediatype. If nothing else, you may use the `hb_format` key-value pair to help your ad server differentiate appropriately.

### Inventory

Most ad servers will have a step where an 'adunit' is created. For Prebid Mobile outstream, you'll want to confirm that
the adunit will support a video size with a slightly different dimension, e.g. 300x251v vs 300x250v. See the [planning guide](/adops/adops-planning-guide.html#rendering-mobile-outstream-ads) for background on why.

### Create Advertisers and Orders

Ad servers typically work in a hierarchical structure, with advertisers containing orders, which in turn contain line items. You need to have your advertisers and orders set up before you can start creating line items and creatives. The advertisers you create for Prebid will typically depend on whether you’re sending all bids or only the top price bid to the ad server.

* Send Top Bid: Create one general Prebid advertiser
* Send All Bids: Create one Prebid advertiser per bidder where orders are organized by bidder, with one or more orders containing line items targeted towards a single bidder.

### Create Native Template

If you’re working with native inventory, you’ll most likely need to have your native template created and stored before you begin creating your line item. Follow your ad server’s instructions for setting up native creative templates.

If your ad server does not support native, Prebid has options for creating templates in the adunit or in an
external script. See the [native implementation guide](/prebid/native-implementation.html) for more detail.

### Create Keys

When you create your line item, you’ll be targeting key-value pairs that are being sent with the ad request to the ad server. You may need to predefine these keys and values before targeting them in your line items.

See [Key Values](/adops/key-values.html) for information on the keys you’ll need.

## Set Up Your Line Items

The exact order of the following steps will differ depending on your ad server.

### General Settings

1. Enter a name for your line item. Suggested format: Prebid – format - bidder – price bucket. For example, `Prebid – banner - BidderA – 1.50`.
2. Set the priority of your line item to whatever you think is appropriate. Typically Prebid line items are prioritized below direct-sold but above house/remnant.
3. Enter the sizes of your creatives:
    * Banner/Outstream/AMP/Video: Select the sizes of all ad slots included in the Prebid process.
    * Native: Select a native template.
4. Long-Form (OTT) Video only:
If you’re using competitive exclusions, fill in the associated field with the appropriate value. You’ll need to include this value when you set your targeting for the `hb_pb_cat_dur` key. See [Targeting](#targeting) below for more information.
5. Set your line item to start immediately, with no end date.
6. Set the price of your line item to one of your price buckets. (You’ll duplicate the line item and change this value for each additional price bucket.)
7. Set the targeting for your line item as discussed in the next section.

### Targeting

You’ll need to apply custom targeting specific to the Prebid values that are passed in with the ad request.

{: .alert.alert-info :}
These instructions assume you’re sending all bids to the ad server (the default). If you’re sending only the top price bid, your targeting keys will not include the bidder code. For example, rather than targeting price buckets with `hb_pb_BidderA`, you’ll target `hb_pb`. See [Send All Bids vs Top Price](/adops/send-all-vs-top-price.html) for more information.

Target the price bucket key: `hb_pb_BIDDERCODE` (where BIDDERCODE is the actual code for your bidder, such as BidderA) with the value of the price bucket you entered as the price for this line item.

The following additional keys must be added for the corresponding formats:

{: .alert.alert-info :}
Note that in previous versions of this documentation, it was recommended to target
to the `hb_format` key value pair. This is not necessary if your ad server can choose
the correct line item using the creative size.

**Long-Form (OTT) Video:**

For long-form video the custom key `hb_pb_cat_dur_BIDDERCODE` is required. The value of this key breaks down like this:

* _pb represents the price bucket. This is the currency amount entered as the line item price.
* _cat indicates the competitive exclusion industry code. (For engineering information, refer to the [Category Translation module](/dev-docs/modules/categoryTranslation.html)). This is the value entered as the competitive exclusion. If you are not using competitive exclusion, you can omit this portion of the value.
* _dur is the length of the video in seconds. This is the value you’ll enter as the maximum duration of the video.

For example, for a line item with a $10.00 CPM as the price, a competitive exclusion of “news”, and 30s entered for the video duration, you would enter the following in the custom key-value field: `hb_pb_cat_dur_BIDDERCODE = 10.00_news_30s`. If you’re not using competitive exclusion, you can have a value such as this: `hb_pb_cat_dur_BIDDERCODE = 10.00_30s`.

{: .alert.alert-info :}
For deals, the price bucket portion of this value will contain the dealID if deals are prioritized. See [Getting Started with Long Form Video](/prebid-video/video-long-form.html#configuration) for more information.

{: .alert.alert-info :}
Engineers will need to include the [Adpod module](/dev-docs/modules/adpod.html) and the [Category Translation module](/dev-docs/modules/categoryTranslation.html) in Prebid.js to implement long-form video bidding.

### Creative-level Targeting

If your ad server supports targeting creatives within the line item, it could come in handy. For example, if you’re going to use a single line item for multiple formats, or if you have multiple video cache locations, you may need to set additional targeting that’s specific to the creative rather than at the line item level.

### Save the Line Item

You’ve now added all fields required for targeting Prebid line items. You can add any other line item options you would normally use, such as additional targeting for geography. When you’ve filled in all the appropriate fields, save your line item.

## Create Your Creatives

The process of creating your creatives will differ based on the type of creative.

In general, you can interpret the instructions for setting up creatives in Google Ad Manager with some modifications; specifically, to the MACROs used in the ad tag. (See below for details.) Refer to the following for GAM documentation:

* [GAM Creative Setup: Banner/Outstream/AMP](/adops/gam-creative-banner-sbs.html)
* [GAM Creative Setup: Native](/adops/gam-native.html)
* [GAM Creative Setup: Video](/adops/setting-up-prebid-video-in-dfp.html)

## Additional Steps

The final steps in configuring Prebid on your ad server are to do the following:

1. Duplicate your creatives as needed. If you’re using the Prebid Universal Creative, the body of your creatives for each format will be the same. Duplicate and rename the creative to create as many as you’ll need to attach to the line item.
2. Associate the creatives with the line item.
3. Duplicate the line item. You’ll need one line item per price bucket. If you’re sending all bids, you’ll need one line item per price bucket and per bidder. For each line item you duplicate, edit the line item to have the correct name, price bucket, and bidder code.

## Further Reading

* [Ad Ops Planning Guide](/adops/adops-planning-guide.html)
* [Ad Ops and Prebid Overview](/adops/before-you-start.html)
