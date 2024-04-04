---
layout: page_v2
title: Getting Started with Video for Prebid.js
description: Prebid Video Getting Started
pid: 1
sidebarType: 4
---



# Getting Started with Video for Prebid.js

{: .no_toc }

If you’re new to header bidding and Prebid, your implementation of Prebid for video demand will likely go much smoother if you first read the following:

- [What Is Prebid?](/overview/intro.html)
- [Getting Started with Prebid for Developers](/dev-docs/getting-started.html)

See [Prebid.js Video Overview](/prebid-video/video-overview.html) for a general description and high-level overview of working with video demand in Prebid.js.

- TOC
{:toc}

## Ad Ops

### Ad Server Setup

Start by reading [Ad Ops Getting Started](/adops/before-you-start.html). This will give you a general overview of setting up your price buckets and line items on your ad server.

One thing to keep in mind as you set up your line items is price granularity. Be sure to communicate your price granularity requirements to your developers, as they might need to define custom configuration settings, depending on your granularity.

#### Instream

If you already have a Prebid integration for banner, you must create a separate set of ad server line items to enable Prebid to monetize instream video.

If you’re using Google Ad Manager as your ad server:
Once you understand the general setup requirements, follow the instructions for video-specific line item setup in [Setting Up Prebid Video in Google Ad Manager](/adops/setting-up-prebid-video-in-dfp.html).

If you’re using another ad server:
Follow the instructions for your ad server to create line items for instream video content.  The primary points to keep in mind as you set up your line items include:

- Line items must target Prebid key-values.
- The VAST creative URL must be in the format `https://prebid.adnxs.com/pbc/v1/cache?uuid={hb_cache_id}`, where `{hb_cache_id}` is the value passed to the ad server from Prebid.js.

#### Outstream

If you already have a Prebid integration for banner, you don’t need to do anything differently for outstream video. Outstream units use the same creative and line item targeting setup as banner creatives. See the [Step by Step Guide to Google Ad Manager Setup](/adops/step-by-step.html) for instructions. (If you’re not using Google Ad Manager as your ad server, follow your ad server’s guidelines for setting up your line items.)

{: .alert.alert-info :}
**Prebid Server** If you’ve decided to conduct your header bidding auctions server-side rather than on the client, you need to have a Prebid Server account or set up your own. See the [Prebid Server Overview](/prebid-server/overview/prebid-server-overview.html) to begin your integration.

## Developers

### Download Prebid.js

Your first step to implementing header bidding for video is to [download Prebid.js](/download.html). Before downloading, select the adapters you want to include. (You can add more adapters later.)

- Include at least one bid adapter that supports video. Find a list of eligible adapters [here](/dev-docs/bidders.html#bidder-video-native).
- If Google Ad Manager is your ad server, you must include the [Google Ad Manager Video module](/dev-docs/publisher-api-reference/adServers.dfp.buildVideoUrl.html).
- If you’ll be integrating with Prebid Server, be sure to include “Prebid Server” in the list of adapters.

### How to integrate

#### Prebid Video Module

{: .alert.alert-warning :}
The Video Module is a new way of handling Video in Prebid.

To integrate Prebid with a video player, we recommend using the Video Module. The Video Module will allow Prebid.js to automatically:

- render bids in your desired video player
- mark used bids as won
- trigger player and media events
- fill the oRTB Video Impression and Content params in the bid request

For details on how to configure follow these [instructions](/prebid-video/video-module.html).

#### Integrating on your own

If you prefer to fully own the integration between Prebid and Video, you can follow these [instructions]({{site.github.url}}/prebid-video/video-integrating-solo.html).

## Further Reading

- [Prebid.js for Video Overview](/prebid-video/video-overview.html)
- [What is Prebid?](/overview/intro.html)
