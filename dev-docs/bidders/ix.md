---
layout: bidder
title: Index Exchange
description: Prebid Index Exchange Bidder Adapter
biddercode: ix
pbjs: true
pbs: false
userIds: amazonAdvertisingID, fabrickId, zeotapIdPlus, TDID, tpid, id5Id, lotamePanoramaId, publinkId, hadronId, pubcid, trustpid, utiqMtpId, criteoID, euid, imuid, 33acrossId, nonID, pairId, M1ID, RampID, connectId
pbs_app_supported: true
schain_supported: true
coppa_supported: true
tcfeu_supported: true
dsa_supported: true
floors_supported: true
usp_supported: true
gpp_supported: true
media_types: banner, video, native
safeframes_ok: true
fpd_supported: true
gvl_id: 10
dchain_supported: false
deals_supported: true
prebid_member: yes
multiformat_supported: yes
sidebarType: 1
privacy_sandbox: paapi, topics
---

### Table of contents

* [Table of contents](#table-of-contents)
* [Introduction](#introduction)
* [Supported media types](#supported-media-types)
* [Set up Prebid.js to call Index directly from the browser](#set-up-prebidjs-to-call-index-directly-from-the-browser-client-side-adapter)
* [Set up Prebid.js to call Index through Prebid Server](#set-up-prebidjs-to-call-index-through-prebid-server-server-side-adapter)
* [Modules to include in your build process](#modules-to-include-in-your-build-process)
* [Set up First Party Data (FPD)](#set-up-first-party-data-fpd)
  * [Global data](#prebid-fpd-module)
  * [Index bidder-specific data](#index-bidder-specific-fpd-module)
  * [AdUnit-specific data](#adunit-specific-data)
* [Monetize instream video](#monetize-instream-video)
* [Index's outstream ad unit](#indexs-outstream-ad-unit) 
* [Prebid Native configuration](#prebid-native-configuration)
* [Protected Audience API support](#protected-audience-api-support)
* [Signal inventory using  external IDs](#signal-inventory-using-external-ids)
* [Bid request parameters](#bid-request-parameters)
  * [Banner](#banner)
  * [Video](#video)
  * [Native](#native)
* [Multi-format ad units](#multi-format-ad-units)
* [Examples](#examples)

<a id="introduction"></a>

### Introduction

Publishers can use Prebid.js to call Index Exchange (Index) in any of the following ways:

* **Call through our client-side adapter:** Prebid.js calls Index directly from the browser using our client-side adapter. This option tends to have a better cookie match rate. For configuration instructions, see the [Set up Prebid.js to call Index directly from the browser (client-side adapter)](#client-side-adapter) on this page.
* **Call through our server-side adapter**: Prebid.js makes a call to Prebid Server and then Prebid Server uses our server-side adapter to call Index. This reduces workload on the browser. For configuration instructions, see the [Set up Prebid.js to call Index through Prebid Server (server-side adapter)](#server-side-adapter) on this page.

**Notes:**

* **Send multiple ad slots in a single bid request**: Index accepts up to 100 valid ad slots in a single bid request. If a single bid request contains more than 100 ad slots (including invalid ad slots), only the first 100 valid ad slots are accepted and the rest are ignored. For example streaming TV media owners can signal multiple ad pods for long-form programming in a single request.
* **How to view bid requests sent to Index:**
  * In your browser, open a new tab.
  * Open the **Developer tools**.
  * In **Developer tools**, click the **Network** tab.
  * In the **Network** tab, search for requests sent to `casalemedia.com/cygnus` (from version 6.28.0 and earlier) or `casalemedia.com/openrtb/pbjs` (from version 6.29.0 and later). These are the bid requests sent to Index.
* **Recommended Global Bidder settings:** For our adapter, Index recommends enabling local storage. As of Prebid.js 7.x, local storage access must be explicitly specified. By leveraging local storage, Index is able to take advantage of the latest features our exchange has to offer. For instructions on enabling local storage, see Prebid’s [pbjs.bidderSettings](/dev-docs/publisher-api-reference/bidderSettings.html) documentation.

{% include dev-docs/storageAllowed.md %}

### Example

```javascript
pbjs.bidderSettings = { 
    ix: { 
        storageAllowed: true 
    } 
};
```

### Supported media types

The following table lists the media types that Index supports. For information about the the Time-To-Live (TTL) for each media type, see [How Index counts impressions](https://kb.indexexchange.com/publishers/billing/how_Index_counts_impressions.htm) in our Knowledge Base.

{: .table .table-bordered .table-striped }

| Type      | Prebid Server support |
| ----------- | ----------- |
| banner      | Supported       |
| video   | Supported      |
| native      | Supported       |

<a id="client-side-adapter"></a>

### Set up Prebid.js to call Index directly from the browser (client-side adapter)

To call Index from a web browser environment using a Prebid Server integration, see the Index-specific configuration steps in [Setup instructions to call Index through Prebid Server](/dev-docs/bidders/ix-server.html#setup-instructions-to-call-index-through-prebid-server) in our Prebid Server documentation on the Prebid site.

<a id="server-side-adapter"></a>

### Set up Prebid.js to call Index through Prebid Server (server-side adapter)

In this configuration, Prebid.js makes a call to Prebid Server and then Prebid Server uses our server-side adapter to call Index. Complete the following steps to configure Index as a demand source:

1. If you are hosting your own Prebid Server instance, see [Setup instructions to call Index through Prebid Server](/dev-docs/pbs-bidders.html#setup-instructions-to-call-index-through-prebid-server).
2. In the `[pbjs.setConfig()]` function, within the `s2sConfig` property, add `ix` to the `bidders` attribute.
3. Define the Index-specific parameters at the bidder level. For Index's bidder-specific parameters, see the [Bid request parameters](#bid-request-parameters) section below.
4. Define your ad units in the `adUnit` object. For more information about this object, see Prebid's [Ad Unit Reference](/dev-docs/adunit-reference.html) documentation.
5. Enable user syncing by adding the following code in the [pbjs.setConfig()](/dev-docs/publisher-api-reference/setConfig.html) function. Index strongly recommends enabling user syncing through iFrames, though we do also support image-based syncing. This functionality improves DSP user match rates and increases the Index bid rate and bid price. Be sure to call `pbjs.setConfig()` only once. This configuration is optional in Prebid, but required by Index.   <br />

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

6. (Optional) Set up First Party Data (FPD). For more information about the data types we support and the instructions for each option, see the [Set up First Party Data (FPD)](#set-up-first-party-data-fpd) section below.
7. (Optional) If you want to monetize instream video, see the [Monetize instream video](#monetize-instream-video) section below.
8. (Optional) If you want to monetize outstream video, you can choose among the following options:
    * Use Index's outstream video player. For more information, see the [Index's outstream ad unit](#indexs-outstream-ad-unit) section below.
    * Use your own outstream video player. For more information, see [Prebid’s documentation on how to show video ads.](/dev-docs/show-outstream-video-ads.html)
9. (Optional) Configure Prebid Native with Index. For more information, see the [Prebid Native](#prebid-native-configuration) section below. Prebid Native is available from Prebid.js version 7.4.0 or higher.

<a id="modules-to-include-in-your-build-process"></a>

### Modules to include in your build process

If you are building the JS binary on your own from source code, follow the instructions in [Prebid.js project README](https://github.com/prebid/Prebid.js/blob/master/README.md#build-optimization). You will need to include the `ixBidAdapter`. If you want to show video ads with Google Ad Manager, also include the `dfpAdServerVideo` module. We highly recommend adding the `gptPreAuction` module as well, which improves a DSP's ability to bid accurately on your supply. The following is an example build command that include these modules: <br />
`gulp build --modules=ixBidAdapter,dfpAdServerVideo,gptPreAuction,fooBidAdapter,bazBidAdapter`

If you are using a JSON file to specify modules, add `ixBidAdapter` and `dfpAdServerVideo` to the modules array as follows:

```javascript
[
    "ixBidAdapter",
    "dfpAdServerVideo",
    "gptPreAuction",
    "fooBidAdapter",
    "bazBidAdapter"
]
```

<a id="set-up-first-party-data-fpd"></a>

### Set up First Party Data (FPD)

You can set up the Prebid.js FPD module using Global data, Index bidder-specific site data, or ad unit-specific data. Index supports deal targeting in all the three FPD types.

<a name="prebid-fpd-module"></a>

### Global data

Use this data type to allow all bid adapters to have access to first party data that might be useful in ad targeting. This is available from Prebid.js version 4.30 and above.

To supply data that is accessible to all bidders, use the `[pbjs.setConfig()]` object as illustrated below. Use the `[setBidderConfig()]` function to supply bidder-specific data. For more information about the standard or more detailed examples, see Prebid's [First Party Data Feature](/features/firstPartyData.html) documentation.

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

<a id="index-bidder-specific-fpd-module"></a>

### Index bidder-specific data

This data type is available from Prebid version 7.49.0 and above. You can use it to specify key-value pairs that will be included in your query string when targeting deals. For example, if a user visits a news page, you can pass that information by submitting a key-value pair for `category = news`. You can then create a deal in the Index UI and activate the deal only on pages that contain `category = news` as the key-value pair.

To include the FPD in a bid request, in the `[pbjs.setConfig()]` object at the `ix` bidder level, provide the key-values in the `firstPartyData` parameter. Make sure that you set it before the `pbjs.requestBids` configuration. If you want to change the values, you can update the `pbjs.setConfig` once again. The change will be reflected in all future bid requests.

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

<a id="adunit-specific-data"></a>

### AdUnit-specific data

Use this data type to specify key-value pairs at the ad unit level when targeting deals and apply it to all bidders. This will be available from Prebid.js version 7.46 and above. To include the adUnit-specific data in a bid request, see Prebid's [Supplying AdUnit-Specific Data](/features/firstPartyData.html#supplying-adunit-specific-data) documentation.

```javascript
ortb2Imp: {
    ext: {
        data: {
                pbadslot: "homepage-top-rect",
                adUnitSpecificAttribute: "123"
        }
    }
}
```

### Monetize instream video 

Unlike Outstream Video, instream video does not use the Prebid Universal Creative. Instead, video bids provide VAST that Prebid caches to obtain a cache ID that can be retrieved with a URL. The cache ID is passed as a key value to the ad server.  

To monetize instream video, complete the following steps: 

1. Enable a cache endpoint in the `[pbjs.setConfig()]` function as follows:

   ```javascript
   pbjs.setConfig({ 
     cache: { 
             url: 'https://prebid.adnxs.com/pbc/v1/cache' 
         } 
   });
   ```

2. Set up your line items in Google Ad manger by following the instructions in Prebid's [Setting Up Video In GAM](/adops/setting-up-prebid-video-in-dfp.html) documentation. 

### Index's outstream ad unit

Publishers who are using Index as a bidding adapter in Prebid.js can show outstream video ads on their site using Index's outstream ad unit. This allows a video ad to be placed anywhere on a publisher’s site, such as in-article, in-feed, and more. To use Index's outstream ad unit, you must be on Prebid.js version 5.13 or higher. However, if you are using your own outstream video player, Index's adapter can accept video signals from version 2.41.0 or higher. <br />
**Note:** When you use the Index ad unit for outstream video, all impressions are considered viewable, which is similar to how Google's ActiveView counts impressions for outstream. This is because Index plays the outstream video as soon as it is in view and concurrently fires any impression pixels in the VAST.

To use Index’s outstream ad unit, in your Prebid.js configuration:<br />

1. Perform the following steps in your Prebid.js configuration to create a new section for Index's outstream ad unit:
    * Add a new code property under `adUnits`. The code could be the `divID` or the Google Ad Manager adUnit code.
    * Within the `adUnits`, add `ix` as a `bidder`.
    * At the `adUnit` level, under `mediaTypes`, you must add a `video` object that supports our required video parameters. For more information about which parameters to add, see the [Bid request parameters](#video) section below. This is useful for publishers who want to apply the same settings across all SSPs.
    * Optionally, you can add the `video` object at the bidder level under `bids.params`. This is useful for publishers who may want to set up different configurations for different SSPs.   <br />
**Note:** The `bidder` level video configurations override the `adUnit` level configurations. The `playerConfig` is only a bidder level configuration.
2. (Recommended) To force the Index ad unit as the default player for Index, set `backupOnly` to true (see below example). This configuration allows you to use your own player only when an adapter does not provide their own player. This also forces any adapter that has a player to use their player by default. If no player is provided, by default,  we will use our own ad unit script.
3. Configure the ad unit according to the options in the [Bid request parameters](#bid-request-parameters) section below.
4. Depending on your existing Prebid setup, complete one of the following:
    * If you have an existing Prebid.js integration for banner, you can use the corresponding line items in your Google Ad Manager (GAM) account to retrieve outstream video demand. For more information, see Prebid's documentation on [How to set up line items](/adops/step-by-step.html).
    * If you do not have an existing Prebid.js integration for banner, create a line item in your GAM account that is capable of serving an outstream video ad. For more information about how to do this, see Prebid's documentation on Setting up [Prebid Video in Google Ad Manager](/adops/setting-up-prebid-video-in-dfp.html).
5. Notify your Index Representative and provide your test page URL for validation. They will work with you to test the video ad unit and confirm that outstream video ads are being retrieved.<br />

For more information on how to structure the video object, refer to the following code example:<br />

```javascript
pbjs.addAdUnit({
    code: 'video1',
    // This video player would apply to all prebid creatives...
    renderer: {
        url: 'example.com/publishersCustomRenderer.js',
        backupOnly: true,
        render: function (bid) { renderAdUnit(...) }
    },
    mediaTypes: {
        // Publisher video player video settings...
        video: {
            context: 'outstream',
            playerSize: [640, 480],
            mimes: ['video/mp4'],
            protocols: [1, 2, 3, 4, 5, 6, 7, 8],
            placement: 3,
            playbackmethod: [6],
            skip: 1,
            plcmt: 4

        }
    },
    bids: [{
        bidder: 'ix',
        params: {
            siteId: '9999990',
            // Index ad unit video settings...
            video: {
                //minimum size for Video Player size is 144x144 in pixel
                //maxduration can be any.
                context: 'outstream',
                playerSize: [640, 480],
                mimes: ['video/mp4', 'video/webm', 'applications/javascript'],
                protocols: [2, 3, 5, 6],
                api: [2, 7],
                playbackmethod: [6],
                skip: 1,
                w: 640,
                h: 480,
                minduration: 5,
                maxduration: 60,
                delivery: [2],
                linearity: 1
            }
        }
    }]
});
```

*Please note that your use of the outstream video player will be governed by and subject to the terms and conditions of i) any master services or license agreement entered into by you and Index Exchange; ii) the information provided on our knowledge base linked [here](https://kb.indexexchange.com/publishers/prebid_integration/outstream_video_prebidjs.htm) and [here](https://kb.indexexchange.com/publishers/guidelines/standard_contractual_clauses.htm), and iii) our [Privacy Policy](https://www.indexexchange.com/privacy/). Your use of Index's outstream video player constitutes your acknowledgement and acceptance of the foregoing.*

<a id="prebid-native-configuration"></a>

### Prebid Native configuration

Prebid Native is available from Prebid.js version 7.4.0 or higher. We support the three native template rendering options that are provided in [Setting up Prebid Native in Google Ad Manager](/adops/gam-native.html). The following code is an example of a Prebid native setup using Google Ad Manager, but the concept and implementation should be similar for other ad servers.<br />

```javascript
pbjs.addAdUnits({
    code: slot.code,
    mediaTypes: {
        native: {
            ortb: {
                assets: [{
                    id: 1,
                    required: 1,
                    img: {
                        type: 3,
                        w: 150,
                        h: 50,
                    }
                },
                {
                    id: 2,
                    required: 1,
                    title: {
                        len: 80
                    }
                },
                {
                    id: 3,
                    required: 1,
                    data: {
                        type: 1
                    }
                },
                {
                    id: 4,
                    required: 1,
                    data: {
                        type: 2
                    }
                },
                {
                    id: 6,
                    required: 1,
                    img: {
                        type: 1,
                        w: 50,
                        h: 50,
                    }
                }]
            }
        }
    },
    bids: [{
        bidder: 'ix',
        params: {
            siteId: '9999990'
        }
    }]
});
```

<a id="protected-audience-api-support"></a>

### Protected Audience API support

**Before you begin:**

* You must be using Google Ad Manager as your ad server.
* In your Google Ad Manager configuration, make sure that you have not opted out from using the Protected Audience API. For more information about the configuration, see Google's documentation on  [Protected Audience API and Ad Manager after Chrome GA](https://support.google.com/admanager/answer/13627134?hl=en&ref_topic=12264880&sjid=10591375417866092080-NA).

Depending on the Prebid.js version that you are using, the steps to configure Prebid.js will differ. Follow the steps provided in the appropriate section for the version of Prebid.js that you are using:

**Configure Protected Audience API for Prebid.js versions 8.18.0 to 8.36.0**

1. Build the [PAAPI module](/dev-docs/modules/paapi.html) and the Fledge for GPT module in your Prebid.js configuration by adding `paapi` and `fledgeForGpt` to the list of modules that you are already using. <br />
**Note:** The `fledgeForGpt` module documentation no longer exists on Prebid's site. You can however refer to Prebid's [Protected Audience API (PAAPI) for GPT Module](/dev-docs/modules/paapiForGpt.html) documentation for information on adding module configurations.
2. Configure your ad units to make them eligible for Protected Audience API demand. You can do this in the global-level configuration, bidder level, or ad-unit level. Index recommends that you do this in the global-level configuration by using the `defaultForSlots` parameter with a value of `1`. The following code is an example of the configuration done at the global level:

    ```javascript
     pbjs.que.push(function() {
       pbjs.setConfig({
        paapi: {
        enabled: true,
        defaultForSlots: 1
          }
       });
    });
    ```

    **Note:** If you are using the `paapiForGpt.bidders[]`, make sure that you include `ix` to the list of bidders as follows:

    ```javascript
     pbjs.que.push(function() { 
       pbjs.setConfig({
        paapi: { 
        enabled: true,
        bidders: ['ix', /* any other bidders */],
        defaultForSlots: 1
          }
       });
    });
    ```

**Configure Protected Audience API for Prebid.js versions 8.37.0 and up to 9.0.0**

1. Build the PAAPI module in your Prebid.js configuration by adding `fledgeForGpt` to the list of modules that you are already using. When you add the `fledgeForGpt` module, the `paapi` module automatically gets included as a sub-module. For more information about the module, see Prebid's [PAAPI module](/dev-docs/modules/paapi.html) documentation. <br />
**Note:** The `fledgeForGpt` module documentation no longer exists on Prebid's site. You can however refer to Prebid's [Protected Audience API (PAAPI) for GPT Module](/dev-docs/modules/paapiForGpt.html) documentation for information on adding module configurations.
2. Complete the following steps to make your ad units eligible for Protected Audience API demand: <br />
**Note:** If you continue to use the `fledgeForGpt` property, you will receive a warning message in the console logs stating that the `fledgeForGpt` configuration options will soon be renamed to `paapi`. Therefore, Index recommends that you use the `paapi` property, which is available in Prebid.js version 8.37.0 or later.
    * In the `pbjs.setConfig().paapi` field, set the `defaultForSlots` parameter to `1`:

     ```javascript
     pbjs.que.push(function() {
       pbjs.setConfig({
         fledgeForGpt: {
          enabled: true,
          defaultForSlots: 1,
          bidders: ['ix', /* any other bidders */],
          });
      });
     ```

    * In the `paapi.gpt.autoconfig` field, set `autoconfig` to `false`. This step is important because, by default, the `paapiForGpt` module expects the Google Publisher Tag (GPT) ad units to be loaded before the Protected Audience configuration is added to the ad unit. Setting `autoconfig` to `false` will avoid any race conditions resulting from asynchronous libraries being loaded out of order, which would prevent the ad unit from being properly configured for Protected Audience API.<br />
**Note:** The `paapiForGpt.autoconfig` property is also backward compatible and can be used in place of the `paapi.gpt.autoconfig` property. However, Index recommends that you use the `paapi.gpt.autoconfig` property.<br />

     ```javascript
     pbjs.que.push(function() {
       pbjs.setConfig({
         paapi: {
           enabled: true,
           defaultForSlots: 1
           gpt: {
              autoconfig: false
               },
           bidders: ['ix', /* any other bidders */],
          });
        });
     ```

    * In the `pbjs.requestBids.bidsBackHandler` function, call the `pbjs.setPAAPIConfigForGPT()` function as follows:<br />
**Note:** When calling the `pbjs.setPAAPIConfigForGPT();` function, make sure that you check the following:
       * The function must be called in the `bidsBackHandler` each time new bids are requested (for example when refreshing `adSlots`). This is important because, when `autoconfig` is disabled, the `auctionConfig` needs to be associated with a GPT ad unit manually by calling `pbjs.setPAAPIConfigForGPT()`.
       * The function must be called before the `pbjs.setTargetingForGPTAsync()` function. This is important because the Protected Audience configuration needs to be associated with a GPT ad unit before the Google Ad Manager call is executed.

     ```javascript
      pbjs.requestBids({, ,  
       // ... 
       bidsBackHandler: function(bids, timedOut, auctionId) {  
         pbjs.setPAAPIConfigForGPT(); 
         pbjs.setTargetingForGPTAsync(); 
        // ... 
        } 
      }) 
     ```

**Configure Protected Audience API for Prebid.js version 9.0.0 or later**

1. Build the PAAPI for GPT module in your Prebid.js configuration by adding `paapi` to the list of modules that you are already using. For more information about the module, see Prebid's [Protected Audience API (PAAPI) for GPT Module](/dev-docs/modules/paapiForGpt.html) documentation.
2. In the `pbjs.setConfig().paapi` field, set the `defaultForSlots` parameter to `1`. 
3. In the `paapi.gpt.configWithTargeting` field, set `configWithTargeting` to `true`. For more control over configuring GPT slots to use PAAPI, set the `configWithTargeting` to `false` and use the `setPAAPIConfigForGPT` API. For more information about the configurations, see Prebid's [Protected Audience API (PAAPI) for GPT Module](/dev-docs/modules/paapiForGpt.html) documentation. <br />The following code is an example of the `defaultForSlots` and `configWithTargeting` configuration:

  ```javascript
  pbjs.que.push(function() {
    pbjs.setConfig({
       paapi: {
         enabled: true,
         defaultForSlots: 1  
         gpt: { 
           configWithTargeting: true
          }, 
         bidders: ['ix', /* any other bidders */],
     });
  });
  ```

<a id="signal-inventory-using-external-ids"></a>

### Signal inventory using  external IDs

1. In the `pbjs.setBidderConfig` object at the `ix` bidder level, you must configure an `exchangeId` that applies to all your placements as follows. Note that the `exchangeId` is provided by Index.

   ```javascript
   pbjs.setBidderConfig({
     bidders: ['ix'],
     config: {
        exchangeId: 123456 // Exchange-specific seller ID
      }
    });

   ```

2. Configure `externalId` at the bidder ad unit level under `bids.params`. The following shows an example of a banner ad that includes the `externalId` at the bidder level:

  ```javascript
   // Banner
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
            externalId: "example_value" // External placement ID, which could include an integer or string           
         }
       }
     ]
   }];

  ```

<a id="bid-request-parameters"></a>

### Bid request parameters

For a list of the OpenRTB fields that Index supports in bid requests, see [List of supported OpenRTB bid request fields for sellers](https://kb.indexexchange.com/publishers/openrtb_integration/list_of_supported_openrtb_bid_request_fields_for_sellers.htm#List_of_supported_OpenRTB_bid_request_fields_for_sellers). The following are the required fields for the various supported media types.

### Banner

You must include these parameters at the bidder level.

{: .table .table-bordered .table-striped }

| Name | Scope | Type | Description |
|---|---|---|---|
| `siteId` | Required | String | An Index-specific identifier that is associated with this ad unit. This is similar to a placement ID or an ad unit ID that some other modules have. For example, `'9999990'`, `'9999991'`, `'9999992'`|

### Video

You must include these parameters at the bidder level.

{: .table .table-bordered .table-striped }

| Name | Scope | Type | Description |
|---|---|---|---|
| `siteId` | Required | String | An Index-specific identifier that is associated with this ad unit. It will be associated with the single size, if the size is provided. This is similar to a placement ID or an ad unit ID that some other modules have. For example, `'9999990'`, `'9999991'`, `'9999992'`<br /> **Note:** You can re-use the existing `siteId` within the same flex position or video size, if the video adapts to the containing `<div>` element.|

If you are using Index's outstream ad unit and have placed the video object at the bidder level, you must include the Index required parameters at the bidder level. You can include the optional parameters to specify the outstream player configurations.

{: .table .table-bordered .table-striped }

| Name | Scope | Type | Description |
|---|---|---|---|
| `video.w` | Required | Integer | The width of the video player in pixels that will be passed to demand partners. You must define the size of the video player using the `video.w` and `video.h` parameters. We strongly recommend video sizes to be `256 x 256` or greater, `300 x 250`, or `320 x 180`. |
| `video.h` | Required | Integer | The height of the video player in pixels that will be passed to demand partners. You must define the size of the video player using the `video.w` and `video.h` parameters. We strongly recommend video sizes to be `256 x 256` or greater, `300 x 250`, or `320 x 180`. |
| `video.playerSize` | Required | Integer[] | The video player size that will be passed to demand partners. |
| `video.playerConfig` | Optional | Hash | The Index-specific outstream player configurations. |
| `video.playerConfig.floatOnScroll` | Optional | Boolean | A boolean specifying whether you want to use the player's floating capabilities, where:<br />- `true`: Use the Index player's float capabilities.<br /> **Note:** If you set `floatOnScroll` to `true`, Index updates the placement value to `5`.<br /> **Note:** We do not recommend using the player's default float capabilities if you have more than one outstream ad unit per page. <br /> - `false`: Do not use the Index player's float capabilities (default). |
| `video.playerConfig.floatSize` | Optional | Integer[] | The height and width of the floating player in pixels. If you do not specify a float size, the player adjusts to the aspect ratio of the player size that is defined when it is not floating. Index recommends that you review and test the float size to your user experience preference. |
| `video.plcmt` | Required | Integer[] | The video's placement type, where: <br /> - `1` = Instream<br /> - `2` = Accompanying Content <br /> - `3` = Interstitial <br /> - `4` = No Content/Standalone |

### Native

Index supports the same set of native assets that Prebid.js recognizes. For the list of native assets, see [Prebid.js Native Implementation Guide on the Prebid site.](https://docs.prebid.org/prebid/native-implementation.html#3-prebidjs-native-adunit-overview)

<a id="multi-format-ad-units"></a>

### Multi-format ad units

Index supports multi-format ad units, see [Show Multi-Format Ads with Prebid.js](https://docs.prebid.org/dev-docs/show-multi-format-ads.html). For multi-format ad units, you can optionally specify a different siteId for each multi-format type at the bidder  level. This is useful  if you have deals set up with Index at the siteId level. See multi-format examples [here](#examples).

The following are the parameters that you can specify for each multi-format type at the bidder level.

{: .table .table-bordered .table-striped }

| Name | Scope | Type | Description |
|---|---|---|---|
| `siteId` | Required | String | An Index-specific identifier that is associated with this ad unit. This is similar to a placement ID or an ad unit ID that some other modules have. For example, `'9999990'`, `'9999991'`, `'9999992'`. <br><br><b>Note:</b> This will also act as the default siteID for multi-format adunits if a format specific siteId is not provided.|
| `banner.siteId` | Optional | String | An Index-specific identifier that is associated with this ad unit. This siteId will be prioritized over the default siteID for `banner` format in the multi-format ad unit.|
| `video.siteId` | Optional | String | An Index-specific identifier that is associated with this ad unit. This siteId will be prioritized over the default siteID for `video` format in the multi-format ad unit.|
| `native.siteId` | Optional | String | An Index-specific identifier that is associated with this ad unit. This siteId will be prioritized over the default siteID for `native` format in the multi-format ad unit.|

<a id="examples"></a>

### Examples

**Banner**

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
            siteId: '9999990'
        }
    } 
    ]
}];

```

**Video (instream):** <br />
**Note**: `context` can either be `'instream'` or `'outstream'`.

```javascript
var adUnits = [{
    code: 'video-div-a',
    mediaTypes: {
        video: {
            // Preferred location as of version 4.43
            context: 'instream',
            playerSize: [300, 250],
            api: [2],
            protocols: [2, 3, 5, 6],
            minduration: 5,
            maxduration: 30,
            mimes: ['video/mp4', 'application/javascript'],
            placement: 3,
            plcmt: 1
        }
    },
    bids: [{
        bidder: 'ix',
        params: {
            siteId: '9999990',
            video: {
                // openrtb v2.5 compatible video obj
                // If required, use this to override mediaTypes.video.XX properties
            }
        }
    }]
}];

```

**Video (outstream)**

```javascript
var adUnits = [{
    code: 'div-gpt-ad-1571167646410-1',
    mediaTypes: {
        video: {
            playerSize: [640, 360],
            context: 'outstream',
            api: [2],
            protocols: [2, 3, 5, 6],
            minduration: 5,
            maxduration: 30,
            mimes: ['video/mp4', 'application/javascript'],
            placement: 3,
            plcmt: 4,
            playbackmethod: 6
        }
    },
    bids: [{
        bidder: 'ix',
        params: {
            siteId: '9999990'
            video: {
                playerConfig: {
                    floatOnScroll: true,
                    floatSize: [300,250]
                }
            }
        }
    }]
}];

```

**Prebid Native**

```javascript
pbjs.addAdUnits({
    code: slot.code,
    mediaTypes: {
        native: {
            ortb: {
                assets: [{
                    id: 1,
                    required: 1,
                    img: {
                        type: 3,
                        w: 150,
                        h: 50,
                    }
                },
                {
                    id: 2,
                    required: 1,
                    title: {
                        len: 80
                    }
                },
                {
                    id: 3,
                    required: 1,
                    data: {
                        type: 1
                    }
                },
                {
                    id: 4,
                    required: 1,
                    data: {
                        type: 2
                    }
                },
                {
                    id: 6,
                    required: 1,
                    img: {
                        type: 1,
                        w: 50,
                        h: 50,
                    }
                }]
            }
        }
    },
    bids: [{
        bidder: 'ix',
        params: {
            siteId: '9999990'
        }
    }]
});

```

**Multi-format SiteId Overrides**

```javascript
var adUnits = [{
   code: slot.code,
   mediaTypes: {
      
       banner: {
           sizes: [300,250]
       },
       native: {
           title: {
               required: false
           },
           image: {
               required: true
           },
           sponsoredBy: {
               required: false
           },
           body: {
               required: false
           }
       },
      
       video: {
           playerSize: sizes,
           context: 'outstream',
           api:[2],
           protocols: [2, 3, 5, 6],
           minduration: 5,
           maxduration: 30,
           mimes: ['video/mp4','application/javascript']
       }
   },
   bids: [
   {
       bidder: 'ix',
       params: {
           siteId: '9999990',
           video: {
               siteId: '9999991'
           },
           native: {
               siteId: '9999992'
           },
           banner: {
               siteId: '9999993'
           }
       }
   },
]
}];

```
