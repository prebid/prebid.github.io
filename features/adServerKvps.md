---
layout: page_v2
title: Prebid.js and Ad Server Key Values
description: Prebid.js and Ad Server Key Values
sidebarType: 1
---

# Prebid.js and Ad Server Key Values

{: .no_toc}

- TOC
{:toc}

The point of header bidding is to supply bids into the regular ad server calls.
Prebid.js provides many ways to do this. This document describes the controls for obtaining auction results.

## Overview

Here's the general way PBJS is integrated into the page:

1. Define AdUnits so they can be linked to existing ad server ad slots in the page
1. Set auction parameters
1. Initiate the auction
1. Gather bid responses to send to the ad server
1. The ad server makes the final decision about which ad to render

This last step has historically been called "targeting" in Prebid.js, but really what's
sent to the adserver is a set of Key Value Pairs (KVPs) that serve several purposes:

- **Ad server line item targeting**. These values are used to pick out which line items match the request. Generally targets depend on the hb_pb attribute, but could also include hb_deal and hb_format.
- **Display**. Some of these values are needed for rendering the creative properly when the Prebid line item is chosen, including hb_adid, hb_uuid, hb_size, and for AMP/app hb_cache_host.
- **Reporting**. Some publishers rely on ad server key-values for important business reporting. The keys used for reporting could be any of the above, along with hb_source.

## Decide How The Results Will Be Used

How a publisher should configure Prebid.js to report auction results
will depend on how the final ad decision will be made. These approaches
need to be in sync.

There are four main scenarios, described in the following sections.

### Ad Server Line Items are Created Per-Bidder

In order to have header bidding compete with direct-sold demand,
a publisher can set up placeholder line items in their ad server.

Prebid.org recommends setting up separate line items for each bidder. Benefits to this approach include:

- You can use ad server reporting to get a view of which bidders are performing well.
- You can control ad decisions with the ad server.
- Video bids have a fallback available.

There are more details on this scenario in the [Ad Ops section](/adops/send-all-vs-top-price.html).

