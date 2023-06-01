---
layout: api_prebidjs
title: pbjs.addAdUnits(Array|Object)
description: addAdUnits API
sidebarType: 1
---


Takes one ad unit object or an array of ad unit objects and adds them to the Prebid auction.  For usage examples, see [Examples](#addAdUnits-Examples) below and the [Getting Started]({{site.baseurl}}/dev-docs/getting-started.html) page.

+ [Ad Unit Properties](#addAdUnits-AdUnitProperties)
+ [Examples](#addAdUnits-Examples)

<a name="addAdUnits-AdUnitProperties"></a>

#### Ad Unit Properties

See the table below for the list of properties on the ad unit.  For example ad units, see the [Examples](#addAdUnits-Examples) below.

{: .table .table-bordered .table-striped }
| Name         | Scope    | Type                                  | Description                                                                                                                                                                       |
|--------------+----------+---------------------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `code`       | Required | String                                | Unique identifier that you create and assign to this ad unit.  Used to set query string targeting on the ad. If using GPT, we recommend setting this to slot element ID.          |
| `sizes`      | Required | Array[Number] or Array[Array[Number]] | All the sizes that this ad unit can accept.  Examples: `[400, 600]`, `[[300, 250], [300, 600]]`.  For 1.0 and later, prefer [`mediaTypes.banner.sizes`](#adUnit-banner).          |
| `bids`       | Optional | Array[Object]                         | Each bid represents a request to a bidder.  For a list of properties, see [Bids](#addAdUnits-Bids) below.                                                                         |
| `mediaTypes` | Optional | Object                                | Defines one or multiple media types the ad unit supports.  For a list of properties, see [Media Types](#addAdUnits-MediaTypes) below.                                                                     |
| `labelAny` | optional  | array[string] | An array of string labels, used for showing responsive ads.  With the `labelAny` operator, just one label has to match for the condition to be true. Works with the `sizeConfig` object passed in to [pbjs.setConfig]({{site.baseurl}}/dev-docs/publisher-api-reference/setConfig.html).  |
| `labelAll` | optional  | array[string] | An array of string labels, used for showing responsive and conditional ads. With the `labelAll` conditional, every element of the target array must match an element of the label array in order for the condition to be true. Works with the `sizeConfig` object passed in to [pbjs.setConfig]({{site.baseurl}}/dev-docs/publisher-api-reference/setConfig.html).  |
| `video`      | Optional | Object                                | Used to link an Ad Unit to the [Video Module]({{site.github.url}}/prebid-video/video-module.html). For allowed params see the [adUnit.video reference](#adUnit-video). |

<a name="addAdUnits-Bids"></a>

##### Bids

See the table below for the list of properties in the `bids` array of the ad unit.  For example ad units, see the [Examples](#addAdUnits-Examples) below.

Note that `bids` is optional only for [Prebid Server stored impressions](/dev-docs/modules/prebidServer.html#stored-imp), and required in all other cases. 

{: .table .table-bordered .table-striped }

| Name     | Scope    | Type          | Description                                                                                                                                                                       |
|----------+----------+---------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `bidder` | Required | String        | Bidder code. Find the [complete reference for all supported bidders here](/dev-docs/bidders.html).                                                                                          |
| `params` | Required | Object        | Bidder's preferred way of identifying a bid request. Find the [complete reference for all supported bidders here](/dev-docs/bidders.html).                                                  |
| `labelAny` | optional  | array[string] | An array of string labels, used for showing responsive ads.  With the `labelAny` operator, just one label has to match for the condition to be true. Works with the `sizeConfig` object passed in to [pbjs.setConfig]({{site.baseurl}}/dev-docs/publisher-api-reference/setConfig.html).  |
| `labelAll` | optional  | array[string] | An array of string labels, used for showing responsive and conditional ads. With the `labelAll` conditional, every element of the target array must match an element of the label array in order for the condition to be true. Works with the `sizeConfig` object passed in to [pbjs.setConfig]({{site.baseurl}}/dev-docs/publisher-api-reference/setConfig.html).  |

<a name="addAdUnits-MediaTypes"></a>

##### Media Types

See the table below for the list of properties in the `mediaTypes` object of the ad unit.  For example ad units showing the different media types, see the [Examples](#addAdUnits-Examples) below.

{: .table .table-bordered .table-striped }
| Name     | Scope                                                        | Type   | Description                                                                                                        |
|----------+--------------------------------------------------------------+--------+--------------------------------------------------------------------------------------------------------------------|
| `banner` | optional. If no other properties are specified, this is the default | Object | Defines properties of a banner ad.  For examples, see [the banner example below](#adUnit-banner).                  |
| `native` | optional | Object | Defines properties of a native ad.  For an example native ad unit, see [the native example below](#adUnit-native). |
| `video`  | optional | Object | Defines properties of a video ad.  For examples, see [the video examples below](#adUnit-video).                    |

#### Video

For the list of properties please visit the [adUnit.video reference]({{site.baseurl}}/dev-docs/adunit-reference.html#adUnit.video).

<a name="addAdUnits-Examples">

#### Examples

- [Ad Unit Properties](#ad-unit-properties)
  - [Bids](#bids)
  - [Media Types](#media-types)
- [Video](#video)
- [Examples](#examples)
  - [Native](#native)
  - [Video](#video-1)
  - [Banner](#banner)
  - [Multi-format](#multi-format)


<a name="adUnit-native"></a>

##### Native

For an example of a native ad unit, see below.  For more detailed instructions, see [Show Native Ads]({{site.baseurl}}/dev-docs/show-native-ads.html).

```javascript
pbjs.addAdUnits({
    code: slot.code,
    mediaTypes: {
        native: {
            image: {
                required: true,
                sizes: [150, 50]
            },
            title: {
                required: true,
                len: 80
            },
            sponsoredBy: {
                required: true
            },
            clickUrl: {
                required: true
            },
            body: {
                required: true
            },
            icon: {
                required: true,
                sizes: [50, 50]
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

{% include dev-docs/native-image-asset-sizes.md %}

<a name="adUnit-video"></a>

##### Video

If using the Video Module, see below. For more information on the Video Module, see the [Video Module docs]({{site.github.url}}/prebid-video/video-module.html). 

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

For an example of an instream video ad unit where the integration is handled on your own, see below.  For more detailed instructions, see [Show Video Ads]({{site.baseurl}}/dev-docs/show-video-with-a-dfp-video-tag.html).

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

For an example of an outstream video ad unit, see below.  For more detailed instructions, see [Show Outstream Video Ads]({{site.baseurl}}/dev-docs/show-outstream-video-ads.html).

```javascript
pbjs.addAdUnit({
    code: slot.code,
    mediaTypes: {
        video: {
            context: 'outstream',
            playerSize: [640, 480],
            mimes: ['video/mp4'],
            protocols: [1, 2, 3, 4, 5, 6, 7, 8],
            playbackmethod: [2],
            skip: 1
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
})
```

<a name="adUnit-banner"></a>

##### Banner

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
})
```

<a name="adUnit-multi-format"></a>

##### Multi-format

Multiple media formats may be declared on a single ad unit, allowing any bidder that supports at least one of those media formats to participate in the auction. Any bidder that isn't compatible with the specified `mediaTypes` will be dropped from the ad unit. If `mediaTypes` is not specified on an ad unit, `banner` is the assumed format and any banner bidder is eligible for inclusion.

For examples of a multi-format ad units and behavior, see below.

```javascript
// each bidder supports at least one of the formats, so all will participate
pbjs.addAdUnits({
  code: 'div-banner-outstream-native',
  mediaTypes: {
    banner: { sizes: [[300, 250], [300, 600]] },
    native: {
        title: {required: true},
        image: {required: true},
        body: {required: false},
    },
    video: {
        context: 'outstream',
        playerSize: [640, 480],
        mimes: ['video/mp4'],
        protocols: [1, 2, 3, 4, 5, 6, 7, 8],
        playbackmethod: [2],
        skip: 1
    },
  },
  bids: [
    {
      bidder: 'bannerBidder',
      params: {placementId: '481'}
    },
    {
      bidder: 'nativeBidder',
      params: {titleAsset: '516'}
    },
    {
      bidder: 'videoBidder',
      params: {vidId: '234'}
    },
  ]
});
```

```javascript
// only nativeBidder and videoBidder will participate
pbjs.addAdUnits({
  code: 'div-native-outstream',
  mediaTypes: {
    native: { type: 'image' },
    video: { context: 'outstream', playerSize: [400, 600] },
  },
  bids: [
    {
      bidder: 'bannerBidder',
      params: {placementId: '481'}
    },
    {
      bidder: 'nativeBidder',
      params: {titleAsset: '516'}
    },
    {
      bidder: 'videoBidder',
      params: {vidId: '234'}
    },
  ]
});
```
