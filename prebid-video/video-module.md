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

{: .table .table-bordered .table-striped }
| Event Constant | Event String | Description |
|----------------|--------------|-------------|
| SETUP_COMPLETE | 'setupComplete' | Fried when the player is instantiated and the integration is complete. At this point the API is ready to be used. |
| SETUP_FAILED | 'setupFailed' | Fired when the integration was unsuccessful. |
| DESTROYED | 'destroyed' | Fired when the player instance has been destroyed. |
| AD_REQUEST | 'adRequest' | Fried when the player is asked to load an ad. |
| AD_BREAK_START | 'adBreakStart' | Fired when an ad break begins. An ad break consists of an ad, or a sequence of subsequent ads. |
| AD_LOADED | 'adLoaded' | Fired when the player has finished loading the ad's VAST response. |
| AD_STARTED | 'adStarted' | Fired when the ad playback has started. |
| AD_IMPRESSION | 'adImpression' | Fired when an ad has played for 2 consecutive seconds while the player is at least 50% viewable, as defined by the IAB standards for video ad impressions. |
| AD_PLAY | 'adPlay' | Fired when ad playback starts and is resumed after a pause. |
| AD_TIME | 'adTime' | Fired as the ad playback progresses. Frequency depends on the player. |
| AD_PAUSE | 'adPause' | Fired when the ad is paused. |
| AD_CLICK | 'adClick' | Fired when the ad is clicked or tapped. |
| AD_SKIPPED | 'adSkipped' | Fired when the ad is skipped. |
| AD_ERROR | 'adError' | Fired when an error occurred while attempting to load or render the ad. |
| AD_COMPLETE | 'adComplete' | Fired when the ad has reached its end. |
| AD_BREAK_END | 'adBreakEnd' | Fired when the sequence of ads in the break has ended. |
| PLAYLIST | 'playlist' | Fired when a media playlist has been loaded into the player. |
| PLAYBACK_REQUEST | 'playbackRequest' | Fired when an attempt to start the media playback has been made i.e. the viewer has tapped the play icon. |
| AUTOSTART_BLOCKED | 'autostartBlocked' | Fired when autostart has been prevented. Generally, autostart is prevented by the browser. |
| PLAY_ATTEMPT_FAILED | 'playAttemptFailed' | Fired when the user's attempt to begin playback is unsuccessful. |
| CONTENT_LOADED | 'contentLoaded' | Fired when the content media is loaded into the player. |
| PLAY | 'play' | Fired when the content playback begins or is resumed. |
| PAUSE | 'pause' | Fired when the content playback is paused. |
| BUFFER | 'buffer' | Fired when the player enters a buffer state. Usually caused by a delay in loading video segments to continue playback. |
| TIME | 'time' | Fired as the content playback progresses. Frequency depends on the player. |
| SEEK_START | 'seekStart' | Fired when the viewer begins seeking in content. |
| SEEK_END | 'seekEnd' | Fired when the viewer seeking in the content has ended. |
| MUTE | 'mute' | Fired when the player is muted. |
| VOLUME | 'volume' | Fired when the player's volume has changed. |
| RENDITION_UPDATE | 'renditionUpdate' | Fired when a change occurred in the video's encoded width, encoded height, reported video bitrate, reported audio bitrate or video framerate. |
| ERROR | 'error' | Fired when a player experiences an unrecoverable playback error while player or attempting to play content. |
| COMPLETE | 'complete' | Fired when a media content has reached its end. |
| PLAYLIST_COMPLETE | 'playlistComplete' | Fired when the last piece of content in a media playlist has ended. |
| FULLSCREEN | 'fullscreen' | Fired when the player enters or exits fullscreen mode. |
| PLAYER_RESIZE | 'playerResize' | Fired when the player's size is modified. |
| VIEWABLE | 'viewable' | Fired when the player's viewability is changed. Viewability is a percentage of the player's size currently in view. The granularity at which this event is triggered depends on the player. |
| CAST | 'cast' | Fired when casting to an external device begins or ends. |
| AUCTION_AD_LOAD_ATTEMPT | 'auctionAdLoadAttempt' | Fired when Prebid attempts to load the winning ad from a Prebid auction into the player. |
| AUCTION_AD_LOAD_ABORT | 'auctionAdLoadAbort' | Fired when the attempt to load the winning ad from a Prebid auction into the player is prevented. |
| BID_IMPRESSION | 'bidImpression' | Fired when the ad from a bid resulted in an impression. |
| BID_ERROR | 'bidError' | Fired when the ad from a bid resulted in an error. |

