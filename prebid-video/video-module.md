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

## Publishers

Publishers benefit the most from the Video Module since it allows integrating with a Video Player by simply configuring Prebid.
Publishers can follow these steps to integrate:

### Setting up

#### Include submodule in build

The first step is to include the submodules for the Video Players that you will be integrating with in your build.

{% highlight bash %}
gulp build --modules=jwplayerVideoProvider,bidAdapter1,bidAdapter2
{% endhighlight %}

The following Video Players are currently supported:

{: .table .table-bordered .table-striped }
| Video Player | Submodule Name | Vendor Code |
|--------------|----------------|-------------|
| [JW Player](https://www.jwplayer.com/)  | jwplayerVideoProvider | 1 |
| [video.js](https://videojs.com/)   | videojsVideoProvider | 2 |

Not seeing your desired video player ? Learn how to add support by reading our [contribution guide](#Video-Module-Contributing)

Optionally, if you are using an Ad Server, you can configure the Video Module to integrate with it. The following Ad Servers are currently supported:

{: .table .table-bordered .table-striped }
| Ad Server | Module Name | Vendor Code |
|--------------|----------------|-------------|
| [Google Ad Manager](https://admanager.google.com/)  | dfpAdServerVideo | 'gam' |

**Note:** You must include the Ad Server's module in your build. 

#### Configure Prebid

To register a video player with Prebid, you must use `setConfig` to set a `video` config compliant with the structure described in the [setConfig reference]({{site.baseurl}}/dev-docs/publisher-api-reference/setConfig.html#video-module).

#### Configure Ad Units

In order for Prebid to know which Ad Unit relates to which Video Player, you must include a `video` configuration in your Ad Unit. This allows Prebid to render the ad in the proper Video Player and obtain the Ortb data from the Video Player that will render the ad.
For the list of properties in the `video` object of the ad unit please visit the [adUnit.video reference]({{site.baseurl}}/dev-docs/adunit-reference.html#adUnit.video).

### Features for Publishers

Integrating with the Video Module gives publishers access to the following features

#### Render ads

Prebid can load the ad directly into the player when the auction is complete.
This feature happens automatically as long as you do **not** define a `bidsBackHandler` when calling `requestBids`.

#### Events

Media, ad and Player events are added when using the Video Module. 
The event payload includes metadata which can be used for analytics, error handling, and customizing your integration.
All Video Module events include a `divId` and `type` param in the payload. The `divId` is the div id string of the player emitting the event; it can be used as an identifier. The type is the string name of the event. 
The remaining Payload params are listed in the following table.

{: .table .table-bordered .table-striped }
| Event Constant | Event String | Description | Payload Params |
|----------------|--------------|-------------|----------------|
| SETUP_COMPLETE | 'setupComplete' | Fried when the player is instantiated and the integration is complete. At this point the API is ready to be used. | playerVersion: string - viewable: boolean - viewabilityPercentage: number - mute: boolean - volumePercentage: number | 
| SETUP_FAILED | 'setupFailed' | Fired when the integration was unsuccessful. | playerVersion: string - errorCode: number - errorMessage: string - sourceError: object |
| DESTROYED | 'destroyed' | Fired when the player instance has been destroyed. | |
| AD_REQUEST | 'adRequest' | Fried when the player is asked to load an ad. | adTagUrl: string |
| AD_BREAK_START | 'adBreakStart' | Fired when an ad break begins. An ad break consists of an ad, or a sequence of subsequent ads. | offset: string |
| AD_LOADED | 'adLoaded' | Fired when the player has finished loading the ad's VAST response. | adTagUrl: string - offset: string - loadTime: number - vastAdId: string - adDescription: string - adServer: string - adTitle: string - advertiserId: string - advertiserName: string - dealId: string - linear: boolean - vastVersion: string - creativeUrl: string - adId: string - universalAdId: string - creativeId: string - creativeType: string - redirectUrl: string - adPlacementType: number | waterfallIndex: number - waterfallCount: number - adPodCount: number - adPodIndex: number - wrapperAdIds: array[string] |
| AD_STARTED | 'adStarted' | Fired when the ad playback has started. | adTagUrl: string - offset: string - loadTime: number - vastAdId: string - adDescription: string - adServer: string - adTitle: string - advertiserId: string - advertiserName: string - dealId: string - linear: boolean - vastVersion: string - creativeUrl: string - adId: string - universalAdId: string - creativeId: string - creativeType: string - redirectUrl: string - adPlacementType: number | waterfallIndex: number - waterfallCount: number - adPodCount: number - adPodIndex: number - wrapperAdIds: array[string] |
| AD_IMPRESSION | 'adImpression' | Fired when an ad has played for 2 consecutive seconds while the player is at least 50% viewable, as defined by the IAB standards for video ad impressions. | adTagUrl: string - offset: string - loadTime: number - vastAdId: string - adDescription: string - adServer: string - adTitle: string - advertiserId: string - advertiserName: string - dealId: string - linear: boolean - vastVersion: string - creativeUrl: string - adId: string - universalAdId: string - creativeId: string - creativeType: string - redirectUrl: string - adPlacementType: number | waterfallIndex: number - waterfallCount: number - adPodCount: number - adPodIndex: number - wrapperAdIds: array[string] - time: number - duration: number - playbackMode: number |
| AD_PLAY | 'adPlay' | Fired when ad playback starts and is resumed after a pause. |  adTagUrl: string |
| AD_TIME | 'adTime' | Fired as the ad playback progresses. Frequency depends on the player. | adTagUrl: string - time: number - duration: number |
| AD_PAUSE | 'adPause' | Fired when the ad is paused. | adTagUrl: string |
| AD_CLICK | 'adClick' | Fired when the ad is clicked or tapped. |  adTagUrl: string - offset: string - loadTime: number - vastAdId: string - adDescription: string - adServer: string - adTitle: string - advertiserId: string - advertiserName: string - dealId: string - linear: boolean - vastVersion: string - creativeUrl: string - adId: string - universalAdId: string - creativeId: string - creativeType: string - redirectUrl: string - adPlacementType: number | waterfallIndex: number - waterfallCount: number - adPodCount: number - adPodIndex: number - wrapperAdIds: array[string] - time: number - duration: number - playbackMode: number |
| AD_SKIPPED | 'adSkipped' | Fired when the ad is skipped. | time: number - duration: number |
| AD_ERROR | 'adError' | Fired when an error occurred while attempting to load or render the ad. |  playerErrorCode: number - vastErrorCode: number - errorMessage: string - sourceError: object - adTagUrl: string - offset: string - loadTime: number - vastAdId: string - adDescription: string - adServer: string - adTitle: string - advertiserId: string - advertiserName: string - dealId: string - linear: boolean - vastVersion: string - creativeUrl: string - adId: string - universalAdId: string - creativeId: string - creativeType: string - redirectUrl: string - adPlacementType: number | waterfallIndex: number - waterfallCount: number - adPodCount: number - adPodIndex: number - wrapperAdIds: array[string] - time: number - duration: number - playbackMode: number |
| AD_COMPLETE | 'adComplete' | Fired when the ad has reached its end. |  adTagUrl: string |
| AD_BREAK_END | 'adBreakEnd' | Fired when the sequence of ads in the break has ended. |  offset: string |
| PLAYLIST | 'playlist' | Fired when a media playlist has been loaded into the player. | playlistItemCount: number - autostart: boolean |
| PLAYBACK_REQUEST | 'playbackRequest' | Fired when an attempt to start the media playback has been made i.e. the viewer has tapped the play icon. | playReason: string |
| AUTOSTART_BLOCKED | 'autostartBlocked' | Fired when autostart has been prevented. Generally, autostart is prevented by the browser. | errorCode: number - errorMessage: string - sourceError: object |
| PLAY_ATTEMPT_FAILED | 'playAttemptFailed' | Fired when the user's attempt to begin playback is unsuccessful. | playReason: string - errorCode: number - errorMessage: string - sourceError: object |
| CONTENT_LOADED | 'contentLoaded' | Fired when the content media is loaded into the player. | contentId: string - contentUrl: string - title: string - description: string - playlistIndex: number - contentTags: array[string] | 
| PLAY | 'play' | Fired when the content playback begins or is resumed. | |
| PAUSE | 'pause' | Fired when the content playback is paused. | |
| BUFFER | 'buffer' | Fired when the player enters a buffer state. Usually caused by a delay in loading video segments to continue playback. | time: number - duration: number - playbackMode: number |
| TIME | 'time' | Fired as the content playback progresses. Frequency depends on the player. | position: number - duration: number |
| SEEK_START | 'seekStart' | Fired when the viewer begins seeking in content. | position: number - destination: number - duration: number |
| SEEK_END | 'seekEnd' | Fired when the viewer seeking in the content has ended. | position: number - duration: number |
| MUTE | 'mute' | Fired when the player is muted. | mute: boolean |
| VOLUME | 'volume' | Fired when the player's volume has changed. | volumePercentage: number |
| RENDITION_UPDATE | 'renditionUpdate' | Fired when a change occurred in the video's encoded width, encoded height, reported video bitrate, reported audio bitrate or video framerate. | videoReportedBitrate: number - audioReportedBitrate: number - encodedVideoWidth: number - encodedVideoHeight: number - videoFramerate: number |
| ERROR | 'error' | Fired when a player experiences an unrecoverable playback error while player or attempting to play content. | errorCode: number - errorMessage: string - sourceError: object |
| COMPLETE | 'complete' | Fired when a media content has reached its end. | |
| PLAYLIST_COMPLETE | 'playlistComplete' | Fired when the last piece of content in a media playlist has ended. | |
| FULLSCREEN | 'fullscreen' | Fired when the player enters or exits fullscreen mode. | fullscreen: boolean |
| PLAYER_RESIZE | 'playerResize' | Fired when the player's size is modified. | height: number - width: number |
| VIEWABLE | 'viewable' | Fired when the player's viewability is changed. Viewability is a percentage of the player's size currently in view. The granularity at which this event is triggered depends on the player. | viewable: boolean - viewabilityPercentage: number |
| CAST | 'cast' | Fired when casting to an external device begins or ends. | casting: boolean |
| AUCTION_AD_LOAD_ATTEMPT | 'auctionAdLoadAttempt' | Fired when Prebid attempts to load the winning ad from a Prebid auction into the player. | adTagUrl: string - adUnitCode: string |
| AUCTION_AD_LOAD_ABORT | 'auctionAdLoadAbort' | Fired when the attempt to load the winning ad from a Prebid auction into the player is prevented. | adUnitCode: string |
| BID_IMPRESSION | 'bidImpression' | Fired when the ad from a bid resulted in an impression. | bid: object - adEvent: object |
| BID_ERROR | 'bidError' | Fired when the ad from a bid resulted in an error. | bid: object - adEvent: object |

#### Bids marked as won

When an impression or error from an ad originating from a winning bid occurs, the bid will be automatically marked as used.
Limitations: the mechanism used to determine when an error occurred for an ad originating from a winning might fail at times when the ad server is GAM because of a limitation in GAM. 

#### Bid request Enrichment

For your convenience, when an auction begins, the Video Module will update oRTB params in the auction for SSPs to consume and include in their bid requests.

##### adUnit.mediaTypes.video

The params in `adUnit.mediaTypes.video` are populated with information extracted from the player. Any params already filled by the publisher will remain unchanged.
Some params such as `battr`, `minduration`, `maxduration` are specific to a publisher's preferences and should therefore be populated by the Publisher.

##### bidderRequest.ortb2.site.content

The params in `bidderRequest.ortb2.site.content` are populated with information extracted from the video player. Any params already filled by the publisher will remain unchanged.
This feature can be disabled by setting `video.contentEnrichmentEnabled` to `false` in the Prebid config.
In the case where multiple video players are registered with the Video Module, the `bidderRequest.ortb2.site.content` params will be updated by the video player registered to the ad unit in the auction. If one of the Video Players is responsible for rendering the main content on the page, it may be appropriate for the `site.content` params to be populated with metadata from that player. In that case, you should populate `video.mainContentDivId` in the Prebid config with the video player's div id. |

## SSPs 

Before bids are requested, the Video Module automatically enriches the auction. SSPs can benefit from this by reading from the proper params.
Given that the video player is the source of truth for most video params, SSPs and DSPs can rely on the accuracy of the information.

### mediaTypes.video

Before bids are requested, all ad units configured to be handled by the Video Module will be enriched. The adUnit's `mediaTypes.video` param will be populated automatically.
SSPs wishing to benefit from this enrichment should read from `mediaTypes.video`.

### bidderRequest.ortb2.site.content

Similarly, before bids are requested, the `bidderRequest.ortb2.site.content` param is populated in the `bidderRequest` argument of the `buildRequests` function with content metadata from the video player and its media.
SSPs wishing to benefit from this enrichment should read from `bidderRequest.ortb2.site.content`.

<a name="Video-Module-Contributing" />

## Contributing

The Prebid Video Module acts as a simple Video interface which Prebid can connect to. In order for the Video Module to plug into a Video Player, a video submodule must be implemented. The Video Submodule acts as a bridge between the Video Module and the Video Player.
To add a submodule please follow the instructions in [How to add a video submodule]({{site.github.url}}/dev-docs/add-video-submodule.html).
//TODO https://docs.prebid.org/dev-docs/add-rtd-submodule.html


// TODO: list event and param details
// TODO: Linking to other docs - ~~setCOnfig~~ ~~addAdUnit~~ events

