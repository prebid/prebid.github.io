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

### Include submodule in build

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

### Configure Prebid

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

**Note:** You can integrate with different Player vendors. For this to work, you must ensure that the right Video Submodules are included in your build, and that the providers have the right `vendorCode`s and `divId`s.

### Configure Ad Units

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


## SSPs 

Before bids are requested, the Video Module automatically enriches the auction. SSPs can benefit from this by reading from the proper params.

### mediaTypes.video

Before bids are requested, all ad units configured to be handled by the Video Module will be enriched. The adUnit's `mediaTypes.video` param will be populated automatically.
SSPs wishing to benefit from this enrichment should read from `mediaTypes.video`.

### ortb2.site.content

Similarly, before bids are requested, the `ortb2.site.content` param is populated in the `bidderRequest` argument of the `buildRequests` function with contextual information from the video player and its media.
SSPs wishing to benefit from this enrichment should read from `bidderRequest.ortb2.site.content`.

<a name="Video-Module-Contributing" />

## Contributing

The Prebid Video Module acts as a simple Video interface which Prebid can connect to. In order for the Video Module to plug into a Video Player, a video submodule must be implemented. The Video Submodule acts as a bridge between the Video Module and the Video Player.
To add a submodule please follow the instructions in [How to add a video submodule]({{site.github.url}}/dev-docs/add-video-submodule.html).
//TODO https://docs.prebid.org/dev-docs/add-rtd-submodule.html

// TODO : add jwplayer and videojs docs to https://docs.prebid.org/dev-docs/modules/ -
 - ask prebid community to add videojs docs

// TODO: add https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html#setConfig-realTimeData