##### Event params

All Video Module events include a `divId` and `type` param in the payload by default. 
The `divId` is the div id string of the player emitting the event; it can be used as an identifier. The `type` is the string name of the event.
The remaining Payload params are listed in the following:

###### SETUP_COMPLETE

{: .table .table-bordered .table-striped }
| argument name | type | description |
| playerVersion | string | The version of the player on the page |
| viewable | boolean | Is the player currently viewable? |
| viewabilityPercentage | number | The percentage of the video that is currently viewable on the user's screen. |
| mute | boolean | Whether or not the player is currently muted. |
| volumePercentage | number | What is the volume of the player set to as a percentage |

###### SETUP_FAILED

{: .table .table-bordered .table-striped }
| argument name | type | description |
| playerVersion | string | The version of the player on the page |
| errorCode | number | The identifier of error preventing the media from rendering |
| errorMessage | string | Developer friendly description of the reason the error occurred. |
| sourceError | object | The underlying root Error which prevented the playback. |

###### DESTROYED
No additional params.

###### AD_REQUEST

{: .table .table-bordered .table-striped }
| argument name | type | description |
| adTagUrl | string | The URL for the ad tag associated with the given ad event |

###### AD_BREAK_START

{: .table .table-bordered .table-striped }
| argument name | type | description |
| offset | string | Scheduled position in the video for the ad to play. For mid-rolls, will be the position in seconds as string. Other options: 'pre' (pre-roll), 'post' (post-roll), 'api' (ad was not scheduled) |

###### AD_LOADED

{: .table .table-bordered .table-striped }
| argument name | type | description |
| adTagUrl | string | The URL for the ad tag associated with the given ad event |
| offset | string | Scheduled position in the video for the ad to play. For mid-rolls, will be the position in seconds as string. Other options: 'pre' (pre-roll), 'post' (post-roll), 'api' (ad was not scheduled) |
| loadTime | number | Time the ad took to load in milliseconds |
| vastAdId | string | The ID given to the ad within the ad tag's XML. Nullable when absent from the VAST xml. |
| adDescription | string | Description of the ad pulled from the ad tag's XML. Nullable when absent from the VAST xml. |
| adServer | string | Ad server used (e.g. dart or mediamind) from the vast tag. Nullable when absent from the VAST xml. |
| adTitle | string | Title of the ad pulled from the ad tag's XML. Nullable when absent from the VAST xml. |
| advertiserId | string | Optional identifier for the advertiser, provided by the ad server. Nullable when absent from the VAST xml. |
| advertiserName | string | Name of the advertiser as defined by the ad serving party, from the vast XML. Nullable when absent from the VAST xml. |
| dealId | string | The ID of the Ads deal. Generally relates to Direct Sold Ad Campaigns. Nullable when absent from the VAST xml. |
| linear | boolean | Is the ad linear or not? |
| vastVersion | string | Version of VAST being reported from the tag |
| creativeUrl | string | The URL representing the VPAID or MP4 ad that is run |
| adId | string | Unique Ad ID - refers to the 'attribute' of the <Ad> node within the VAST. Nullable when absent from the VAST xml. |
| universalAdId | string | Unique identifier for an ad in VAST4. Nullable when absent from the VAST xml. |
| creativeId | string | Ad server's unique ID for the creative pulled from the ad tag's XML. Should be used to specify the ad server’s unique identifier as opposed to  the Universal Ad Id which is used for maintaining a creative id for the ad across multiple systems. Nullable when absent from the VAST xml. |
| creativeType | string | The MIME type of the ad creative currently being displayed |
| redirectUrl | string | the url to which the viewer is being redirected after clicking the ad. Nullable when absent from the VAST xml. |
| adPlacementType | number | The video placements per IAB guidelines. Enum list: In-Stream: 1, In-Banner: 2, In-Article: 3, In-Feed: 4, Interstitial/Slider/Floating: 5 |
| waterfallIndex | number | Index of the current item in the ad waterfall |
| waterfallCount | number |  The count of items in a given ad waterfall |
| adPodCount | number | the total number of ads in the pod |
| adPodIndex | number | The index of the currently playing ad within an ad pod |
| wrapperAdIds | array[string] | 


