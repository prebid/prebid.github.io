---
layout: page_v2
title: GAM Step by Step - Video Creatives
head_title: GAM Step by Step - Video Creatives
description: Setting up in-player and long-form video for Prebid in Google Ad Manager
top_nav_section: adops
sidebarType: 3
---

# GAM Step by Step - Video Creatives
{: .no_toc }

- TOC
{:toc}

## Overview

This page walks you through the steps required to create in-player and long-form video creatives to attach to your Prebid line items in Google Ad Manager (GAM).

It applies to these scenarios:

- Instream video (also called "in-player")
- For Prebid Mobile only, it also applies to In-Renderer video (formerly known as "outstream")
- Long form video

{: .alert.alert-success :}
For complete instructions on setting up Prebid line items in Google Ad Manager, see [Google Ad Manager with Prebid Step by Step](/adops/step-by-step.html).

{: .alert.alert-info :}
For engineering setup instructions, see [Show Video Ads with a Google Ad Manager Video Tag](/dev-docs/show-video-with-a-dfp-video-tag.html).

Each VAST creative contains a URL that points to the cached VAST XML. (This is because most video players can only work with a URL that returns VAST XML.) When setting up video creatives, it's important to understand where the VAST XML is stored for each of your bidders. The most common place to store VAST XML is the AppNexus cache, but some bidders (such as RubiconProject and SpotX) use their own cache services. To support such bidders, see [Multiple Cache Locations](#multiple-cache-locations) below.

## Single Cache Location

All of your bidders may use the same VAST cache server in these scenarios:

- Mobile SDK video interacts with Prebid Server which will be set up to cache VAST.
- All of your Prebid.js bidders return VAST XML.
- You utilize the Prebid.js [ignoreBidderCacheKey](/dev-docs/publisher-api-reference/setConfig.html#setConfig-vast-cache) option.

In any of these cases, you only need to set up creatives pointing to the VAST cache:

1. Select **Delivery** > **Creatives** and click the **VAST creatives** tab.
2. Click **New creative**.
3. In the **New VAST creative** screen, select your **Advertiser**, then select **Redirect**.
4. Enter a **Name** for your creative.
5. Set the **VAST tag URL** to the cache location.

{: .alert.alert-info :}
**Prebid Cache and the VAST creative URL warning**:
Google Ad Manager will show you a warning stating that fetching VAST from the creative URL failed. This is expected, since the creative URL points to a server-side asset cache hosted by Prebid Server.

**In Player Video Cache Location**

If you’re using a Send Top Price Bid configuration, then the VAST URL will be the same for each bidder:

`https://prebid.adnxs.com/pbc/v1/cache?uuid=%%PATTERN:hb_uuid%%`

or

`[other bidder cache location]`

If you’re using Send All Bids, the VAST URL will include the bidder-specific targeting variable. Be sure to replace `BIDDERCODE` with the actual bidder code for your bidders:

`https://prebid.adnxs.com/pbc/v1/cache?uuid=%%PATTERN:hb_uuid_BIDDERCODE%%`

or

`[other bidder cache location]`

**Long-Form Video Cache Location**

If your creative is for long-form (OTT) video, you must include a prefix in your VAST URL. For example (Send Top Price Bid):

`https://prebid.adnxs.com/pbc/v1/cache?uuid=50.00_news_30s_%%PATTERN:hb_cache_id%%`

or (Send All Bids):

`https://prebid.adnxs.com/pbc/v1/cache?uuid=50.00_news_30s_%%PATTERN:hb_cache_id_BIDDERCODE%%`

In these examples, the `uuid` is set to the value of the `hb_pb_cat_dur` key you target in your line item. This value consists of the price bucket, label (for competitive exculsions), and video duration. In this example we've specified a price bucket of `50.00`, a label of `news`, and a duration of `30s`. See [GAM with Prebid Step by Step](/adops/step-by-step.html#targeting) for more information.

{:start="6"}
6. Set the **Duration** to the max length of video ads you serve. Ads flowing through header bidding are going to differ in length, so if you don't know what the max length is, set it to `30`. If you're using long-form video, this value should match the duration you specified in your uuid targeting.

The resulting creative should look something like the following:

![GAM Video Creative Setup](/assets/images/ad-ops/gam-sbs/appnexus_vast_tag.png)

{:start="7"}
7. If you're using jsdelivr, set your **Associated ad technology provider**:

{% include /adops/adops-creative-declaration.html %}

{:start="8"}
8. Click **Save and preview**.

## Multiple Cache Locations

If you're utilizing any bidders that cache their own VAST, you have two options:

- If you're using Prebid.js 4.28 or later, your engineers can specify the [ignoreBidderCacheKey](/dev-docs/publisher-api-reference/setConfig.html#setConfig-vast-cache) option on `setConfig({cache})`. This will cause the browser to generate a VAST wrapper and cache it in your standard location. Then you can use the instructions above for "Single Cache Location". The tradeoff is that this approach requires the video player to unwrap one extra level of VAST.
- Utilize creative-level targeting in the ad server. See [GAM with Prebid Step by Step](/adops/step-by-step.html#creative-level-targeting) for details. In this case, you'll target on the `hb_bidder` or `hb_bidder_BIDDERCODE` (replacing BIDDERCODE with the code for your bidder) key with a value of the bidder whose VAST is associated with that creative.

## Further Reading

- [Google Ad Manager with Prebid Step by Step](/adops/step-by-step.html)
- [Show Video Ads with Google Ad Manager](/dev-docs/show-video-with-a-dfp-video-tag.html)
- [Send All Bids vs Top Price](/adops/send-all-vs-top-price.html)
- [Prebid Universal Creative](/overview/prebid-universal-creative.html)
- [Creative Considerations](/adops/creative-considerations.html)
- [Ad Ops Planning Guide](/adops/adops-planning-guide.html)
