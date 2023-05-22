---
layout: page_v2
title: Ad Unit Reference
description: Ad Unit Reference
sidebarType: 1
---

# Ad Unit Reference
{:.no_toc}

The ad unit object is where you configure what kinds of ads you will show in a given ad slot on your page, including:

+ Allowed media types (e.g., banner, native, and/or video)
+ Allowed sizes
+ AdUnit-specific first party data

It's also where you will configure bidders, e.g.:

+ Which bidders are allowed to bid for that ad slot
+ What information is passed to those bidders via their [parameters]({{site.baseurl}}/dev-docs/bidders.html)

This page describes the properties of the `adUnit` object.

* TOC
{:toc}

## AdUnit

See the table below for the list of properties on the ad unit.  For example ad units, see the [Examples](#adUnit-examples) below.

{: .table .table-bordered .table-striped }
| Name         | Scope    | Type                                  | Description                                                                                                                                                                                |
|--------------+----------+---------------------------------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `code`       | Required | String                                | An identifier you create and assign to this ad unit. Generally this is set to the ad slot name or the div element ID. Used by [setTargetingForGPTAsync()](/dev-docs/publisher-api-reference/setTargetingForGPTAsync.html) to match which auction is for which ad slot. |
| `bids`       | Optional | Array[Object]                         | Array of bid objects representing demand partners and associated parameters for a given ad unit.  See [Bids](#adUnit.bids) below.                                                          |
| `mediaTypes` | Optional | Object                                | Defines one or more media types that can serve into the ad unit.  For a list of properties, see [`adUnit.mediaTypes`](#adUnit.mediaTypes) below.                                           |
| `labelAny`   | Optional | Array[String]                         | Used for [conditional ads][conditionalAds].  Works with `sizeConfig` argument to [pbjs.setConfig][configureResponsive].                                                                    |
| `labelAll`   | Optional | Array[String]                         | Used for [conditional ads][conditionalAds]. Works with `sizeConfig` argument to [pbjs.setConfig][configureResponsive].                                                                     |
| `ortb2Imp`   | Optional | Object                         | ortb2Imp is used to signal OpenRTB Imp objects at the adUnit grain. Similar to the global ortb2 field used for [global first party data configuration](/dev-docs/publisher-api-reference/setConfig.html#setConfig-fpd), but specific to this adunit.|
| `ttlBuffer`  | Optional | Number                                | TTL buffer override for this adUnit. See [setConfig({ttlBuffer})](/dev-docs/publisher-api-reference/setConfig.html#setConfig-ttlBuffer) |
| `renderer`   | Optional | Object                         | Custom renderer, typically used for [outstream video](/dev-docs/show-outstream-video-ads.html) |
| `video`      | Optional | Object                                | Used to link an Ad Unit to the [Video Module][videoModule]. For allowed params see the [adUnit.video reference](#adUnit-video). |
| `deferBilling` | Optional | Boolean | Used by a publisher to flag adUnits as being separately billable. This allows for a publisher to trigger billing manually for winning bids. See [pbjs.triggerBilling](/dev-docs/publisher-api-reference/triggerBilling.html) and [onBidBillable](/dev-docs/bidder-adaptor.html#registering-on-bid-billable) for more info. |

<a name="adUnit.bids" />

### adUnit.bids

See the table below for the list of properties in the `bids` array of the ad unit.  For example ad units, see the [Examples](#adUnit-examples) below.

Note that `bids` is optional only for [Prebid Server stored impressions](#stored-imp), and required in all other cases. 

{: .table .table-bordered .table-striped }
| Name       | Scope    | Type          | Description                                                                                                                              |
|------------+----------+---------------+------------------------------------------------------------------------------------------------------------------------------------------|
| `bidder`   | Optional | String        | Unique code identifying the bidder. For bidder codes, see the [bidder param reference]({{site.baseurl}}/dev-docs/bidders.html).          |
| `module`   | Optional | String        | Module code - for requesting bids from modules that are not bid adapters. See [Prebid Server stored impressions](#stored-imp). | 
| `params`   | Required | Object        | Bid request parameters for a given bidder. For allowed params, see the [bidder param reference]({{site.baseurl}}/dev-docs/bidders.html). |
| `labelAny` | Optional | Array[String] | Used for [conditional ads][conditionalAds].  Works with `sizeConfig` argument to [pbjs.setConfig][configureResponsive].                  |
| `labelAll` | Optional | Array[String] | Used for [conditional ads][conditionalAds]. Works with `sizeConfig` argument to [pbjs.setConfig][configureResponsive].                   |
| `ortb2Imp` | Optional | Object        | OpenRTB first-party data specific to this bidder. This is merged with, and takes precedence over, `adUnit.ortb2Imp`.| 
| `renderer` | Optional | Object        | Custom renderer. Takes precedence over `adUnit.renderer`, but applies only to this bidder. |

<a name="adUnit.mediaTypes" />

### adUnit.mediaTypes

See the table below for the list of properties in the `mediaTypes` object of the ad unit.  For example ad units showing the different media types, see the [Examples](#adUnit-examples) below.

{: .table .table-bordered .table-striped }
| Name                                  | Scope                                                                    | Type   | Description                                                                                                      |
|---------------------------------------+--------------------------------------------------------------------------+--------+------------------------------------------------------------------------------------------------------------------|
| [`banner`](#adUnit.mediaTypes.banner) | At least one of the `banner`, `native`, or `video` objects are required. | Object | Defines properties of a banner ad.  For examples, see [`adUnit.mediaTypes.banner`](#adUnit.mediaTypes.banner).   |
| [`native`](#adUnit.mediaTypes.native) | At least one of the `banner`, `native`, or `video` objects are required. | Object | Defines properties of a native ad.  For properties, see [`adUnit.mediaTypes.native`](#adUnit.mediaTypes.native). |
| [`video`](#adUnit.mediaTypes.video)   | At least one of the `banner`, `native`, or `video` objects are required. | Object | Defines properties of a video ad.  For examples, see [`adUnit.mediaTypes.video`](#adUnit.mediaTypes.video).      |

<a name="adUnit.mediaTypes.banner" />

#### adUnit.mediaTypes.banner

{: .table .table-bordered .table-striped }
| Name    | Scope    | Type                                  | Description                                                                             |
|---------+----------+---------------------------------------+-----------------------------------------------------------------------------------------|
| `sizes` | Required | Array[Number] or Array[Array[Number]] | All sizes this ad unit can accept.  Examples: `[400, 600]`, `[[300, 250], [300, 600]]`. Prebid recommends that the sizes auctioned by Prebid should be the same auctioned by AdX and GAM OpenBidding, which means AdUnit sizes should match the GPT sizes. |
| `pos`  | Optional | Integer                                | OpenRTB page position value: 0=unknown, 1=above-the-fold, 3=below-the-fold, 4=header, 5=footer, 6=sidebar, 7=full-screen   |
| `name`  | Optional | String                                | Name for this banner ad unit.  Can be used for testing and debugging.                   |

<a name="adUnit.mediaTypes.native" />

#### adUnit.mediaTypes.native

The `native` object contains properties that correspond to the assets of the native ad.

See [Prebid Native Implementation](/prebid/native-implementation.html) for details.

<a name="adUnit.mediaTypes.video" />

#### adUnit.mediaTypes.video

{: .table .table-bordered .table-striped }
| Name             | Scope       | Type                   | Description                                                                                                                                                         |
|------------------+-------------+------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `pos`  | Optional | Integer                                | OpenRTB page position value: 0=unknown, 1=above-the-fold, 3=below-the-fold, 4=header, 5=footer, 6=sidebar, 7=full-screen   |
| `context`        | Recommended    | String                 | The video context, either `'instream'`, `'outstream'`, or `'adpod'` (for long-form videos).  Example: `context: 'outstream'`. Defaults to 'instream'. |
| `useCacheKey`        | Optional    | Boolean                 | Defaults to `false`. While context `'instream'` always will return an vastUrl in bidResponse, `'outstream'` will not. Setting this `true` will use cache url defined in global options also for outstream responses. |
| `placement`        | Recommended    | Integer                 | 1=in-stream, 2=in-banner, 3=in-article, 4=in-feed, 5=interstitial/floating. **Highly recommended** because some bidders require more than context=outstream. |
| `plcmt`        | Recommended    | Integer                 | 1=in-stream, 2=accompanying content, 3=interstitial, 4=no content/standalone. **Highly recommended** to comply with new IAB video specifications. See [AdCOM v1 spec](https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/develop/AdCOM%20v1.0%20FINAL.md#list_plcmtsubtypesvideo) |
| `playerSize`     | Optional    | Array[Integer,Integer] | The size (width, height) of the video player on the page, in pixels.  Example: `playerSize: [640, 480]`                                                                                                  |
| `api`            | Recommended | Array[Integer]         | List of supported API frameworks for this impression.  If an API is not explicitly listed, it is assumed not to be supported.  For list, see [OpenRTB 2.5 spec][openRTB].  If your video player or video ads SDK supports [Open Measurement][OpenMeasurement], **recommended** to set `7` for OMID-1|
| `mimes`          | Recommended | Array[String]          | Content MIME types supported, e.g., `"video/x-ms-wmv"`, `"video/mp4"`. **Required by OpenRTB when using [Prebid Server][pbServer]**.                                                                                   |
| `protocols`      | Optional    | Array[Integer]         | Array of supported video protocols.  For list, see [OpenRTB 2.5 spec][openRTB]. **Required by OpenRTB when using [Prebid Server][pbServer]**.                                                                            |
| `playbackmethod` | Optional    | Array[Integer]         | Allowed playback methods. If none specified, all are allowed.  For list, see [OpenRTB 2.5 spec][openRTB]. **Required by OpenRTB when using [Prebid Server][pbServer]**.                                                     |
| `minduration`      | Recommended    | Integer         | Minimum video ad duration in seconds, see [OpenRTB 2.5 spec][openRTB].           |
| `maxduration`      | Recommended    | Integer         | Maximum video ad duration in seconds, see [OpenRTB 2.5 spec][openRTB].           |
| `w`      | Recommended    | Integer         | Width of the video player in device independent pixels (DIPS)., see [OpenRTB 2.5 spec][openRTB].           |
| `h`      | Recommended    | Integer         | Height of the video player in device independent pixels (DIPS)., see [OpenRTB 2.5 spec][openRTB].           |
| `startdelay`      | Recommended    | Integer         | Indicates the start delay in seconds, see [OpenRTB 2.5 spec][openRTB].           |
| `linearity`      | Optional    | Integer         | Indicates if the impression must be linear, nonlinear, etc, see [OpenRTB 2.5 spec][openRTB].           |
| `skip`      | Optional    | Integer         | Indicates if the player will allow the video to be skipped, where 0 = no, 1 = yes., see [OpenRTB 2.5 spec][openRTB].           |
| `skipmin`      | Optional    | Integer         | Videos of total duration greater than this number of seconds can be skippable; only applicable if the ad is skippable., see [OpenRTB 2.5 spec][openRTB].           |
| `skipafter`      | Optional    | Integer         | Number of seconds a video must play before skipping is enabled; only applicable if the ad is skippable., see [OpenRTB 2.5 spec][openRTB].           |
| `minbitrate`      | Optional    | Integer         | Minimum bit rate in Kbps., see [OpenRTB 2.5 spec][openRTB].           |
| `maxbitrate`      | Optional    | Integer         | Maximum bit rate in Kbps., see [OpenRTB 2.5 spec][openRTB].           |
| `delivery`      | Optional    | Array[Integer]         | Supported delivery methods (e.g., streaming, progressive), see [OpenRTB 2.5 spec][openRTB].           |
| `pos`      | Optional    | Integer         | Ad position on screen, see [OpenRTB 2.5 spec][openRTB].           |
| `playbackend`      | Optional    | Integer         | The event that causes playback to end, see [OpenRTB 2.5 spec][openRTB].           |

If `'video.context'` is set to `'adpod'` then the following parameters are also available.  

{: .table .table-bordered .table-striped }
| Name             | Scope       | Type                   | Description                                                                                                                                                         |
|------------------+-------------+------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `adPodDurationSec`        | Required    | Number                 | The length of the adpod in seconds. Example: `adPodDurationSec = 120` |
| `durationRangeSec`        | Required    | Array[Number]                 | An array of  numbers represents a list of the potential/accepted duration values that the creatives can be in the adpod block. Example: `durationRangeSec = [30, 60, 90]` |
| `requireExactDuration`        | Optional    | Boolean                 | Whether the returned creatives running time must match the value of `adPodDurationSec`. Example: `requireExactDuration = true` |
| `tvSeriesName`        | Optional    | String                 | The name of the television series video the adpod will appear in. Example: `tvSeriesName = 'Once Upon A Time'` |
| `tvEpisodeName`        | Optional    | String                 | The name of the episode of the television series video the adpod will appear in. Example: `tvEpisodeName = 'Pilot'` |
| `tvSeasonNumber`        | Optional    | Number                 | A number representing the season number of the television series video  the adpod will appear in. Example: `tvSeasonNumber = 1` |
| `tvEpisodeNumber`        | Optional    | Number                 | A number representing the episode number of the television series video the adpod will appear in. Example: `tvEpisodeNumber = 1` |
| `contentLengthSec`        | Optional    | Number                 | A number representing the length of the video in seconds. Example: `contentLengthSec = 1` |
| `contentMode`        | Optional    | String                 | A string indicating the type of content being displayed in the video player. There are two options, `live` and `on-demand`. Example: `contentMode = 'on-demand'` |


<a name="adUnit-examples" />

<a name="adUnit.video" />

### adUnit.video

See the table below for the list of properties in the `video` object of the ad unit. For example ad units, see the [Example](#adUnit-video-module-example) below.

**Note:** your Ad Unit must have `mediaTypes.video` defined and your prebid instance should be configured to use the [Video Module][videoModule].
When using the Video Module, the mediaTypes.video properties get filled out automatically. Any values already set by the Publisher will not be replaced by the Video Module.

{: .table .table-bordered .table-striped }
| Field     | Scope                                                        | Type   | Description                                                                                                        |
|----------+--------------------------------------------------------------+--------+--------------------------------------------------------------------------------------------------------------------|
| `divId` | required | string | Unique identifier of the player provider, used to specify which player should be used to render the ad. Equivalent to the HTML Div Id of the player.                  |
| `adServer` | optional | object | Configuration for ad server integration. Supersedes `video.adServer` configurations defined in the Prebid Config. |
| `adServer.vendorCode` | required if `adServer` is defined | string | The identifier of the AdServer vendor (i.e. gam, etc). |
| `adServer.baseAdTagUrl` | required if `adServer.params` is not defined | string | Your AdServer Ad Tag. The targeting params of the winning bid will be appended. |
| `adServer.params` | required if `adServer.baseAdTagUrl` is not defined | object | Querystring parameters that will be used to construct the video ad tag URL. |

## Examples

+ [Banner](#adUnit-banner-example)
+ [Video](#adUnit-video-example)  
  - [With the Video Module](#adUnit-video-module-example)
  - [Instream](#adUnit-video-example-instream)  
  - [Outstream](#adUnit-video-example-outstream)  
  - [Adpod (Long-Form)](#adUnit-video-example-adpod)
+ [Native](#adUnit-native-example)
+ [Multi-Format](#adUnit-multi-format-example)
+ [Twin Codes](#adUnit-twin-codes-example)
+ [First Party Data](#adUnit-fpd-example)

<a name="adUnit-banner-example">

### Banner

For an example of a banner ad unit, see below.  For more detailed instructions, see [Getting Started]({{site.baseurl}}/dev-docs/getting-started.html).

```javascript
pbjs.addAdUnits({
    code: slot.code,
    mediaTypes: {
        banner: {
            sizes: [[300, 250]]
        }
    },
    bids: [
        {
            bidder: 'appnexus',
            params: {
                placementId: 13144370
            }
        }
    ]
});
```

<a name="adUnit-video-example">

### Video

<a name="adUnit-video-module-example">

#### With the Video Module

For an example of a video ad unit linked to the Video Module, see below. For more detailed instructions see the [Video Module docs][videoModule].
```javascript
pbjs.addAdUnits({
    code: slot.code,
    mediaTypes: {
        video: {},
    },
    video: {
        divId: 'playerDiv',
        adServer: {
            vendorCode: 'gam', // constant variable is GAM_VENDOR - see vendorCodes.js in the video library
            baseAdTagUrl: 'https://pubads.g.doubleclick.net/gampad/ads?iu=/12345/'
        }
    },
    bids: [{
        bidder: 'appnexus',
        params: {
            placementId: 13232361
        }
    }]
});
```

<a name="adUnit-video-example-instream">

#### Instream

For an example of an instream video ad unit that you handle on your own, see below. For more detailed instructions, see [Show Video Ads]({{site.baseurl}}/dev-docs/show-video-with-a-dfp-video-tag.html).

```javascript
pbjs.addAdUnits({
    code: slot.code,
    mediaTypes: {
        video: {
            context: 'instream',
            playerSize: [640, 480],
            mimes: ['video/mp4'],
            protocols: [1, 2, 3, 4, 5, 6, 7, 8],
            playbackmethod: [2],
            skip: 1
        },
    },
    bids: [{
        bidder: 'appnexus',
        params: {
            placementId: 13232361
        }
    }]
});
```

<a name="adUnit-video-example-outstream">

#### Outstream

For an example of an outstream video ad unit that you handle on your own, see below.  For more detailed instructions, see [Show Outstream Video Ads]({{site.baseurl}}/dev-docs/show-outstream-video-ads.html).

```javascript
pbjs.addAdUnits({
    code: slot.code,
    mediaTypes: {
        video: {
            context: 'outstream',
            useCacheKey: false,
            playerSize: [640, 480]
        }
    },
    renderer: {
        url: 'https://cdn.adnxs.com/renderer/video/ANOutstreamVideo.js',
        render: function(bid) {
            ANOutstreamVideo.renderAd({
                targetId: bid.adUnitCode,
                adResponse: bid.adResponse,
            });
        }
    },
    ...
});
```

An example of an outstream video ad unit using useCacheKey:

```javascript
pbjs.addAdUnits({
    code: slot.code,
    mediaTypes: {
        video: {
            context: 'outstream',
            useCacheKey: true,
            playerSize: [640, 480]
        }
    },
    renderer: {
        url: 'https://example.com/myVastVideoPlayer.js',
        render: function(bid) {
            let vastUrl = bid.vastUrl;
            myVastVideoPlayer.setSrc({
                src: vastUrl,
                ...
            });
        }
    },
    ...
});
```
<a name="adUnit-video-example-adpod">

#### Adpod (Long-Form)

For an example of an adpod video ad unit that you handle on your own, see below.  For more detailed instructions, see [Show Long-Form Video Ads]({{site.baseurl}}/prebid-video/video-long-form.html).

```javascript
var longFormatAdUnit = {
    video: {
       // required params
       context: 'adpod',
       playerSize: [640, 480],
       adPodDurationSec: 300,
       durationRangeSec: [15, 30],

       // optional params
       requireExactDuration: true,
       tvSeriesName: 'TvName',
       tvEpisodeName: 'episodeName',
       tvSeasonNumber: 3,
       tvEpisodeNumber: 6,
       contentLength: 300, // time in seconds,
       contentMode: 'on-demand'
    }

    bids: [{
            bidder: 'appnexus',
            params: {
                placementId: '123456789',
            }
        }]
}
```

<a name="adUnit-native-example">

### Native

For an example of a native ad unit, see below.  For more detailed instructions, see [Show Native Ads]({{site.baseurl}}/dev-docs/show-native-ads.html).

```javascript
pbjs.addAdUnits({
    code: slot.code,
    mediaTypes: {
        native: {
            ortb: {
                ver: "1.2",
                assets: [{
                    required: 1,
                    img: {
		        type: 1,
                        hmin: 50
                    },
		},{
                    required: 1,
                    title: {
                        len: 80
                    },
		},{
                    required: 1,
                    data: {
                        type: 1,
                        len: 30
                    },
		},{
                    required: 1,
                    data: {
                        type: 2,
                        len: 100
                    },
		},{
                    required: 1,
                    img: {
                        type: 3,
                        hmin: 200,
                        wmin: 267
                    }
                }]
	    }
	}
    },
    bids: [
        {
            bidder: 'appnexus',
            params: {
                placementId: 13232354
            }
        }
    ]
});
```

<a name="adUnit-multi-format-example">

### Multi-Format

For an example of a multi-format ad unit, see below.  For more detailed instructions, see [Show Multi-Format Ads]({{site.baseurl}}/dev-docs/show-multi-format-ads.html).

{% highlight js %}

pbjs.addAdUnits([{
        code: 'div-banner-native',
        mediaTypes: {
            banner: {
                sizes: [
                    [300, 250]
                ]
            },
            native: {
		ortb: {
		    ver: "1.2",
		    assets: [{
			required: 1,
                	img: {
			    type: 1,
			    hmin: 50
			}
		    }]
		}
            },
        },
        bids: [{
            bidder: 'appnexus',
            params: {
                placementId: 13232392,
            }
        }]
    },

    {
        code: 'div-banner-outstream',
        mediaTypes: {
            banner: {
                sizes: [
                    [300, 250]
                ]
            },
            video: {
                context: 'outstream',
                playerSize: [300, 250]
            },
        },
        bids: [{
            bidder: 'appnexus',
            params: {
                placementId: 13232392,
            }
        }, ]
    },

    {
        code: 'div-banner-outstream-native',
        mediaTypes: {
            banner: {
                sizes: [
                    [300, 250]
                ]
            },
            native: {
		ortb: {
		    ver: "1.2",
		    assets: [{
			required: 1,
                	img: {
			    type: 1,
			    hmin: 50
			}
		    }]
		}
            },
            video: {
                context: 'outstream',
                playerSize: [300, 250]
            },
        },
        bids: [{
            bidder: 'appnexus',
            params: {
                placementId: 13232392,
            }
        }, ]
    }
]);

{% endhighlight %}

<a name="adUnit-twin-codes-example">

### Twin AdUnit Codes

It's ok to have multiple AdUnits with the same `code`. This can be useful in scenarios
where bidders have different capabilities for the same spot on the page. e.g.

- BidderA should receive both media types, while BidderB gets only one
- BidderA gets one size while BidderB gets another

In this example, bidderA gets both banner and outstream, while bidderB gets only banner.
{% highlight js %}
    var adUnits = [
           {
               code: 'test-div',
                mediaTypes: {
                    video: {
                        context: "outstream",
                        playerSize: [[300,250]]
                    }
                },
               bids: [
                   {
                        bidder: 'bidderA',
                        params: {
                             ...
                        }
                   }
               ]
           },
           {
               code: 'test-div',
                mediaTypes: {
                    banner: {
                        sizes: [[300,250],[300,600],[728,90]]
                    }
                },
               bids: [
                   {
                       bidder: 'bidderB',
                       params: {
                           ...
                       }
                   },{
                        bidder: 'bidderA',
                        params: {
                           ...
                        }
                   }
               ]
           }
       ];
{% endhighlight %}

In this example, bidderA receives 2 bidRequest objects while bidderB receives one. If a bidder provides more than one bid for the same AdUnit.code, Prebid.js will use the highest bid when it's
time to set targeting.

<a name="adUnit-fpd-example">

### First Party Data

Example of an adunit-specific block of first party data:

{% highlight js %}
pbjs.addAdUnits({
    code: "test-div",
    mediaTypes: {
        banner: {
            sizes: [[300,250]]
        }
    },
    ortb2Imp: {
         ext: {
	    data: {
                pbadslot: "homepage-top-rect",
                adUnitSpecificContextAttribute: "123"
	    }
         }
    },
    ...
});
{% endhighlight %}

Notes:
- Only contextual data should be added on the AdUnit; user-related data goes in the [global first party data](/dev-docs/publisher-api-reference/setConfig.html#setConfig-fpd) config.
- For additional help with analytics and reporting you can use the [Prebid Ad Slot](/features/pbAdSlot.html), a special type of first party data.

<a name="adUnit-interstitial-example">

### Interstitial Ads

Example of an adunit-specific interstitial signal:

{% highlight js %}
pbjs.addAdUnits({
    code: "test-div",
    mediaTypes: {
        banner: {
            sizes: [[300,250]]
        }
    },
    ortb2Imp: {
    	instl:1
    },
    ...
});
{% endhighlight %}

For more information on Interstitial ads, reference the [Interstitial feature page](/features/InterstitialAds.html). Additionally, to assist with billing optimization and interstitial ads, the triggerBilling and onBidBillable functionality can be utilized. See [pbjs.triggerBilling](/dev-docs/publisher-api-reference/triggerBilling.html) and [onBidBillable](/dev-docs/bidder-adaptor.html#registering-on-bid-billable) for more info.

<a id="stored-imp" />

### Prebid Server stored impressions

When using [PBS stored impressions](/dev-docs/modules/prebidServer.html#stored-imp), `bids` is not required:

```javascript
pbjs.addAdUnits({
    code: "test-div",
    ortb2Imp: {
        ext: {
            prebid: {
                storedrequest: {
                    id: 'stored-request-id'
                }
            }
        }
    }
})
```

To use stored impressions together with client-side bidders - or stored impressions from other instances of Prebid Server - use `bids[].module`:

```javascript
pbjs.addAdUnits({
    code: "test-div",
    bids: [
        {
            module: "pbsBidAdapter",
            params: {
                configName: "server-1"
            },
            ortb2Imp: {
                ext: {
                    prebid: {
                        storedrequest: {
                            id: 'stored-request-server-1'
                        }
                    }
                }
            }
        },
        {
            module: "pbsBidAdapter",
            params: {
                configName: "server-2"
            },
            ortb2Imp: {
                ext: {
                    prebid: {
                        storedrequest: {
                            id: 'stored-request-server-2'
                        }
                    }
                }
            }
        },
        {
            bidder: 'client-bidder',
            // ...
        }
    ]
});
```

## Related Topics

+ [Publisher API Reference](/dev-docs/publisher-api-reference)
+ [Conditional Ad Units][conditionalAds]
+ [Show Native Ads](/prebid/native-implementation.html)
+ [Show Video Ads](/dev-docs/show-video-with-a-dfp-video-tag.html)
+ [Show Outstream Video Ads](/dev-docs/show-outstream-video-ads.html)
+ [Show Long-Form Video Ads](/prebid-video/video-long-form.html)
+ [Prebid.org Video Examples](/examples/video/)
+ [Prebid.org Native Examples](/dev-docs//examples/native-ad-example.html)



<!-- Reference Links -->

[conditionalAds]: /dev-docs/conditional-ad-units.html
[setConfig]: /dev-docs/publisher-api-reference/setConfig.html
[configureResponsive]: /dev-docs/publisher-api-reference/setConfig.html#setConfig-Configure-Responsive-Ads
[openRTB]: https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf
[pbServer]: /prebid-server/overview/prebid-server-overview.html
[OpenMeasurement]: https://iabtechlab.com/standards/open-measurement-sdk/
[videoModule]: {{site.github.url}}/prebid-video/video-module.html