###### AD_STARTED

{: .table .table-bordered .table-striped }
| argument name | type | description |
| adTagUrl | string | The URL for the ad tag associated with the given ad event |
| offset | string |
| loadTime | number |
| vastAdId | string |
| adDescription | string |
| adServer | string |
| adTitle | string |
| advertiserId | string |
| advertiserName | string |
| dealId | string |
| linear | boolean |
| vastVersion | string |
| creativeUrl | string |
| adId | string |
| universalAdId | string |
| creativeId | string |
| creativeType | string |
| redirectUrl | string |
| adPlacementType | number | waterfallIndex | number |
| waterfallCount | number |
| adPodCount | number |
| adPodIndex | number |
| wrapperAdIds | array[string] |

###### AD_IMPRESSION

{: .table .table-bordered .table-striped }
| argument name | type | description |
| adTagUrl | string | The URL for the ad tag associated with the given ad event |
| offset | string |
| loadTime | number |
| vastAdId | string |
| adDescription | string |
| adServer | string |
| adTitle | string |
| advertiserId | string |
| advertiserName | string |
| dealId | string |
| linear | boolean |
| vastVersion | string |
| creativeUrl | string |
| adId | string |
| universalAdId | string |
| creativeId | string |
| creativeType | string |
| redirectUrl | string |
| adPlacementType | number | waterfallIndex | number |
| waterfallCount | number |
| adPodCount | number |
| adPodIndex | number |
| wrapperAdIds | array[string] |
| time | number | The current video time during an ad when an event occurs in seconds |
| duration | number | Total duration of an ad in seconds |
| playbackMode | number |

###### AD_PLAY

{: .table .table-bordered .table-striped }
| argument name | type | description |
| adTagUrl | string | The URL for the ad tag associated with the given ad event |

###### AD_TIME

{: .table .table-bordered .table-striped }
| argument name | type | description |
| adTagUrl | string | The URL for the ad tag associated with the given ad event |
| time | number |
| duration | number |

###### AD_PAUSE

{: .table .table-bordered .table-striped }
| argument name | type | description |
| adTagUrl | string | The URL for the ad tag associated with the given ad event |

###### AD_CLICK

{: .table .table-bordered .table-striped }
| argument name | type | description |
| adTagUrl | string | The URL for the ad tag associated with the given ad event |
| offset | string |
| loadTime | number |
| vastAdId | string |
| adDescription | string |
| adServer | string |
| adTitle | string |
| advertiserId | string |
| advertiserName | string |
| dealId | string |
| linear | boolean |
| vastVersion | string |
| creativeUrl | string |
| adId | string |
| universalAdId | string |
| creativeId | string |
| creativeType | string |
| redirectUrl | string |
| adPlacementType | number | waterfallIndex | number |
| waterfallCount | number |
| adPodCount | number |
| adPodIndex | number |
| wrapperAdIds | array[string] |
| time | number |
| duration | number |
| playbackMode | number |

###### AD_SKIPPED

