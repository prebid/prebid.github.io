---
layout: bidder
title: Index Exchange
description: Prebid Index Exchange Bidder Adapter
biddercode: ix
pbjs: true
pbs: true
userIds: identityLink, netId, fabrickId, zeotapIdPlus, uid2, unifiedId, id5Id, lotamePanoramaId, publinkId, hadronId, pubcid
pbs_app_supported: true
schain_supported: true
coppa_supported: true
gdpr_supported: true
floors_supported: true
usp_supported: true
media_types: banner, video
fpd_supported: true
gvl_id: 10
prebid_member: yes
---

## Overview

```
Module Name: Index Exchange Adapter
Module Type: Bidder Adapter
Maintainer: prebid.support@indexexchange.com
```

## Description

Publishers may access Index Exchange's (IX) network of demand sources through our Prebid.js and Prebid Server adapters. Both of these modules are GDPR and CCPA compliant.

### IX Prebid.js Adapter

This module connects publishers to Index Exchange's (IX) network of demand sources through Prebid.js. This module is GDPR and CCPA compliant.

It is compatible with the new Prebid.js 5.0 ad unit format where banner and video properties, including the size parameter, are stored in the `adUnits[].mediaTypes` object. IX still supports both size as an optional parameter and the Missing Sizes feature, but we recommend upgrading to the Prebid.js 5.0 format.

For more information about how the `adUnits[].mediaTypes` object is formatted in Prebid.js 5.0, refer to the following example.

```javascript
var adUnits = [{
    // ...
    mediaTypes: {
        banner: {
            sizes: [
                [300, 250],
                [300, 600]
            ]
        },
        video: {
            context: 'instream',
            playerSize: [300, 250]
        }
    },
    // ...
}];
```
### Supported Media Types (Prebid.js)

{: .table .table-bordered .table-striped }
| Type | Support |
|---|---|
| `banner` | Fully supported for all IX approved sizes |
| `video`  | Fully supported for all IX approved sizes |
| `native` | Not supported |

### Supported Media Types (Prebid Server)

{: .table .table-bordered .table-striped }
| Type   | Support |
|------|-------|
| `banner` | Fully supported |
| `video`  | Fully supported, including ad pods for OTT |
| `native` | Not supported |

# Ad Unit or Bidder Parameters

These params can be specified in the ad unit level, which will be the preferred way going forward with PBJS 5.0

Each of the IX-specific parameters provided under the object are detailed here.

The following parameters are specified in the ad unit `adUnits[].mediaTypes`. This includes each of the IX-specific parameters provided under `adUnits[].bids[].params`. 

In Prebid.js versions 5.0 and above, mediaType and sizes are not required to be defined at the ad unit level.

### Banner

{: .table .table-bordered .table-striped }
| Key | Scope | Type | Description |
|---|---|---|---|
| `siteId` | Required | String | An IX-specific identifier that is associated with this ad unit. It will be associated to the single size, if the size provided. This is similar to a placement ID or an ad unit ID that some other modules have. For example, `'3723'`, `'6482'`, `'3639'`|
| `sizes` | Optional | Number[Number[]] | The size/sizes associated with the site ID, as listed in the ad unit under `adUnits[].mediaTypes.banner.sizes`. For example, `[300, 250], [300, 600], [728, 90]`|

### Video

{: .table .table-bordered .table-striped }
| Key | Scope | Type | Description |
|---|---|---|---|
| `siteId` | Required | String | An IX-specific identifier that is associated with this ad unit. It will be associated to the single size, if the size is provided. This is similar to a placement ID or an ad unit ID that some other modules have. For example, `'3723'`, `'6482'`, `'3639'`|
| `size` | Optional | Number[] | The single size that is associated with the site ID, as listed in the ad unit under `adUnits[].sizes` or `adUnits[].mediaTypes.video.playerSize`. For example, [300, 250], [300, 600]. <BR><BR>This parameter is optional in Prebid.js versions 5.0 and above. Versions prior to 5.0 will still require a size parameter.|
| `video` | Optional | Hash | The video object will serve as the properties of the video ad. You can create any field under the video object that is mentioned in the `OpenRTB Spec v2.5`. Some fields like `mimes, protocols, minduration, maxduration` are required. Properties not defined at this level, will be pulled from the Adunit level.|
| `video.w` | Required | Integer | The video player size width in pixels that will be passed to demand partners.|
| `video.h` | Required | Integer | The video player size height in pixels that will be passed to demand partners.|
| `video.playerSize` | Optional* | Integer | The video player size that will be passed to demand partners. * In the absence of `video.w` and `video.h`, this field is required.|
| `video.mimes` | Required | String[] | Array list of content MIME types supported. Popular MIME types include, but are not limited to, `"video/x-ms- wmv"` for Windows Media and `"video/x-flv"` for Flash Video.|
| `video.minduration` | Required | Integer | Minimum video ad duration in seconds.|
| `video.maxduration` | Required | Integer | Maximum video ad duration in seconds.|
| `video.protocol` / `video.protocols` | Required | Integer / Integer[] | Either a single protocol provided as an integer, or protocols provided as a list of integers. `2` - VAST 2.0, `3` - VAST 3.0, `5` - VAST 2.0 Wrapper, `6` - VAST 3.0 Wrapper|

