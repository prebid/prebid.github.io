---
layout: bidder
title: Index Exchange (Prebid Server)
description: Prebid Index Exchange Bidder Adapter
biddercode: ix
pbjs: false
pbs: true
userIds: identityLink, netId, fabrickId, zeotapIdPlus, uid2, unifiedId, id5Id, lotamePanoramaId, publinkId, hadronId, pubcid
pbs_app_supported: true
schain_supported: true
coppa_supported: true
gdpr_supported: true
floors_supported: true
usp_supported: true
media_types: banner, video, native
fpd_supported: true
gvl_id: 10
dchain_supported: false
deals_supported: true
prebid_member: yes
multiformat_supported: yes
sidebarType: 1
---



## Table of contents

* [Table of contents](#table-of-contents)
* [Introduction](#introduction)
* [Supported media types](#supported-media-types)
* [Setup instructions to call Index through Prebid Server](#setup-instructions-to-call-index-through-prebid-server)
  * [Call Index from a web browser](#call-index-from-a-web-browser)
  * [Call Index from Prebid Mobile SDK](#call-index-from-prebid-mobile-sdk)
  * [Call Index from CTV/long-form video environment](#call-index-from-ctvlong-form-video-environment)
  * [Call Index from any other server-to-server OpenRTB environment](#call-index-from-any-other-server-to-server-openrtb-environment)
* [Bid request parameters](#bid-request-parameters)
  * [Banner](#banner)
  * [Video](#video)
* [Examples](#examples)

<a name="introduction"></a>

## Introduction

Publishers can use Prebid Server in any of the following ways with Index Exchange (Index). Index's adapter supports all of the following methods:

* If you want to call Index from a web environment, you can use Prebid.js to call Prebid Server, and then Prebid Server uses our server-side adapter to call Index. This reduces workload on the browser. For set up instructions, see [Call Index from a web browser](#call-index-from-a-web-browser) section on this page.
* In mobile apps, you can use the Prebid Mobile SDK to call Prebid Server and then Prebid Server uses our server-side adapter to call Index. For set up instructions, see [Call Index from Prebid Mobile SDK](#set-up-instructions-to-call-index-through-prebid-server) section on this page.
* In CTV apps and other long-form video environments, you (or the SSAI vendor) can make a call to Prebid Server using OpenRTB, and then Prebid Server uses our server-side adapter to call Index. For set up instructions, see [Call Index from CTV/long-form video environment](#set-up-instructions-to-call-index-through-prebid-server) section on this page.
* In any other server-to-server OpenRTB environment, you can send OpenRTB bid requests to the Prebid Server host of your choice. For set up instructions, see [Call Index from any other server-to-server OpenRTB environment](#call-index-from-ortb) section on this page.  

**Note about sending multiple ad slots in a single bid request:** Index accepts up to 100 valid ad slots in a single bid request. If a single bid request contains more than 100 ad slots (including invalid ad slots), only the first 100 valid ad slots are accepted and the rest are ignored. For example streaming TV media owners can signal multiple ad pods for long-form programming in a single request.

<a name="supported-media-types"></a>

## Supported media types

The following table lists the media types that Index supports. For information about the the Time-To-Live (TTL) for each media type, see [How Index counts impressions](https://kb.indexexchange.com/publishers/billing/how_Index_counts_impressions.htm) in our Knowledge Base.

{: .table .table-bordered .table-striped }
| Type      | Prebid Server support |
| ----------- | ----------- |
| banner      | Supported       |
| video   | Supported, including ad pods for OTT    |
| native      | Supported       |

<a name="call-index"></a>

## Setup instructions to call Index through Prebid Server

**Note:** If you are hosting your own Prebid Server instance, you must contact your Index Exchange Representative to get an endpoint and setup instructions.

If you are using an existing Prebid Server instance that is already configured to call Index, depending on whether you want to call Index from the browser, mobile app, CTV, or long-form video, follow any of the below sections to complete the Index-specific configuration.

<a name="call-index-from-a-web-browser"></a>

### Call Index from a web browser

If you want to call Index from a web environment, you can use Prebid.js to call Prebid Server and then Prebid Server uses our server-side adapter to call Index. For setup instructions, see the Index-specific configuration steps in [Set up instructions for Prebid.js](https://docs.prebid.org/dev-docs/bidders/ix.html) in our Prebid.js documentation on the Prebid site.

<a name="call-index-from-prebid-mobile-sdk"></a>

### Call Index from Prebid Mobile SDK

**Before you begin:** Contact your Index Exchange representative to get your `siteId`. You must provide this site ID to your Prebid Server host company.

**Note:** To implement Prebid Mobile SDK, follow Prebid's [Getting Started with Prebid Mobile](https://docs.prebid.org/prebid-mobile/prebid-mobile-getting-started.html) documentation.

To add Index as a bidder to your mobile app:

1. Inform your Prebid Server hosting company to add `ix`as a bidder in the configuration and include the `siteId` that Index provides to you at the time of integration.
2. Define the Index-specific parameters at the bidder level. For information about these parameters, see the [Bid request parameters](#bid-request-parameters) section below.
3. Include any ad unit level required or optional parameters provided in Prebid's [Prebid Mobile API - iOS](https://docs.prebid.org/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html) and [Prebid Mobile API - Android](https://docs.prebid.org/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html) documentation.

<a name="call-index-from-ctv-long-form-video-environment"></a>

### Call Index from CTV/long-form video environment

**Before you begin:** Contact your Index Exchange Representative to get the `siteId`. You must provide this site ID to your Prebid Server host company.

**Note:** To implement CTV and long-form video using Prebid Server, follow Prebid's [Long Form Video](https://docs.prebid.org/prebid-server/use-cases/pbs-lfv.html) documentation.

To add Index as a bidder:

1. Inform your Prebid Server hosting company to add `ix`as a bidder in the configuration and include the `siteId` that Index provides to you at the time of integration.
2. Define the Index-specific parameters at the bidder level. For information about these parameters, see the [Bid request parameters](#bid-request-parameters) section below.
3. Include any ad unit level required or optional parameters provided in Prebid's [/openrtb2/video](https://docs.prebid.org/prebid-server/endpoints/openrtb2/pbs-endpoint-video.html) documentation.

<a name="call-index-from-ortb"></a>

### Call Index from any other server-to-server OpenRTB environment

To request bids from Index:

* In requests that you make to your Prebid Server host, add `imp.ext.ix` and include the `siteId` that Index provides to you at the time of integration. <br />

**Example:**

```javascript
    "imp": [{
           "ext": {
              "ix": {
                "siteId": "12345"
              }
        }
      }],
```

<a name="bid-request-parameters"></a>

## Bid request parameters

For a list of the OpenRTB fields that Index supports in bid requests, see [List of supported OpenRTB bid request fields for sellers](https://kb.indexexchange.com/publishers/openrtb_integration/list_of_supported_openrtb_bid_request_fields_for_sellers.htm#List_of_supported_OpenRTB_bid_request_fields_for_sellers). The following are the required fields for the various supported media types.

### Banner

You must include these parameters at the bidder level.

{: .table .table-bordered .table-striped }
| Key | Scope | Type | Description |
|---|---|---|---|
| `siteId` | Required | String | An Index-specific identifier that is associated with this ad unit. This is similar to a placement ID or an ad unit ID that some other modules have. For example, `'3723'`, `'6482'`, `'3639'`|

### Video

You must include these parameters at the bidder level.

{: .table .table-bordered .table-striped }
| Key | Scope | Type | Description |
|---|---|---|---|
| `siteId` | Required | String | An Index-specific identifier that is associated with this ad unit. It will be associated with the single size, if the size is provided. This is similar to a placement ID or an ad unit ID that some other modules have. For example, `'3723'`, `'6482'`, `'3639'`<br /> **Note:** You can re-use the existing `siteId` within the same flex position or video size, if the video adapts to the containing `<div>` element.|

If you are using Index's outstream player and have placed the video object at the bidder level, you must include the Index required parameters at the bidder level. You can include the optional parameters to specify the outstream player configurations.

{: .table .table-bordered .table-striped }
| Key | Scope | Type | Description |
|---|---|---|---|
| `video.w` | Required | Integer | The width of the video player in pixels that will be passed to demand partners. You must define the size of the video player using the `video.w` and `video.h` parameters, with a minimum video player size of `300 x 250`. |
| `video.h` | Required | Integer | The height of the video player in pixels that will be passed to demand partners. You must define the size of the video player using the `video.w` and `video.h` parameters, with a minimum video player size of `300 x 250`. |
| `video.playerSize` | Required | Integer[] | The video player size that will be passed to demand partners. |
| `video.playerConfig` | Optional | Hash | The Index-specific outstream player configurations. |
| `video.playerConfig.floatOnScroll` | Optional | Boolean | A boolean specifying whether you want to use the player's floating capabilities, where:<br />- `true`: Use the Index player's float capabilities.<br /> **Note:** If you set `floatOnScroll` to `true`, Index updates the placement value to `5`.<br /> **Note:** We do not recommend using the player's default float capabilities if you have more than one outstream ad unit per page. <br /> -`false`: Do not use the Index player's float capabilities (default). |
| `video.playerConfig.floatSize` | Optional | Integer[] | The height and width of the floating player in pixels. If you do not specify a float size, the player adjusts to the aspect ratio of the player size that is defined when it is not floating. Index recommends that you review and test the float size to your user experience preference. |

<a name="examples"></a>

## Examples

**Banner**

```json
{
  "id": "ix-banner-id",
  "imp": [
    {
      "id": "imp-id",
      "banner": {
        "w": 300,
        "h": 250,
        "id": "1",
        "pos": 0,
        "format": [
          {
            "w": 300,
            "h": 250
          },
          {
            "w": 300,
            "h": 600
          }
        ]
      },
      "instl": 0,
      "tagid": "5602709",
      "bidfloor": 0.02,
      "bidfloorcur": "USD",
      "secure": 1,
      "ext": {
        "ix": {
          "siteId": "123456"
        }
      }
    }
  ],
  "app": {
    "bundle": "555555555",
    "storeurl": "https://apps.apple.com/us/app/test-app/id555555555",
    "publisher": {
      "id": "123456"
    },
    "content": {
      "title": "Entertainment",
      "genre": "IAB9-30,IAB6,IAB9-7,IAB1"
    }
  },
  "device": {
    "ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
    "ip": "10.20.30.40",
    "ifa": "2E2E2E2E-3B3B-4141-8A8A-181818181818"
  },
  "at": 1,
  "tmax": 200
}
```

**Video**

```json
{
  "id": "ix-video-example",
  "imp": [
    {
      "id": "imp-id",
      "video": {
        "mimes": [
          "video/mp4",
          "video/3gpp",
          "video/webm"
        ],
        "minduration": 15,
        "maxduration": 60,
        "startdelay": -1,
        "protocols": [
          2,
          3,
          5,
          6
        ],
        "w": 320,
        "h": 480,
        "placement": 1,
        "linearity": 1,
        "minbitrate": 1000,
        "api": [
          1,
          2,
          3,
          5
        ]
      },
      "secure": 1,
      "ext": {
        "ix": {
          "siteId": "654321"
        }
      }
    }
  ],
  "app": {
    "bundle": "555555555",
    "storeurl": "https://apps.apple.com/us/app/test-app/id555555555",
    "publisher": {
      "id": "123456"
    },
    "content": {
      "title": "Entertainment",
      "genre": "IAB9-30,IAB6,IAB9-7,IAB1"
    }
  },
  "device": {
    "ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E18",
    "ip": "10.20.30.40",
    "ifa": "2E2E2E2E-3B3B-4141-8A8A-181818181818"
  },
  "at": 1,
  "tmax": 1000
}
```
