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

To register a video player with Prebid, you must use `setConfig` to set a `video` config compliant with the following structure:

{: .table .table-bordered .table-striped }
| Field | Required? | Type | Description |
|---|---|---|---|
| video.providers[] | yes | array of objects | List of Provider configurations. You must defined a provider configuration for each player instance that you would like integrate with. |
| video.providers[].vendorCode | yes | number | The identifier of the Video Provider vendor (i.e. 1 for JW Player, 2 for videojs, etc). Allows Prebid to know which submodule to instantiate. |
| video.providers[].divId | yes | string | The HTML element id of the player or its placeholder div. All analytics events for that player will reference this ID. Additionally, used to indicate where the Video Player instance will be placed when instantiated. |
| video.providers[].playerConfig.autoStart | no | boolean | Defaults to false |
| video.providers[].playerConfig.mute | no | boolean | Defaults to false |
| video.providers[].playerConfig.licenseKey | no | boolean | The license key or account key. Required by most commercial video players. |
| video.providers[].playerConfig.setupAds | no | boolean | Defaults to true. Setting to false will prevent Prebid from setting up the ads components for the player. Disable when you wish to setup the player's ad components. |
| video.providers[].playerConfig.params.vendorConfig | no | object | The configuration block specific to a video player. Use this when setting configuration options not available in `video.providers[].playerConfig`. Its properties supersede the equivalents in `video.providers[].playerConfig`. |
| video.providers[].playerConfig.params.adPluginConfig | no | object | The configuration block specific to the video player's ad plugin. Use this to customize the ad experience. The configuration spec is defined by your video player's ad plugin. |
| video.providers[].adServer | no | object | Configuration for ad server integration. Applies to all Ad Units linked to a video provider. Superseded by `video.adServer` configurations defined at the Ad Unit level. |
| video.providers[].adServer.vendorCode | yes | string | The identifier of the AdServer vendor (i.e. gam, etc) |
| video.providers[].adServer.baseAdTagUrl | yes | string | Your AdServer Ad Tag. The targeting params of the winning bid will be appended. Required when `video.providers[].adServer.params` is absent. |
| video.providers[].adServer.params | yes | object | Querystring parameters that will be used to construct the video ad tag URL. Required when `video.providers[].adServer.baseAdTagUrl` is absent. |
| video.contentEnrichmentEnabled | no | boolean | Defaults to true. Set to false to prevent the Video Module from enriching the `site.content` params in the bidder request. | 
| video.mainContentDivId | no | string | Div Id of the video player intended to populate the `bidderRequest.site.content` params. Used when multiple video players are registered with the Video Module to indicate which player is rendering the main content. The `bidderRequest.site.content` params will be populated by said video player for all auctions where a Video Player is registered with an Ad Unit in the auction. |

**Note:** You can integrate with different Player vendors. For this to work, you must ensure that the right Video Submodules are included in your build, and that the providers have the right `vendorCode`s and `divId`s.

#### Configure Ad Units

In order for Prebid to know which Ad Unit relates to which Video Player, you must include a `video` configuration in your Ad Unit. This allows Prebid to render the ad in the proper Video Player and obtain the Ortb data from the Video Player that will render the ad.
**Note:** your Ad Unit must have `mediaTypes.video` defined.

See the table below for the list of properties in the `video` object of the ad unit.

{: .table .table-bordered .table-striped }
| Field     | Scope                                                        | Type   | Description                                                                                                        |
|----------+--------------------------------------------------------------+--------+--------------------------------------------------------------------------------------------------------------------|
| `divId` | required | string | Unique identifier of the player provider, used to specify which player should be used to render the ad. Equivalent to the HTML Div Id of the player.                  |
| `adServer` | optional | object | Configuration for ad server integration. Supersedes `video.providers[].adServer` configurations defined in the Prebid Config. |
| `adServer.vendorCode` | required if `adServer` is defined | string | The identifier of the AdServer vendor (i.e. gam, etc). |
| `adServer.baseAdTagUrl` | required if `adServer.params` is not defined | string | Your AdServer Ad Tag. The targeting params of the winning bid will be appended. |
| `adServer.params` | required if `adServer.baseAdTagUrl` is not defined | object | Querystring parameters that will be used to construct the video ad tag URL. |

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

// TODO : add jwplayer and videojs docs to https://docs.prebid.org/dev-docs/modules/ -
 - ask prebid community to add videojs docs

// TODO: add https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html#setConfig-realTimeData

// TODO: Examples

// TODO: Linking to other docs - setCOnfig addAdUnit events
// TODO: list event and param details