{: .table .table-bordered .table-striped }
| argument name | type | description |
| time | number |
| duration | number |

###### AD_ERROR

{: .table .table-bordered .table-striped }
| argument name | type | description |
| playerErrorCode | number | The ad error code from the Player’s internal spec. |
| vastErrorCode | number | The error code for the VAST response that is returned from the request, as defined in the VAST spec. |
| errorMessage | string | Developer friendly description of the reason the error occurred. |
| sourceError | object | The underlying root Error which prevented the playback. |
| adTagUrl | string | The URL for the ad tag associated with the given ad event |
| offset | string |
| loadTime | number |
| vastAdId | string |
| adDescription | string |
| adServer | string |
| adTitle | string |
| advertiserId | string |
| advertiserName | string |
| dealId | string |
| linear | boolean |
| vastVersion | string |
| creativeUrl | string |
| adId | string |
| universalAdId | string |
| creativeId | string |
| creativeType | string |
| redirectUrl | string |
| adPlacementType | number | waterfallIndex | number |
| waterfallCount | number |
| adPodCount | number |
| adPodIndex | number |
| wrapperAdIds | array[string] |
| time | number |
| duration | number |
| playbackMode | number |

###### AD_COMPLETE

{: .table .table-bordered .table-striped }
| argument name | type | description |
| adTagUrl | string | The URL for the ad tag associated with the given ad event |

###### AD_BREAK_END

{: .table .table-bordered .table-striped }
| argument name | type | description |
| offset | string |

###### PLAYLIST

{: .table .table-bordered .table-striped }
| argument name | type | description |
| playlistItemCount | number | The number of items in the current playlist |
| autostart | boolean | Whether or not the player is set to begin playing automatically. |

###### PLAYBACK_REQUEST

{: .table .table-bordered .table-striped }
| argument name | type | description |
| playReason | string | why the play originated. Options: ‘Unknown’ (Unknown reason:we cannot tell), ‘Interaction’ (A viewer interacts with the UI), ‘Auto’ (Autoplay based on the configuration of the player - autoStart), ‘autoOnViewable’ (autoStart when viewable), ‘autoRepeat’ (media automatically restarted after completion, without any user interaction), ‘Api’ (caused by a call on the player’s API), ‘Internal’ (started because of an internal mechanism i.e. playlist progressed to a recommended item) |

###### AUTOSTART_BLOCKED

{: .table .table-bordered .table-striped }
| argument name | type | description |
| errorCode | number | The identifier of error preventing the media from rendering |
| errorMessage | string | Developer friendly description of the reason the error occurred. |
| sourceError | object | The underlying root Error which prevented the playback. |

###### PLAY_ATTEMPT_FAILED

{: .table .table-bordered .table-striped }
| argument name | type | description |
| playReason | string | why the play originated. Options: ‘Unknown’ (Unknown reason:we cannot tell), ‘Interaction’ (A viewer interacts with the UI), ‘Auto’ (Autoplay based on the configuration of the player - autoStart), ‘autoOnViewable’ (autoStart when viewable), ‘autoRepeat’ (media automatically restarted after completion, without any user interaction), ‘Api’ (caused by a call on the player’s API), ‘Internal’ (started because of an internal mechanism i.e. playlist progressed to a recommended item) |
| errorCode | number | The identifier of error preventing the media from rendering |
| errorMessage | string | Developer friendly description of the reason the error occurred. |
| sourceError | object | The underlying root Error which prevented the playback. |

###### CONTENT_LOADED

{: .table .table-bordered .table-striped }
| argument name | type | description |
| contentId | string | The unique identifier of the media item being rendered by the video player. Nullable when not provided by Publisher, or unknown. |
| contentUrl | string | The URL of the media source of the playlist item |
| title | string | The title of the content; not meant to be used as a unique identifier. Nullable when not provided by Publisher, or unknown. |
| description | string | The description of the content. Nullable when not provided by Publisher, or unknown. |
| playlistIndex | number | The currently playing media item's index in the playlist. |
| contentTags | array[string] | Customer media levelt tags describing the content. Nullable when not provided by Publisher, or unknown. |