## Setup Guide

Follow these steps to configure and add the IX module to your Prebid.js
integration.

The examples in this guide assume the following starting configuration (you may remove banner or video, if either does not apply).

In regards to video, `context` can either be `'instream'` or `'outstream'`. Note that `outstream` requires additional configuration on the adUnit.

```javascript
var adUnits = [{
    code: 'banner-div-a',
    mediaTypes: {
        banner: {
            sizes: [
                [300, 250],
                [300, 600]
            ]
        }
    },
    bids: []
},
{
    code: 'video-div-a',
    mediaTypes: {
        video: {
            context: 'instream',
            playerSize: [1280, 720]
        }
    },
    bids: []
}];
```

### 1. Add IX to the appropriate ad units

For each size in an ad unit that IX will be bidding on, add one of the following
bid objects under `adUnits[].bids`:

```javascript
{
    bidder: 'ix',
    params: {
        siteId: '123456'
    }
}
```

Set `params.siteId` in the bid object to the values provided
by your IX representative.

**Examples**

**Banner:**
```javascript
var adUnits = [{
    code: 'banner-div-a',
    mediaTypes: {
        banner: {
            sizes: [
                [300, 250],
                [300, 600]
            ]
        }
    },
    bids: [{
        bidder: 'ix',
        params: {
            siteId: '123456'
        }
    }, {
        bidder: 'ix',
        params: {
            siteId: '123456'
        }
    }]
}];
```
**Video (Instream):**
```javascript
var adUnits = [{
    code: 'video-div-a',
    mediaTypes: {
        video: {
            // Preferred location for openrtb v2.5 compatible video obj
            context: 'instream',
            playerSize: [300, 250],
            mimes: [
                    'video/mp4',
                    'video/webm'
                ],
            minduration: 0,
            maxduration: 60,
            protocols: [6]
        }
    },
    bids: [{
        bidder: 'ix',
        params: {
            siteId: '12345'
        }
    }, {
        bidder: 'ix',
        params: {
            siteId: '12345',
            video: {
                // openrtb v2.5 compatible video obj
                // If required, use this to override mediaTypes.video.XX properties
            }
        }
    }]
}];
```
Please note that you can re-use the existing `siteId` within the same flex
position.

**Video (Outstream):**
Note that currently, outstream video rendering must be configured by the publisher. In the adUnit, a `renderer` object must be defined, which includes a `url` pointing to the video rendering script, and a `render` function for creating the video player. See http://prebid.org/dev-docs/show-outstream-video-ads.html for more information.

```javascript
var adUnits = [{
    code: 'video-div-a',
    mediaTypes: {
        video: {
            context: 'outstream',
            playerSize: [300, 250],
            mimes: [
                    'video/mp4',
                    'video/webm'
                ],
            minduration: 0,
            maxduration: 60,
            protocols: [6]
        }
    },
    renderer: {
        url: 'https://test.com/my-video-player.js',
        render: function (bid) {
            ...
        }
    },
    bids: [{
        bidder: 'ix',
        params: {
            siteId: '12345',
            video: {
                // If required, use this to override mediaTypes.video.XX properties   
            }
        }
    }]
}];
```

#### Video Caching

Note that the IX adapter expects a client-side Prebid Cache to be enabled for video bidding.

```
pbjs.setConfig({
    usePrebidCache: true,
    cache: {
        url: 'https://prebid.adnxs.com/pbc/v1/cache'
    }
});
```

#### User Sync
Add the following code to enable user sync. IX strongly recommends enabling user syncing through iFrames. This functionality improves DSP user match rates and increases the IX bid rate and bid price. Be sure to call `pbjs.setConfig()` only once.

```
pbjs.setConfig({
    userSync: {
        iframeEnabled: true,
        filterSettings: {
            iframe: {
                bidders: ['ix'],
                filter: 'include'
            }
        }
    }
});
```

#### The **detectMissingSizes** feature
By default, the IX bidding adapter bids on all banner sizes available in the ad unit when configured to at least one banner size. If you want the IX bidding adapter to only bid on the banner size it’s configured to, switch off this feature using `detectMissingSizes`.
```
pbjs.setConfig({
    ix: {
        detectMissingSizes: false
    }
});
```
OR
```
pbjs.setBidderConfig({
    bidders: ["ix"],
    config: {
        ix: {
            detectMissingSizes: false
        }
    }
});
```

### 2. Include `ixBidAdapter` in your build process

When running the build command, include `ixBidAdapter` as a module, as well as `dfpAdServerVideo` if you require video support.

