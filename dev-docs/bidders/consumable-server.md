---
layout: bidder
title: Consumable
description: Prebid Consumable Bidder adapter
userIds: all
pbjs: true
pbs: true
pbs_app_supported: true
schain_supported: true
coppa_supported: true
tcfeu_supported: true
floors_supported: true
usp_supported: true
gpp_supported: true
biddercode: consumable
media_types: banner, video, audio
gvl_id: 591
deals_supported: true
fpd_supported: true
sidebarType: 1
multiformat_supported: will-bid-on-one
safeframes_ok: true
---

### Note

The Consumable adapter requires setup and approval from your Consumable account manager, even for existing Consumable publishers. Please reach out to your account manager to enable Prebid for your account.

### Disclosure

The Consumable bid adapter may cycle the ad initially shown with a new one at various intervals. This means the advertiser meta-data accompanying the bid response may be incomplete at the time of response.

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                    | Example | Type      |
|-------------|----------|--------------------------------|---------|-----------|
| `siteId`    | required | The site ID from Consumable.    | `12345` | `integer` |
| `networkId` | required | The network ID from Consumable. | `9969`  | `integer` |
| `unitId` | required | The unit ID from Consumable. | `987654`  | `integer` |
| `unitName` | required | The unit name from Consumable. | `cnsmbl-unit`  | `string` |
| `placementId` | required | the placementid from Consumable. | `0421008445828ceb46f496700a5fa65e` | `string` |

## Table of contents

