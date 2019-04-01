---
layout: page_v2
title: Getting Started with Video for Prebid.js
description: Prebid Video Getting Started
pid: 1
is_top_nav: yeah
top_nav_section: pbjs-video
nav_section: pbjs-video-get-started
sidebarType: 4
---



# Getting Started with Video for Prebid.js
{: .no_toc }

If you’re new to header bidding and Prebid, your implementation of Prebid for video demand will likely go much smoother if you first read the following:

-	[What Is Prebid?]({{site.github.url}}/overview/intro.html)
-	[Getting Started with Prebid]({{site.github.url}}/overview/getting-started.html)

See [Prebid.js Video Overview]({{site.github.url}}/prebid-video/video-overview.html) for a general description and high-level overview of working with video demand in Prebid.js.

* TOC
{:toc}

## Ad Ops

### Ad Server Setup

Start by reading [AdOps Getting Started]({{site.github.url}}/overview/getting-started.html). This will give you a general overview of setting up your price buckets and line items on your ad server.

One thing to keep in mind as you set up your line items is price granularity. Be sure to communicate your price granularity requirements to your developers, as they might need to define custom configuration settings, depending on your granularity.

#### Instream

If you already have a Prebid integration for banner, you must create a separate set of ad server line items to enable Prebid to monetize instream video.

If you’re using DFP as your ad server:
Once you understand the general setup requirements, follow the instructions for video-specific line item setup in [Setting Up Prebid Video in DFP]({{site.github.url}}/adops/setting-up-prebid-video-in-dfp.html).

If you’re using another ad server:
Follow the instructions for your ad server to create line items for instream video content.  The primary points to keep in mind as you set up your line items include:
•	Line items must target Prebid key-values.
•	The VAST creative URL must be in the format `https://prebid.adnxs.com/pbc/v1/cache?uuid={hb_cache_id}`, where `{hb_cache_id}` is the value passed to the ad server from Prebid.js.


#### Outstream

If you already have a Prebid integration for banner, you don’t need to do anything differently for outstream video. Outstream units use the same creative and line item targeting setup as banner creatives. See the [Step by Step Guide to DFP Setup]({{site.github.url}}/adops/step-by-step.html) for instructions. (If you’re not using DFP as your ad server, follow your ad server’s guidelines for setting up your line items.)

{: .alert.alert-info :}
**Prebid Server** If you’ve decided to conduct your header bidding auctions server-side rather than on the client, you need to have a Prebid Server account. See [Get Started with Prebid Server]({{site.github.url}}/dev-docs/get-started-with-prebid-server.html) to begin your integration. After you’ve created an account, you’ll need to pass along the account ID to your developers.



## Developers

### Download Prebid.js

Your first step to implementing header bidding for video is to [download Prebid.js]({{site.github.url}}/download.html). Before downloading, select the adapters you want to include. (You can add more adapters later.)

-	Include at least one video adapter. Find a list of available video adapters [here]({{site.github.url}}/dev-docs/bidders.html#bidder-video-native).
-	If DFP is your ad server, you must include the [DFP Video module]({{site.github.url}}/dev-docs/publisher-api-reference.html#module_pbjs.adServers.dfp.buildVideoUrl).
-	If you’ll be integrating with Prebid Server, be sure to include “Prebid Server” in the list of adapters.

### Define Prebid Ad Units

Setting up Prebid ad units is almost the same whether you’re working with instream video ads or outstream. The primary difference is specifying the type of video ad (instream or outstream), which you do in the mediaTypes.video.context field:

```
    var adUnit1 = {
        code: 'videoAdUnit',
        mediaTypes: {
            video: {
                context: 'instream', //or 'outstream'
                playerSize: [640, 480]
            }
```

The mediaTypes.video.playerSize field is where you define the player size that will be passed to demand partners.

<div class="alert alert-info">
  <strong>Prebid Server</strong>
  <p>If you’re using Prebid Server, you must also include the mediaTypes.video.mimes field, as this is required by OpenRTB.</p>

  <pre>
        mediaTypes: {
            video: {
                context: 'instream', // or 'outstream'
                playerSize: [640, 480],
                mimes: ['video/mp4'],
  </pre>

  <p>For more on Prebid Server ad unit requirements, see <a href="{{site.github.url}}/dev-docs/get-started-with-prebid-server.html#using-prebid-server-to-show-video-ads">Getting Started with Prebid Server – Video</a>.</p>

</div>

In your ad unit you also need to define your list of bidders. For example, including AppNexus as a bidder would look something like this:

```
    var adUnit1 = {
        ...
        bids: [{
            bidder: 'appnexus',
            params: {
                placementId: '123456789',
            }
        }]
```

The parameters differ depending on which bidder you’re including. For a list of parameters for each bidder, see [Bidders’ Params]({{site.github.url}}/dev-docs/bidders.html).

For full details on creating instream video ad units, see [Show Video Ads with DFP – Create Ad Unit]({{site.github.url}}/dev-docs/show-video-with-a-dfp-video-tag.html#create-a-video-ad-unit).

For full details on creating outstream video ad units, see [Show Outstream Video Ads – Create Ad Unit]({{site.github.url}}/dev-docs/show-outstream-video-ads.html#step-1-set-up-ad-units-with-the-video-media-type-and-outstream-context).

### Configuration

After you’ve defined your ad units, you can continue with the rest of your configuration.  This is where setups for instream and outstream more drastically diverge. For complete configuration details, see the following:

Instream: [Show Video Ads with DFP]({{site.github.url}}/dev-docs/show-video-with-a-dfp-video-tag.html)
Outstream: [Show Outstream Video Ads]({{site.github.url}}/dev-docs/show-outstream-video-ads.html)

Be sure to note the setting for price granularity.  You might need to set up a custom price granularity. (See “Custom CPM Bucket Sizing” under [Price Granularity]({{site.github.url}}/dev-docs/publisher-api-reference.html#setConfig-Price-Granularity). Or, if you’re monetizing both banner and video inventory with Prebid, you might need to define format-specific price granularity settings through  [mediaTypePriceGranularity]({{site.github.url}}/dev-docs/publisher-api-reference.html#setConfig-MediaType-Price-Granularity).

{: .alert.alert-info :}
**Prebid Server**  If you’re using Prebid Server, you also need to configure your server-to-server bidder adapters. See [Getting Started with Prebid Server]({{site.github.url}}/dev-docs/get-started-with-prebid-server.html#step-4-configure-s2s-bidder-adapters) for details and examples.

### Examples

See [Prebid Video Examples]({{site.github.url}}/examples/video/) for working examples of instream and outstream video ads.

## Further Reading

-   [Prebid.js for Video Overview]({{site.github.url}}/prebid-video/video-overview.html)
-   [What is Prebid?]({{site.github.url}}/overview/intro.html)
