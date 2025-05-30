---
layout: bidder
title: Index Exchange (Prebid Server)
description: Prebid Index Exchange Bidder Adapter
biddercode: ix
pbjs: false
pbs: true
userIds: idl, netId, fabrickId, zeotapIdPlus, uid2, TDID, id5Id, lotamePanoramaId, publinkId, hadronId, pubcid, utiq, criteoID, euid, imuid, 33acrossId, nonID, pairid
pbs_app_supported: true
schain_supported: true
coppa_supported: true
tcfeu_supported: true
floors_supported: true
usp_supported: true
media_types: banner, video, native
safeframes_ok: true
fpd_supported: true
gvl_id: 10
dchain_supported: false
deals_supported: true
prebid_member: yes
multiformat_supported: yes
sidebarType: 1
privacy_sandbox: paapi
---

### Table of contents

* [Table of contents](#table-of-contents)
* [Introduction](#introduction)
* [Supported media types](#supported-media-types)
* [Configure the Index adapter in your Prebid Server instance](#hosting-instance)
* [Publisher instructions to call Index through Prebid Server](#call-index)
  * [Call Index from a web browser](#call-index-from-a-web-browser)
  * [Call Index from Prebid Mobile SDK](#call-index-from-prebid-mobile-sdk)
  * [Call Index from CTV/long-form video environment](#call-index-from-ctvlong-form-video-environment)
  * [Call Index from any other server-to-server OpenRTB environment](#call-index-from-any-other-server-to-server-openrtb-environment)
* [Receive Protected Audience API demand from Index](#paapi)
* [Bid request parameters](#bid-request-parameters)
  * [Banner](#banner)
  * [Video](#video)
* [Examples](#examples)

### Introduction

Publishers can use Prebid Server in any of the following ways with Index Exchange (Index). Index's adapter supports all of the following methods:

* If you want to call Index from a web environment, you can use Prebid.js to call Prebid Server, and then Prebid Server uses our server-side adapter to call Index. This reduces workload on the browser. For set up instructions, see [Call Index from a web browser](#call-index-from-a-web-browser) section on this page.
* In mobile apps, you can use the Prebid Mobile SDK to call Prebid Server and then Prebid Server uses our server-side adapter to call Index. For set up instructions, see [Call Index from Prebid Mobile SDK](#call-index-from-prebid-mobile-sdk) section on this page.
* In CTV apps and other long-form video environments, you (or the SSAI vendor) can make a call to Prebid Server using OpenRTB, and then Prebid Server uses our server-side adapter to call Index. For set up instructions, see [Call Index from CTV/long-form video environment](#call-index-from-ctvlong-form-video-environment) section on this page.
* In any other server-to-server OpenRTB environment, you can send OpenRTB bid requests to the Prebid Server host of your choice. For set up instructions, see [Call Index from any other server-to-server OpenRTB environment](#call-index-from-ortb) section on this page.  

**Note about sending multiple ad slots in a single bid request:** Index accepts up to 100 valid ad slots in a single bid request. If a single bid request contains more than 100 ad slots (including invalid ad slots), only the first 100 valid ad slots are accepted and the rest are ignored. For example,  streaming TV media owners can signal multiple ad pods for long-form programming in a single request.

<a id="supported-media-types"></a>

### Supported media types

The following table lists the media types that Index supports. For information about the the Time-To-Live (TTL) for each media type, see [How Index counts impressions](https://kb.indexexchange.com/publishers/billing/how_Index_counts_impressions.htm) in our Knowledge Base.

{: .table .table-bordered .table-striped }

| Type      | Prebid Server support |
| ----------- | ----------- |
| banner      | Supported       |
| video   | Supported, including ad pods for OTT    |
| native      | Supported       |

<a id="hosting-instance"></a>

### Configure the Index adapter in your Prebid Server instance 

**Before you begin:** Contact your Index Exchange Representative to get an endpoint and setup instructions.

If you are hosting your own Prebid Server instance, depending on whether you are using Prebid Server Go or Prebid Server Java version, complete one of the following steps: 

* If you are using the Prebid Server Go version, in the `static/bidder-info/ix.yaml` file, complete the following:

  * Enable the adapter by deleting the `disabled: true` entry.
  * Add the following new entry and include the regional endpoint provided to you by Index:

    ```javascript
     endpoint: "https://<ENDPOINT URL>"
     ```

  * Edit the below existing entry and include your publisher ID in the `s` parameter:

    ```javascript
     userSync:  
      redirect:  
       url: "https://ssum.casalemedia.com/usermatchredir?s=<PUBLISHER ID>&gdpr={% raw %}{{.GDPR}}&gdpr_consent={{.GDPRConsent}}&us_privacy={{.USPrivacy}}&cb={{.RedirectURL}}{% endraw %}"
     ```

  * Edit the below existing entry and include your publisher ID in the `s` parameter:

     ```javascript
     userSync:  
      redirect:  
       iframe: "https://ssum.casalemedia.com/usermatch?s=<PUBLISHER ID>&gdpr={% raw %}{{.GDPR}}&gdpr_consent={{.GDPRConsent}}&us_privacy={{.USPrivacy}}&cb={{.RedirectURL}}{% endraw %}"
      ```         

* If you are using [Prebid Server Java](https://github.com/prebid/prebid-server-java) version, edit the `prebid-server-java` entry in the `src/main/resources/bidder-config/ix.yaml` file as follows:

  * Edit the below existing entry and include the endpoint URL provided to you by Index.

    ```javascript
    adapters: 
     ix: 
       endpoint: "https://<ENDPOINT URL>"
    ```

  * Edit the below existing entry and include your publisher ID in the `s` parameter:

    ```javascript
     adapters: 
       ix: 
        usersync: 
         redirect: 
          url: "https://ssum.casalemedia.com/usermatchredir?s=<PUBLISHER ID>&gdpr={% raw %}{{.GDPR}}&gdpr_consent={{.GDPRConsent}}&us_privacy={{.USPrivacy}}&cb={{.RedirectURL}}{% endraw %}" 
    ```

  * Add the below entry and include your publisher ID in the `s` parameter:

    ```javascript
    adapters: 
      ix: 
       usersync: 
        iframe: 
         url: "https://ssum.casalemedia.com/usermatch?s=<PUBLISHER ID>&gdpr={% raw %}{{.GDPR}}&gdpr_consent={{.GDPRConsent}}&us_privacy={{.USPrivacy}}&cb={{.RedirectURL}}{% endraw %}"
    ```

<a id="call-index"></a>

### Publisher instructions to call Index through Prebid Server

If you are using an existing Prebid Server instance that is already configured to call Index, depending on whether you want to call Index from the browser, mobile app, CTV, or long-form video, follow any of the below sections to complete the Index-specific configuration.

<a id="call-index-from-a-web-browser"></a>

### Call Index from a web browser

To call Index from a web browser using Prebid Server, you must first configure Prebid.js to call Index directly from the browser using our client-side adapter. Follow the quick start instructions provided in Prebid's [Getting Started for Developers](/dev-docs/getting-started.html) documentation. Complete the following steps to complete the Index-specific configuration:

1. Build the binary in one of the following ways:
   * [Download Prebid.js](/download.html) from the Prebid site to use the standard compiled binary that Prebid includes in the download process and select **Index Exchange** as an adapter.
   * Build it on your own from the source code by following the instructions in [Prebid.js project README](https://github.com/prebid/Prebid.js/blob/master/README.md#build-optimization). If you use this method, you will need to include several modules in your build process. See the [Index modules to include in your build process](/dev-docs/bidders/ix.html#modules-to-include-in-your-build-process) section in our Prebid.js documentation on the Prebid site.
2. Define the Index-specific parameters at the bidder level which include adding `ix` as the bidder and the `siteId`. For Index's bidder-specific parameters, see the [Bid request parameters](#bid-request-parameters) section below.

    ```javascript
    {
        bidder: 'ix',
        params: {
            siteId: '9999990'
        }
    }
    ```

3. Define your ad units in the `adUnit` object. This includes the details about the ad slots such as the media types, ad size, and ad code. For more information about this object, see Prebid's [Ad Unit Reference](/dev-docs/adunit-reference.html) documentation.
4. Enable user syncing by adding the following code in the [pbjs.setConfig()](/dev-docs/publisher-api-reference/setConfig.html) function. Index strongly recommends enabling user syncing through iFrames, though we do also support image-based syncing. This functionality improves DSP user match rates and increases the Index bid rate and bid price. Make  sure to call `pbjs.setConfig()` only once. This configuration is optional in Prebid, but required by Index.

    ```javascript
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

5. (Optional) Set up First Party Data (FPD). For more information about the data types we support and the instructions for each option, see the [Set up First Party Data (FPD)](/dev-docs/bidders/ix.html#set-up-first-party-data-fpd) section in our Prebid.js documentation on the Prebid site.
6. (Optional) If you want to monetize instream video, you need to enable a cache endpoint in the [pbjs.setConfig()](/dev-docs/publisher-api-reference/setConfig.html) function as follows: <br />

    ```javascript
    pbjs.setConfig({
        cache: {
            url: 'https://prebid.adnxs.com/pbc/v1/cache'
        }
    });
    ```

7. (Optional) If you want to monetize outstream video, you can choose among the following options:
    * Use Index's outstream video player. For more information, see the [Index's outstream video player](/dev-docs/bidders/ix.html#index-outstream-video-player) section in our Prebid.js documentation on the Prebid site.
    * Use your own outstream video player. For more information, see [Prebid's documentation on how to show video ads.](/dev-docs/show-outstream-video-ads.html)
8. (Optional) Configure Prebid Native with Index. For more information, see the [Prebid Native](/dev-docs/bidders/ix.html#prebid-native-configuration) section in our Prebid.js documentation on the Prebid site. Prebid Native is available from Prebid.js version 7.4.0 or higher.

<a name="call-index-from-prebid-mobile-sdk"></a>

### Call Index from Prebid Mobile SDK

**Before you begin:** Contact your Index Exchange representative to get your `siteId`. You must provide this site ID to your Prebid Server host company.

**Note:** To implement Prebid Mobile SDK, follow Prebid's [Getting Started with Prebid Mobile](/prebid-mobile/prebid-mobile-getting-started.html) documentation.

To add Index as a bidder to your mobile app:

1. Inform your Prebid Server hosting company to add `ix`as a bidder in the configuration and include the `siteId` that Index provides to you at the time of integration.
2. Define the Index-specific parameters at the bidder level. For information about these parameters, see the [Bid request parameters](#bid-request-parameters) section below.
3. Include any ad unit level required or optional parameters provided in Prebid's [Prebid Mobile API - iOS](/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html) and [Prebid Mobile API - Android](/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html) documentation.

<a id="call-index-from-ctv-long-form-video-environment"></a>

### Call Index from CTV/long-form video environment

**Before you begin:** Contact your Index Exchange Representative to get the `siteId`. You must provide this site ID to your Prebid Server host company.

**Note:** To implement CTV and long-form video using Prebid Server, follow Prebid's [Long Form Video](/prebid-server/use-cases/pbs-lfv.html) documentation.

To add Index as a bidder:

1. Inform your Prebid Server hosting company to add `ix`as a bidder in the configuration and include the `siteId` that Index provides to you at the time of integration.
2. Define the Index-specific parameters at the bidder level. For information about these parameters, see the [Bid request parameters](#bid-request-parameters) section below.
3. Include any ad unit level required or optional parameters provided in Prebid's [/openrtb2/video](/prebid-server/endpoints/openrtb2/pbs-endpoint-video.html) documentation.

<a id="call-index-from-ortb"></a>

### Call Index from any other server-to-server OpenRTB environment

To request bids from Index:

* In requests that you make to your Prebid Server host, add `imp.ext.ix` and include the `siteId` that Index provides to you at the time of integration. <br />

**Example:**

```javascript
    "imp": [{
           "ext": {
              "ix": {
                "siteId": "9999990"
              }
        }
      }],
```

<a id="paapi"></a>

### Receive Protected Audience API demand from Index

Publishers who want to use the Protected Audience API with Prebid Server, must first set up their inventory to be eligible for Protected Audience API in Prebid.js. Prebid Server will automatically pass through the on-device auction signals received from Prebid.js to Index. To receive Protected Audience API auction demand from Index, contact your Index Representative.

**Before you begin:** Depending on whether you are using the Prebid Server Go or Java code base and the Prebid.js version, you must make sure that you are using the appropriate Prebid Server version:

* **For Prebid Server Go:** If you are using a Prebid.js version that is between 8.18.0 and 8.51.0, you must be using Prebid Server version 2.1.0 or later. For a Prebid.js version that is 8.52.0 or later, you must be using Prebid Server version 3.3.0 or later.
* **For Prebid Server Java:** If you are using a Prebid.js version that is 8.18.0 or later, you must be using Prebid Server Java version 3.16.0 or later.

1. Configure Prebid.js to send the `ae` field with a value of `1`. For more information on how to set up the Protected Audience API in Prebid.js, see the [Protected Audience API support](/dev-docs/bidders/ix.html#protected-audience-api-support) section in our Prebid.js documentation on the Prebid site.
2. Prebid Server will now automatically pass through the `ae=1` field received from Prebid.js to Index. No other specific Prebid Server configuration is required.

**Example:** The following is an example that illustrates how to set up Prebid Server in your Prebid.js configuration:

```javascript
    pbjs.setConfig({
    s2sConfig: [{
        accountId: '1',
        bidders: ['ix'],
        adapter: 'prebidServer',
        enabled: true,
        endpoint: 'https://prebid-server.example.com/openrtb2/auction',
        syncEndpoint: 'https://prebid-server.example.com/cookie_sync',
        timeout: 500,
        extPrebid: {
            cache: {
                vastxml: { returnCreative: false }
            },
            targeting: {
                pricegranularity: {"ranges": [{"max":40.00,"increment":1.00}]}
            }
        }
    }]
})
```

<a id="bid-request-parameters"></a>

### Bid request parameters

For a list of the OpenRTB fields that Index supports in bid requests, see [List of supported OpenRTB bid request fields for sellers](https://kb.indexexchange.com/publishers/openrtb_integration/list_of_supported_openrtb_bid_request_fields_for_sellers.htm#List_of_supported_OpenRTB_bid_request_fields_for_sellers). The following are the required fields for the various supported media types.

### Banner

You must include these parameters at the bidder level.

{: .table .table-bordered .table-striped }

| Key | Scope | Type | Description |
|---|---|---|---|
| `siteId` | Required | String | An Index-specific identifier that is associated with this ad unit. This is similar to a placement ID or an ad unit ID that some other modules have. For example, `'9999990'`, `'9999991'`, `'9999992'`|

### Video

You must include these parameters at the bidder level.

{: .table .table-bordered .table-striped }

| Key | Scope | Type | Description |
|---|---|---|---|
| `siteId` | Required | String | An Index-specific identifier that is associated with this ad unit. It will be associated with the single size, if the size is provided. This is similar to a placement ID or an ad unit ID that some other modules have. For example, `'9999990'`, `'9999991'`, `'9999992'`<br /> **Note:** You can re-use the existing `siteId` within the same flex position or video size, if the video adapts to the containing `<div>` element.|

If you are using Index's outstream ad unit and have placed the video object at the bidder level, you must include the Index required parameters at the bidder level. You can include the optional parameters to specify the outstream ad unit configurations.

{: .table .table-bordered .table-striped }

| Key | Scope | Type | Description |
|---|---|---|---|
| `video.w` | Required | Integer | The width of the video player in pixels that will be passed to demand partners. You must define the size of the video player using the `video.w` and `video.h` parameters. We strongly recommend video sizes to be `256 x 256` or greater, `300 x 250`, or `320 x 180`. |
| `video.h` | Required | Integer | The height of the video player in pixels that will be passed to demand partners. You must define the size of the video player using the `video.w` and `video.h` parameters. We strongly recommend video sizes to be `256 x 256` or greater, `300 x 250`, or `320 x 180`. |
| `video.playerSize` | Required | Integer[] | The video player size that will be passed to demand partners. |
| `video.playerConfig` | Optional | Hash | The Index-specific outstream ad unit configurations. |
| `video.playerConfig.floatOnScroll` | Optional | Boolean | A boolean specifying whether you want to use the player's floating capabilities, where:<br />- `true`: Use the Index player's float capabilities.<br /> **Note:** If you set `floatOnScroll` to `true`, Index updates the placement value to `5`.<br /> **Note:** We do not recommend using the player's default float capabilities if you have more than one outstream ad unit per page. <br /> -`false`: Do not use the Index player's float capabilities (default). |
| `video.playerConfig.floatSize` | Optional | Integer[] | The height and width of the floating player in pixels. If you do not specify a float size, the player adjusts to the aspect ratio of the player size that is defined when it is not floating. Index recommends that you review and test the float size to your user experience preference. |
| `video.plcmt` | Required | Integer[] | The video's placement type, where: <br /> - `1` = Instream<br /> - `2` = Accompanying Content <br /> - `3` = Interstitial <br /> - `4` = No Content/Standalone |

<a id="examples"></a>

### Examples

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
          "siteId": "9999990"
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
          "siteId": "9999990"
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