* [Table of contents](#table-of-contents)
* [Introduction](#introduction)
* [Supported media types](#supported-media-types)
* [Setup instructions to call Consumable through Prebid Server](#setup-instructions-to-call-consumable-through-prebid-server)
  * [Call Consumable from a web browser](#call-consumable-from-a-web-browser)
  * [Call Consumable from Prebid Mobile SDK](#call-consumable-from-prebid-mobile-sdk)
  * [Call Consumable from CTV/long-form video environment](#call-consumable-from-ctvlong-form-video-environment)
* [Bid request parameters](#bid-request-parameters)
  * [Site](#site-banner-video-audio)
  * [App](#app-or-ctv-banner-video-audio)
* [Examples](#examples)

## Introduction

Publishers can use Prebid Server in any of the following ways with Consumable. Consumable's adapter supports all of the following methods:

* If you want to call Consumable from a web environment, you can use Prebid.js to call Prebid Server, and then Prebid Server uses our server-side adapter to call Consumable. This reduces workload on the browser. For set up instructions, see [Call Consumable from a web browser](#call-consumable-from-a-web-browser) section on this page.
* In mobile apps, you can use the Prebid Mobile SDK to call Prebid Server and then Prebid Server uses our server-side adapter to call Consumable. For set up instructions, see [Call Consumable from Prebid Mobile SDK](#call-consumable-from-prebid-mobile-sdk) section on this page.
* In CTV apps and other long-form video environments, you (or the SSAI vendor) can make a call to Prebid Server using OpenRTB, and then Prebid Server uses our server-side adapter to call Consumable. For set up instructions, see [Call Consumable from CTV/long-form video environment](#call-consumable-from-ctvlong-form-video-environment) section on this page.

## Supported media types

The following table lists the media types that Consumable supports. For information about the the Time-To-Live (TTL) for each media type, see [How Consumable counts impressions](https://kb.Consumableexchange.com/publishers/billing/how_Consumable_counts_impressions.htm) in our Knowledge Base.

{: .table .table-bordered .table-striped }
| Type      | Prebid Server support |
| ----------- | ----------- |
| banner      | Supported       |
| video   | Supported, including ad pods for OTT    |
| audio      | Supported       |

## Setup instructions to call Consumable through Prebid Server

**Note:** If you are hosting your own Prebid Server instance, you must contact your Consumable Exchange Representative to get an endpoint and setup instructions.

If you are using an existing Prebid Server instance that is already configured to call Consumable, depending on whether you want to call Consumable from the browser, mobile app, CTV, or long-form video, follow any of the below sections to complete the Consumable-specific configuration.

### Call Consumable from a web browser

To call Consumable from a web browser using Prebid Server, you must first configure Prebid.js to call Consumable directly from the browser using our client-side adapter. Follow the quick start instructions provided in Prebid's [Getting Started for Developers](/dev-docs/getting-started.html) documentation. Complete the following steps to complete the Consumable-specific configuration:

1. Build the binary in one of the following ways:
   [Download Prebid.js](/download.html) from the Prebid site to use the standard compiled binary that Prebid includes in the download process and select **Consumable Exchange** as an adapter.
2. Define the Consumable-specific parameters at the bidder level which include adding `consumable` as the bidder and the `siteId`. For Consumable's bidder-specific parameters, see the [Bid request parameters](#bid-request-parameters) section below.

   ```javascript
   {
       bidder: 'consumable',
       params: {
           "networkId": 11,
           "siteId": 32,
           "unitId": 42,
           "unitName": "cnsmbl-audio-728x90-slider"
       }
   }
   ```
   
3. Define your ad units in the `adUnit` object. This includes the details about the ad slots such as the media types, ad size, and ad code. For more information about this object, see Prebid's [Ad Unit Reference](/dev-docs/adunit-reference.html) documentation.
4. Enable user syncing by adding the following code in the [pbjs.setConfig()](/dev-docs/publisher-api-reference/setConfig.html) function. Consumable strongly recommends enabling user syncing through iFrames, though we do also support image-based syncing. This functionality improves DSP user match rates and increases the Consumable bid rate and bid price. Make  sure to call `pbjs.setConfig()` only once. This configuration is optional in Prebid, but required by Consumable.
    
   ```javascript
    pbjs.setConfig({
        userSync: {
            iframeEnabled: true,
            filterSettings: {
                iframe: {
                    bidders: ['consumable'],
                    filter: 'include'
                }
            }
        }
    });
    ```
   
5. (Optional) Set up First Party Data (FPD). For more information about the data types we support and the instructions for each option, see the [Set up First Party Data (FPD)](/dev-docs/bidders/consumable.html#set-up-first-party-data-fpd) section in our Prebid.js documentation on the Prebid site.
6. (Optional) If you want to monetize instream video, you need to enable a cache endpoint in the [pbjs.setConfig()](/dev-docs/publisher-api-reference/setConfig.html) function as follows: <br />

   ```javascript
    pbjs.setConfig({
        cache: {
            url: 'https://prebid.adnxs.com/pbc/v1/cache'
        }
    });
   ```

### Call Consumable from Prebid Mobile SDK

**Before you begin:** Contact your Consumable Exchange representative to get your `placementId`. You must provide this placementID to your Prebid Server host company.

**Note:** To implement Prebid Mobile SDK, follow Prebid's [Getting Started with Prebid Mobile](/prebid-mobile/prebid-mobile-getting-started.html) documentation.

To add Consumable as a bidder to your mobile app:

1. Inform your Prebid Server hosting company to add `consumable` as a bidder in the configuration and include the `placementId` that Consumable provides to you at the time of integration.
2. Define the Consumable-specific parameters at the bidder level. For information about these parameters, see the [Bid request parameters](#bid-request-parameters) section below.
3. Include any ad unit level required or optional parameters provided in Prebid's [Prebid Mobile API - iOS](/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html) and [Prebid Mobile API - Android](/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html) documentation.

### Call Consumable from CTV/long-form video environment

**Before you begin:** Contact your Consumable Exchange Representative to get the `placementId`. You must provide this placement ID to your Prebid Server host company.

**Note:** To implement CTV and long-form video using Prebid Server, follow Prebid's [Long Form Video](/prebid-server/use-cases/pbs-lfv.html) documentation.

To add Consumable as a bidder:

1. Inform your Prebid Server hosting company to add `consumable`as a bidder in the configuration and include the `placementId` that Consumable provides to you at the time of integration.
2. Define the Consumable-specific parameters at the bidder level. For information about these parameters, see the [Bid request parameters](#bid-request-parameters) section below.
3. Include any ad unit level required or optional parameters provided in Prebid's [/openrtb2/video](/prebid-server/endpoints/openrtb2/pbs-endpoint-video.html) documentation.

## Bid request parameters

For a list of the OpenRTB fields that Consumable supports in bid requests, see [List of supported OpenRTB bid request fields for sellers](https://kb.Consumableexchange.com/publishers/openrtb_integration/list_of_supported_openrtb_bid_request_fields_for_sellers.htm#List_of_supported_OpenRTB_bid_request_fields_for_sellers). The following are the required fields for the various supported media types.
### Site (Banner, Video, Audio)

You must include these parameters at the bidder level.

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                    | Example | Type      |
|-------------|----------|--------------------------------|---------|-----------|
| `siteId`    | required | The site ID from Consumable.    | `12345` | `integer` |
| `networkId` | required | The network ID from Consumable. | `9969`  | `integer` |
| `unitId` | required | The unit ID from Consumable. | `987654`  | `integer` |
| `unitName` | required | The unit name from Consumable. | `cnsmbl-unit`  | `string` |
### App or CTV (Banner, Video, Audio)

You must include these parameters at the bidder level.

{: .table .table-bordered .table-striped }
| Key | Scope | Type | Description |
|---|---|---|---|
| `placementId` | Required | String | An Consumable-specific identifier that is associated with this ad unit. It will be associated with the single size, if the size is provided. This is similar to a placement ID or an ad unit ID that some other modules have. For example, `'0421008445828ceb46f496700a5fa65e'`|

## Examples

**Banner**

```json
{
  "id": "cons-banner-id",
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
        "consumable": {
          "placementId": "0421008445828ceb46f496700a5fa65e"
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
  "id": "cons-video-example",
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
        "consumable": {
          "placementId": "0421008445828ceb46f496700a5fa65e"
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

**Audio**

```json
{
  "id": "cons-audio-example",
  "imp": [
    {
      "id": "imp-id",
      "video": {
        "mimes": [
          "video/mp3"
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
        "consumable": {
          "placementId": "0421008445828ceb46f496700a5fa65e"
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
