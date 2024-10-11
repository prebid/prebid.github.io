---
layout: page_v2
title: Prebid Video
description: Prebid Video
sidebarType: 6
---

# Prebid Video Ads

Welcome to Prebid video ad support. This is a collection of resources covering
how Prebid can help you monetize video. If you're new to Prebid video, a
good place to start would be the [Prebid.js-focused training video overview](/prebid-video/video-overview-video.html).

## Mapping Out Prebid Integration with the IAB Use Cases/Video Placement Types

The IAB has identified the [four types of video placements](https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/main/AdCOM%20v1.0%20FINAL.md#list_plcmtsubtypesvideo) for the introduced `plcmt` attribute in `Object:Video`, in accordance with the IAB Digital Video Guidelines: 

1. **Instream:** pre-roll, mid-roll and post-roll ads that are played before, during or after the streaming video content, which the viewer has requested. Instream video must be set to “sound on” by default at player start, or have explicitly clear user intent to watch the video content. While there may be other content surrounding the player, the video content must be the focus of the user’s visit.

2. **Accompanying Content:** the video player loads and plays before, between, or after paragraphs of text or graphical content.

3. **Interstitial:** video ads that are played without video content. During playback, the video ad must be the primary focus of the page, take up the majority of the viewport and cannot be scrolled out of view.

4. **No Content/Standalone:** video ads that are played without the streaming video content.

However, for the described four use cases/placement types, there are only two types of integration from the Prebid perspective:

1. [**In-player.**](/prebid-video/video-overview#in-player-integration) There's already a video player on the page. The publisher has to use the [Video Module](/prebid-video/video-module) or implement a javascript function that passes bid responses to the player. In this scenario, Prebid handles video bid caching server-side, then maps it to a unique cache ID, which will be passed to the ad server via key-value targeting. 

   The player calls the ad server, and the latter matches Prebid.js key-value pairs to a pre-configured line item, followed by the player’s rendering of the video ad from the winning bidder. 

2. [**In-renderer.**](/prebid-video/video-overview#in-renderer-integration) In this scenario, the Demand partner’s response to bid requests includes a [renderer](/overview/glossary#renderer) script, followed by Prebid’s handling of the following: 

   (a) Prebid communicates with the ad server as normal.   
   (b) If it wins the auction and needs to render the ad, there is special rendering activity required.  
   (c) Prebid needs to create an `iframe` and do the appropriate thing to load and invoke the renderer. 

**Here’s how Prebid implementation types are mapped out with the IAB use cases:**

{: .table .table-bordered .table-striped }
| IAB Use Case  | Prebid Implementation |
| ------------- | ------------- |
| Instream | In-player  |
| Accompanying Content | In-player  |
| Interstitial | In-player or in-renderer depending on implementation  |
| No Content/Standalone | In-player or in-renderer depending on implementation  |

## CTV-OTT

See the [Connected TV landing page](/formats/ctv.html).
