---
layout: page_v2
title: Prebid Video Module
description: How to use the Video Module to integrate Prebid with Video
pid: 1
sidebarType: 4
---

# The Video Module

The Prebid Video Module allows Prebid to directly integrate with a Video Player.

The Video Module will automatically:
- render bids in the desired video player
- mark used bids as won
- trigger player and media events
- fill the oRTB Video Impression and Content params in the bid request

{: .table .table-bordered .table-striped }
| Video Player | Submodule Name |
|--------------|----------------|
| [JW Player](https://www.jwplayer.com/)  | jwplayerVideoProvider.js |
| [video.js](https://videojs.com/)   | videojsVideoProvider.js |


## Publishers

## SSPs 

Before bids are requested, the Video Module automatically enriches the auction. SSPs can benefit from this by reading from the proper params.

### mediaTypes.video

Before bids are requested, all ad units configured to be handled by the Video Module will be enriched. The adUnit's `mediaTypes.video` param will be populated automatically.
SSPs wishing to benefit from this enrichment should read from `mediaTypes.video`.

### ortb2.site.content

Similarly, before bids are requested, the `ortb2.site.content` param is populated in the `bidderRequest` argument of the `buildRequests` function with contextual information from the video player and its media.
SSPs wishing to benefit from this enrichment should read from `bidderRequest.ortb2.site.content`.

## Contributing

The Prebid Video Module acts as a simple Video interface which Prebid can connect to. In order for the Video Module to plug into a Video Player, a video submodule must be implemented. The Video Submodule acts as a bridge between the Video Module and the Video Player.
To add a submodule please follow the instructions in [How to add a video submodule]({{site.github.url}}/dev-docs/add-video-submodule.html).
//TODO https://docs.prebid.org/dev-docs/add-rtd-submodule.html