###### PLAY

No additional params.

###### PAUSE

No additional params.

###### BUFFER

{: .table .table-bordered .table-striped }
| argument name | type | description |
| time | number | Playback position of the media in seconds |
| duration | number | Current media’s length in seconds |
| playbackMode | number | The current playback mode used by a given player. Enum list: vod: 0, live: 1, dvr: 2 |

###### TIME

{: .table .table-bordered .table-striped }
| argument name | type | description |
| position | number | Playback position of the media in seconds |
| duration | number | Current media’s length in seconds |

###### SEEK_START

{: .table .table-bordered .table-striped }
| argument name | type | description |
| position | number | Playback position of the media in seconds, when the seek begins |
| destination | number | Desired playback position of a seek action, in seconds |
| duration | number | Current media’s length in seconds |

###### SEEK_END

{: .table .table-bordered .table-striped }
| argument name | type | description |
| position | number | Playback position of the media in seconds, when the seek has ended |
| duration | number | Current media’s length in seconds |

###### MUTE

{: .table .table-bordered .table-striped }
| argument name | type | description |
| mute | boolean | Whether or not the player is currently muted. |

###### VOLUME

{: .table .table-bordered .table-striped }
| argument name | type | description |
| volumePercentage | number | What is the volume of the player set to as a percentage. |

###### RENDITION_UPDATE

{: .table .table-bordered .table-striped }
| argument name | type | description |
| videoReportedBitrate | number | The bitrate of the currently playing video in kbps as reported by the Adaptive Manifest. |
| audioReportedBitrate | number | The bitrate of the currently playing audio in kbps as reported by the Adaptive Manifest. |
| encodedVideoWidth | number | The encoded width in pixels of the currently playing video rendition. |
| encodedVideoHeight | number | The encoded height in pixels of the currently playing video rendition. |
| videoFramerate | number | The current rate of playback. For a video that is playing twice as fast as the default playback, the playbackRate value should be 2.00 |

###### ERROR

{: .table .table-bordered .table-striped }
| argument name | type | description |
| errorCode | number | The identifier of error preventing the media from rendering |
| errorMessage | string | Developer friendly description of the reason the error occurred. |
| sourceError | object | The underlying root Error which prevented the playback. |

###### COMPLETE

No additional params.

###### PLAYLIST_COMPLETE

No additional params.

###### FULLSCREEN

{: .table .table-bordered .table-striped }
| argument name | type | description |
| fullscreen | boolean | Whether or not the player is currently in fullscreen |

###### PLAYER_RESIZE

{: .table .table-bordered .table-striped }
| argument name | type | description |
| height | number | The height of the player in pixels |
| width | number | The width of the player in pixels |

###### VIEWABLE

{: .table .table-bordered .table-striped }
| argument name | type | description |
| viewable | boolean | Is the player currently viewable? |
| viewabilityPercentage | number | The percentage of the video that is currently viewable on the user's screen. |

###### CAST

{: .table .table-bordered .table-striped }
| argument name | type | description |
| casting | boolean | Whether or not the current user is casting to a device |

###### AUCTION_AD_LOAD_ATTEMPT

{: .table .table-bordered .table-striped }
| argument name | type | description |
| adTagUrl | string | The URL for the ad tag associated with the given ad event |
| adUnitCode | string | 

###### AUCTION_AD_LOAD_ABORT

{: .table .table-bordered .table-striped }
| argument name | type | description |
| adUnitCode | string |

###### BID_IMPRESSION

{: .table .table-bordered .table-striped }
| argument name | type | description |
| bid | object |
| adEvent | object |

###### BID_ERROR

{: .table .table-bordered .table-striped }
| argument name | type | description |
| bid | object |
| adEvent | object |

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


// TODO: list event and param details and link

