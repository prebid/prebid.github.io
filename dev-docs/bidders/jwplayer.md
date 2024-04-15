---
layout: bidder
title: JW Player
description: Prebid JW Player Bidder Adapter
biddercode: jwplayer
gvl_id: 1046
pbjs: true
pbs: false
media_types: video
userIds: all (with commercial activation)
tcfeu_supported: true
dsa_supported: true
prebid_member: true
schain_supported: true
coppa_supported: true
usp_supported: true
gpp_supported: true
floors_supported: true
fpd_supported: true
deals_supported: true
prebid_member: yes
sidebarType: 1
---

<a id="table-of-contents"></a>

## Table of contents

* [Table of contents](#table-of-contents)
* [Introduction](#introduction)
* [Modules to include in your build process](#modules-to-include-in-your-build-process)
* [Bid Params](#bid-request-parameters)
* [Set up First Party Data (FPD)](#set-up-first-party-data-fpd)
* [Examples](#examples)

<a id="introduction"></a>

## Introduction

The JW Player Bid Adapter allows publishers to tap into JW Player's Video Advertising Demand.
Publishers are not required to use JW Player as a video player.
Instream and outstream video ads are supported.

<a id="modules-to-include-in-your-build-process"></a>

## Modules to include in your build process

You will need to include the `jwplayerBidAdapter` in your build. If you are building the JS binary on your own from source code, follow the instructions in [Prebid.js project README](https://github.com/prebid/Prebid.js/blob/master/README.md#build-optimization). 
We recommend including the [jwplayerVideoProvider](dev-docs/modules/jwplayerVideoProvider.md) to connect Prebid.js to your JW Player instance via the [Prebid Video Module](prebid-video/video-module.md). 
If you are not using the JW Player Video Provider, we suggest including the JW Player Real Time Data Provider [jwplayerRtdProvider](dev-docs/modules/jwplayerRtdProvider.md) in order to include JW Player's contextual ad targeting segments in your bid requests. 

The following is an example build command that include these modules: <br />
`gulp build --modules=jwplayerBidAdapter,jwplayerVideoProvider`<br />
or <br />
`gulp build --modules=jwplayerBidAdapter,jwplayerRtdProvider`

If you are using a JSON file to specify modules, add `jwplayerBidAdapter`, `jwplayerVideoProvider` and `jwplayerRtdProvider` to the modules array as follows:

```javascript
[
    "jwplayerBidAdapter",
    "jwplayerVideoProvider"
]
```

or

```javascript
[
    "jwplayerBidAdapter",
    "jwplayerRtdProvider"
]
```

<a id="bid-request-parameters"></a>

## Bid Params

We support all oRTB params and encourage populating as many as possible.

### Required Bidder params

You must include the following parameters at the bidder level.

{: .table .table-bordered .table-striped }

| Name | Scope | Type | Description                                          |
|---|---|---|------------------------------------------------------|
| `siteId` | Required | String | Site-specific id that is provided by JW Player.      |
| `publisherId` | Required | String | Publisher-specific id that is provided by JW Player. |
| `placementId` | Required | String | Placement-specific id that is provided by JW Player. |

### Bid Request fields

{: .table .table-bordered .table-striped }

| Name               | Scope       | Type    | Description                                                                                                                                                                                                                                                                                                             |
|--------------------|-------------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `site.content.url` | Required    | string  | Populated automatically when the `jwplayerVideoProvider` or `jwplayerRtdProvider` are included. This is the URL of the media being rendered in the video player, for buy-side contextualization or review. This needs to be accessible (w/o DRM, Geo-blocking etc.) and without parameters (Such as size, quality etc.) |
| `site.page`        | Required    | string  | URL of the page where the impression will be shown.                                                                                                                                                                                                                                                                     |
| `video.w`          | Recommended    | Integer | Populated automatically when using the `jwplayerVideoProvider`. The width of the video player in pixels that will be passed to demand partners. You must define the size of the video player using the `video.w` and `video.h` parameters.                                                                              |
| `video.h`          | Recommended    | Integer | Populated automatically when using the `jwplayerVideoProvider`. The height of the video player in pixels that will be passed to demand partners. You must define the size of the video player using the `video.w` and `video.h` parameters.                                                                             |
| `video.plcmt`      | Recommended | Integer | The video's placement type, where: <br /> - `1` = Instream<br /> - `2` = Accompanying Content <br /> - `3` = Interstitial <br /> - `4` = No Content/Standalone                                                                                                                                                          |

<a id="set-up-first-party-data-fpd"></a>

## Set up First Party Data (FPD)

To supply data that is accessible to all bidders, use the `[pbjs.setConfig()]` object as illustrated below. Use the `[setBidderConfig()]` function to supply bidder-specific data. For more information about the standard or more detailed examples, see Prebid's [First Party Data Feature](/features/firstPartyData.html) documentation.
We suggest using this mechanism to set the `site.content.url` when not using the `jwplayerVideoProvider` or `jwplayerRtdProvider`.

```javascript
pbjs.setConfig({
    ortb2: {
        site: {
                    ...
               },
        user: {
                    ...
               }
            }
});
```

<a id="examples"></a>

## Examples

### With the JW Player Video Provider

```javascript
const adUnit = {
    code: 'test-ad-unit',
    mediaTypes: {
      video: {} // automatically populated by the Video Provider
    },
    video: {
      divId: 'player', // required to indicate which player is being used to render this ad unit.
    },
    
    bids: [{
      bidder: 'jwplayer',
      params: {
        publisherId: 'test-publisher-id',
        siteId: 'test-site-id',
        placementId: 'test-placement-id'
      }
    }]
};

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

pbjs.que.push(function () {
    pbjs.setConfig({
      video: {
          providers: [{
              divId: 'player', // must match the divId in the adUnit
              vendorCode: 1, // JW Player vendorCode
              playerConfig: {
                  licenseKey: 'LICENSE_KEY_HERE',
                  params: {
                      vendorConfig: {
                          mediaid: 'XYXYXYXY',
                          file: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
                          title: 'Subaru Outback On Street And Dirt',
                          description: 'Smoking Tire takes the all-new Subaru Outback to the highest point we can find in hopes our customer-appreciation Balloon Launch will get some free T-shirts into the hands of our viewers.',
                          advertising: {client: 'googima'}
                      }
                  }
              }
          }],
      }
    });
});

pbjs.addAdUnits([adUnit]);
```

### With the JW Player RTD Provider

```javascript
const adUnit = {
    code: 'test-ad-unit',
    mediaTypes: {
      video: {
        pos: 0,
        w: 640,
        h: 480,
        mimes :  ['application/vnd.apple.mpegurl', 'video/mp4'],
        minduration : 0,
        maxduration: 60,
        protocols : [2,3,7,5,6,8],
        startdelay: 0,
        placement: 1,
        plcmt: 1,
        skip: 1,
        skipafter: 10,
        playbackmethod: [3],
        api: [2],
        linearity: 1
      }
    },
    bids: [{
      bidder: 'jwplayer',
      params: {
        publisherId: 'test-publisher-id',
        siteId: 'test-site-id',
        placementId: 'test-placement-id'
      }
    }]
};

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

pbjs.que.push(function() {
  pbjs.setConfig({
    realTimeData: {
      dataProviders: [{
        name: "jwplayer",
        waitForIt: true,
        params: {
          mediaIDs: ['test-media-id'],
          overrideContentUrl: 'always',
          overrideContentId: 'always',
          overrideContentTitle: 'always',
          overrideContentDescription: 'always'
        }
      }]
    },
    ortb2: {
      site: {
        content: {
          url: 'test.mp4' // Necessary only when bidding before the JW Player instance is instantiated. 
        }
      }
    }
  });
});
```