Once implemented in the ad server, setting this up in Prebid.js is
simple, as it is the default [Send All Bids](#send-all-kvps) mode. However
to limit the number of values sent to the ad server, some flavor of
this solution like the [Top Two Bids and Deals](#top-two-bids-and-deals)
may be of interest.

{: .alert.alert-info :}
Note that `enableSendAllBids` mode can send a lot of keys to your
ad server. Though we recommend this setting, we also recommend that
publishers monitor the key traffic and [control](#controls) as necessary.

### Only One Set of Ad Server Line Items are Created

There are reasons a publisher may not want to create separate line items for each bidder. For example:

- Some ad servers have a limit on how many line items can be created.
- It takes work to set up line items.
- The volume of key-value pairs (KVPs) can be a factor.

So the other ad-server based solution is to create one set of line
items that is used by all bidders.

Setting this mode up in Prebid.js is done by setting [enableSendAllBids](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Send-All-Bids)
to false. See the [Bare Minimum solution](#the-bare-minimum-for-display-ads) for reference.

See [Send All Bids vs Top Price](/adops/send-all-vs-top-price.html) for ad ops details on this scenario.

### Post-Bid

Sometimes Prebid.js is used as a fallback. This mode is called [PostBid](/overview/what-is-post-bid.html)

In this scenario, the ad server line item is scheduled as a low-priority 'remnant' and the auction takes place when there's nothing else to serve.
The Prebid.js code is in the ad server creative, which decides the overall winner itself. See the [Post Bid Example](/dev-docs/examples/postbid.html).

### No Ad Server

Finally, a publisher may want a particular ad unit to be programmatic-only, which Prebid.js can support.
Please see the [No Ad Server Example](https://github.com/prebid/Prebid.js/blob/master/integrationExamples/noadserver/basic_noadserver.html).

## Obtaining Auction Results

### Display and Native

In early versions of Prebid.js, there were a couple of basic functions
publishers could use to get the auction results:

- [pbjs.setTargetingForGPTAsync](/dev-docs/publisher-api-reference/setTargetingForGPTAsync.html) - matches Google Publisher Toolkit ad slots to Prebid.js AdUnits, obtains the auction results for that adunit, and adds "targeting" values using GPT-provided functions.
- [pbjs.getAdserverTargeting](/dev-docs/publisher-api-reference/getAdserverTargeting.html) - a more generic interface for obtaining KVPs.

All of the other functions available in the [publisher API](/dev-docs/publisher-api-reference.html) for obtaining auction bids came later.

When there are a lot of adunits and bidders on a page, the number of KVPs being sent
to the ad server can grow pretty large, so it quickly became apparent that many options were needed for controlling which KVPs these functions returned.

Note that in old versions of Prebid.js, native ad components were passed via ad server KVPs.
That approach has been deprecated -- all implementations should now use [one of the recommended approaches for native](/prebid/native-implementation.html).

### Video

Video's always been a different implementation than banners because
it's the video player that controls the ad call, not in-page JavaScript like
the GPT library. So the [Google Ad Manager Video module](/dev-docs/modules/dfp_video.html) includes the [buildVideoUrl](/dev-docs/publisher-api-reference/adServers.dfp.buildVideoUrl.html) function.

Publishers using other ad servers need to integrate on their own
using the [pbjs.getAdserverTargetingForAdUnitCode](/dev-docs/publisher-api-reference/getAdserverTargetingForAdUnitCode.html) function to build whatever
needed to pass to the video player.

### Mobile App

The Prebid SDK does not have a direct way to control what key-value pairs will
be generated by Prebid Server. Instead, the [top-level stored request](/prebid-server/features/pbs-storedreqs.html) stored in Prebid Server defines what should be produced.

That stored request will contain the 'targeting' options needed to
match the line item setup. See the [Prebid-Server-based
targeting configuration](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#ad-server-targeting), for more detail. The rest of this document is about Prebid.js.

## Controls

Over the years, quite a few options have been added to to Prebid.js to adjust the number of bids and the exact set of KVPs sent to the ad server. This is an overlapping-but-powerful set of controls. There are often multiple ways to implement the same requirements, and there's no "wrong" way to do it.

The list is ordered by those functions that Prebid recommends starting with:

1. [enableSendAllBids](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Send-All-Bids) - the grandaddy of targeting options. If false, only the winning set of KVPs will be sent. We recommend leaving this to the default value of true so that all bidders are represented in the final decision and for detailed reporting in the ad server, but setting it to false (aka "Send Top Bid" mode) is the most dramatic way to minimize what's sent to the ad server.
1. [targetingControls.alwaysIncludeDeals](/dev-docs/publisher-api-reference/setConfig.html#setConfig-targetingControls) - this option makes sure that deals are sent along even if another control would have suppressed it. Publishers running deals should set this value to true.
1. [sendBidsControl.bidLimit](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Send-Bids-Control) - this option sorts the bids in CPM order and returns the top N, plus any deals if the 'alwaysIncludeDeals' flag is true.
1. [targetingControls.allowTargetingKeys](/dev-docs/publisher-api-reference/setConfig.html#setConfig-targetingControls) - this resets the default keys defined by Prebid.js, defining which KVPs are sent for the winning set. (e.g. hb_pb)
1. [targetingControls.allowSendAllBidsTargetingKeys](/dev-docs/publisher-api-reference/setConfig.html#setConfig-targetingControls) - similar to allowTargetingKeys but works on the bidder-specific KVPs. (e.g. hb_pb_BIDDER)
1. [bidderSettings.standard.adserverTargeting](/dev-docs/publisher-api-reference/bidderSettings.html) - completely redefine what Prebid produces for the winning bid's KVPs.
1. [bidderSettings.standard.sendStandardTargeting](/dev-docs/publisher-api-reference/bidderSettings.html) - turn off the sending of the standard winning KVPs
1. [bidderSettings.BIDDER.adserverTargeting](/dev-docs/publisher-api-reference/bidderSettings.html) - completely redefine what Prebid produces for the bidder-specific KVPs.
1. [bidderSettings.BIDDER.sendStandardTargeting](/dev-docs/publisher-api-reference/bidderSettings.html) - turn off the sending of the standard bidder-specific KVPs
1. [targetingControls.addTargetingKeys](/dev-docs/publisher-api-reference/setConfig.html#setConfig-targetingControls) - This is similar to allowTargetingKeys but adds KVPs to the default set rather than replacing them.
1. [targetingControls.auctionKeyMaxChars](/dev-docs/publisher-api-reference/setConfig.html#setConfig-targetingControls) - This limits the number of characters Prebid is allowed to add to the KVPs. The function will count the number of characters used and will limit to the integer number of bids that won't exceed this count.
1. [sendBidsControl.dealPrioritization](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Send-Bids-Control) - This changes the sort order used by 'bidLimit' to put deals first. It's not useful when alwaysIncludeDeals is specified.

### Examples

Here are a few scenarios to give you a sense of the configurability.

#### Send All KVPs

If the number of KVPs sent to the ad server is not a concern, then the recommended approach is to Send All Bids and all deals:

```javascript
pbjs.setConfig({
    enableSendAllBids: true,
    targetingControls: {
        alwaysIncludeDeals: true
    }
});
```

#### The Bare Minimum for Display Ads

The opposite approach is to send only the winning set of KVPs directly needed for targeting line items and rendering.

```javascript
pbjs.setConfig({
    enableSendAllBids: false,
    targetingControls: {
        allowTargetingKeys: ['PRICE_BUCKET', 'AD_ID', 'SIZE']
    }
});
```

Note: This example lacks video support, deal support, and doesn't even tell you which bidder won.

#### Top Two Bids and Deals

```javascript
pbjs.setConfig({
    sendBidsControl: { bidLimit: 2 },
    targetingControls: {
        alwaysIncludeDeals: true,
        allowTargetingKeys: ['BIDDER', 'AD_ID', 
           'PRICE_BUCKET', 'SIZE', 'UUID', 'FORMAT', 'DEAL'],
        allowSendAllBidsTargetingKeys: ['AD_ID', 'PRICE_BUCKET', 'SIZE',
           'FORMAT', 'DEAL']
    }
});
```

Note: This assumes that video creatives are set up refering to HB_UUID rather than bidder-specific UUID values.

#### Completely Custom KVPs

Publishers that don't want to use KVPs prefixed with "hb_" can change them with
bidderSettings:

```javascript
pbjs.setConfig({
    enableSendAllBids: false
});
pbjs.bidderSettings={
  standard: {
    adserverTargeting: [{
        key: "pb_price",
        // note the price granularity assumption below is Medium Granularity
    //   other options are pbAg (auto), pbCg (custom), pbDg (dense),
    //   pbHg (high), pbLg (low)
        val: function(bidResponse) { return bidResponse.pbMg; } 
    },{
        key: "pb_size",
        val: function(bidResponse) { return bidResponse.size; } 
    },{
        key: "pb_adid",
        val: function(bidResponse) { return bidResponse.adId; } 
    },{
        key: "pb_uuid",
        val: function(bidResponse) { return bidResponse.videoCacheKey; } 
    },{
        key: "pb_format",
        val: function(bidResponse) { return bidResponse.mediaType; }
    },{
        key: "pb_bidder",
        val: function(bidResponse) { return bidResponse.bidder; }
    },{
        key: "pb_deal",
        val: function(bidResponse) { return bidResponse.dealId; } 
    }]
  }
};
```

## Further Reading

- [Prebid.js Publisher API setConfig() routine](/dev-docs/publisher-api-reference/setConfig.html)
- [Ad Ops and Prebid](/adops/before-you-start.html)