```
gulp build --modules=ixBidAdapter,dfpAdServerVideo,fooBidAdapter,bazBidAdapter
```

If a JSON file is being used to specify the bidder modules, add `"ixBidAdapter"`
to the top-level array in that file.

```json
[
    "ixBidAdapter",
    "dfpAdServerVideo",
    "fooBidAdapter",
    "bazBidAdapter"
]
```

And then build.

```
gulp build --modules=bidderModules.json
```

## Setting First Party Data (FPD)

As a part of 4.30, IX will start to pick up FPD in the global FPD module, as well as continue to pick up IX bidder-specific FPD. Previous versions of IX Bid Adapter will only support the IX bidder-specific FPD.

### Global FPD

As of Prebid.js 4.30, use the more generic `ortb2` interface, which can be used for more than just First Party Data.

The First Party Data feature allows publishers to specify key/value data in one place where each compatible bid adapter can read it.

To supply global data, use the [`setConfig()`](/dev-docs/publisher-api-reference/setConfig.html) function as illustrated below:

```
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

Use the [`setBidderConfig()`](/dev-docs/publisher-api-reference/setBidderConfig.html) function to supply bidder-specific data.

For more information about the standard or more detailed examples, refer to [First Party Data Feature](/features/firstPartyData.html).

### IX bidder-specific FPD

FPD allows you to specify key-value pairs that are passed as part of the
query string to IX for use in Private Marketplace Deals which rely on query
string targeting for activation. For example, if a user is viewing a
news-related page, you can pass on that information by sending `category=news`.
Then in the IX Private Marketplace setup screens, you can create Deals which
activate only on pages that contain `category=news`. Please reach out to your
IX representative if you have any questions or need help setting this up.

To include FPD in a bid request, it must be set before `pbjs.requestBids` is
called. To set it, call `pbjs.setConfig` and provide it with a map of FPD keys
to values as such:

```javascript
pbjs.setConfig({
    ix: {
        firstPartyData: {
            '<key name>': '<key value>',
            '<key name>': '<key value>',
            // ...
        }
    }
});
```

The values can be updated at any time by calling `pbjs.setConfig` again. The
changes will be reflected in any proceeding bid requests.

{: .alert.alert-warning :}
Continue to use IX bidder-specific First Party Data for IX deals. Global First Party Data is not yet supported in IX deals. Consult your IX representative with any questions.

## Setting a Server Side Timeout

Setting a server-side timeout allows you to control the max length of time taken to connect to the server. The default value when unspecified is 50ms.

This is distinctly different from the global bidder timeout that can be set in
Prebid.js in the browser.

To add a server-side timeout, it must be set before `pbjs.requestBids` is
called. To set it, call `pbjs.setConfig` and provide it with a timeout value as
such:

```javascript
pbjs.setConfig({
    ix: {
        timeout: 50
    }
});
```

The timeout value must be a positive whole number in milliseconds.

## IX Prebid Server Adapter

Publishers who would like to retrieve IX demand via a Prebid Server instance can do so by adding IX to the list of bidders for a Prebid Server bid request, with a valid site ID. For example:

```javascript
"imp": [
  {
    "id": "test2",
    "banner": {
      "format": [
        {
          "w": 300,
          "h": 600
        }
      ]
    },
    "ext": {
      "ix": {
        "siteId": "12345"
      }
    }
  }
]
```

### Important Prebid Server Note
Any party operating their own hosted Prebid Server instances must reach out to IX (prebid.support@indexexchange.com) to receive approval and customized setup instructions. Please do not send Prebid Server requests without first contacting us -- you will not receive bid responses.

## Additional Information

### Bid Request Limit

If a single bid request to IX contains more than 20 impression requests (i.e.
more than 20 objects in `bidRequest.imp`), only the first 20 will be accepted,
the rest will be ignored.

To avoid this situation, ensure that when `pbjs.requestBid` is invoked, that the
number of bid objects (i.e. `adUnits[].bids`) with `adUnits[].bids[].bidder` set
to `'ix'` across all ad units that bids are being requested for does not exceed 20.

### Time-To-Live (TTL)

Banner bids from IX have a TTL of 300 seconds while video bids have a TTL of 1 hour, after which time they become invalid.

If an invalid bid wins, and its associated ad is rendered, it will not count
towards total impressions on IX's side.

## FAQs

#### Why do I have to input size in `adUnits[].bids[].params` for IX when the size is already in the ad unit?

If you are using Prebid.js version 5.0 and above, the `size` parameter is not a required field. Only the `siteID` is required, and it is stored with the sizes in the ad unit.

#### How can I view the bid request sent to IX by Prebid.js?

In your browser of choice, create a new tab and open the developer tools. In
developer tools, select the network tab. Then, navigate to a page where IX is
set up to bid. Now, in the network tab, search for requests to
`casalemedia.com/cygnus`. These are the bid requests.
