---
layout: bidder
title: Index Exchange (Prebid.js)
description: Prebid Index Exchange Bidder Adapter
biddercode: ix
pbjs: true
pbs: false
userIds: identityLink, netId, fabrickId, zeotapIdPlus, uid2, unifiedId, id5Id, lotamePanoramaId, publinkId, hadronId, pubcid, imuid
pbs_app_supported: true
schain_supported: true
coppa_supported: true
gdpr_supported: true
floors_supported: true
usp_supported: true
gpp_supported: true
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
* [Set up Prebid.js to call Index directly from the browser (client-side adapter)](#set-up-prebidjs-to-call-index-directly-from-the-browser-client-side-adapter)
* [Set up Prebid.js to call Index through Prebid Server (server-side adapter)](#set-up-prebidjs-to-call-index-through-prebid-server-server-side-adapter)
* [Modules to include in your build process](#modules-to-include-in-your-build-process)
* [Set up First Party Data (FPD)](#set-up-first-party-data-fpd)
  * [Global data](#prebid-fpd-module)
  * [Index bidder-specific data](#index-bidder-specific-fpd-module)
  * [AdUnit-specific data](#adunit-specific-data)
* [Index's outstream video player](#indexs-outstream-video-player)
* [Prebid Native configuration](#prebid-native-configuration)
* [Bid request parameters](#bid-request-parameters)
  * [Banner](#banner)
  * [Video](#video)
  * [Native](#native)
* [Multi-format ad units](#multi-format-ad-units)
* [Examples](#examples)

<a name="introduction"></a>

## Introduction

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

### Example

```javascript
pbjs.bidderSettings = { 
    ix: { 
        storageAllowed: true 
    } 
};
```

<a name="supported-media-types"></a>

## Supported media types

The following table lists the media types that Index supports. For information about the the Time-To-Live (TTL) for each media type, see [How Index counts impressions](https://kb.indexexchange.com/publishers/billing/how_Index_counts_impressions.htm) in our Knowledge Base.

{: .table .table-bordered .table-striped }

| Type      | Prebid Server support |
| ----------- | ----------- |
| banner      | Supported       |
| video   | Supported      |
| native      | Supported       |

<a name="client-side-adapter"></a>

## Set up Prebid.js to call Index directly from the browser (client-side adapter)

In this configuration Prebid.js calls Index directly from the browser using our client-side adapter. Follow the quick start instructions provided in Prebid's [Getting Started for Developers](/dev-docs/getting-started.html) documentation. Complete the following steps to complete the Index-specific configuration:

1. Build the binary in one of the following ways:
   * [Download Prebid.js](https://docs.prebid.org/download.html) from the Prebid site to use the standard compiled binary that Prebid includes in the download process and select **Index Exchange** as an adapter.
   * Build it on your own from the source code by following the instructions in [Prebid.js project README](https://github.com/prebid/Prebid.js/blob/master/README.md#build-optimization). If you use this method, you will need to include several modules in your build process. See the [Index modules to include in your build process](#modules-to-include-in-your-build-process) section below.
2. Define the Index-specific parameters at the bidder level which include adding `ix` as the bidder and the `siteId`. For Index's bidder-specific parameters, see the [Bid request parameters](#bid-request-parameters) section below. <br />
   ```javascript
{
    bidder: 'ix',
        params: {
        siteId: '123456'
    }
}
    ```
3. Define your ad units in the `adUnit` object. This includes the details about the ad slots such as the media types, ad size, and ad code. For more information about this object, see Prebid's [Ad Unit Reference](/dev-docs/adunit-reference.html) documentation.
4. Enable user syncing by adding the following code in the [pbjs.setConfig()](/dev-docs/publisher-api-reference/setConfig.html) function. Index strongly recommends enabling user syncing through iFrames, though we do also support image-based syncing. This functionality improves DSP user match rates and increases the Index bid rate and bid price. Make  sure to call `pbjs.setConfig()` only once. This configuration is optional in Prebid, but required by Index.  <br />
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
5. (Optional) Set up First Party Data (FPD). For more information about the data types we support and the instructions for each option, see the [Set up First Party Data (FPD)](#set-up-first-party-data-fpd) section below.
6. (Optional) If you want to monetize instream video, you need to enable a cache endpoint in the [pbjs.setConfig()](/dev-docs/publisher-api-reference/setConfig.html) function as follows: <br />

    ```javascript
        pbjs.setConfig({
            cache: {
                url: 'https://prebid.adnxs.com/pbc/v1/cache'
            }
        });
    ```
7. (Optional) If you want to monetize outstream video, you can choose among the following options:
    * Use Index's outstream video player. For more information, see the [Index's outstream video player ](#indexs-outstream-video-player)section below. 
    * Use your own outstream video player. For more information, see [Prebid's documentation on how to show video ads.](https://docs.prebid.org/dev-docs/show-outstream-video-ads.html)
8. (Optional) Configure Prebid Native with Index. For more information, see the [Prebid Native](#prebid-native-configuration) section below. Prebid Native is available from Prebid.js version 7.4.0 or higher.

<a name="server-side-adapter"></a>

## Set up Prebid.js to call Index through Prebid Server (server-side adapter)

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
7. (Optional) If you want to monetize instream video, you need to enable a cache endpoint in the `[pbjs.setConfig()]` function as follows:
```javascript
    pbjs.setConfig({
        cache: {
               url: 'https://prebid.adnxs.com/pbc/v1/cache'
            }
    });
```
8. (Optional) If you want to monetize outstream video, you can choose among the following options:
    * Use Index's outstream video player. For more information, see the [Index's outstream video player ](#indexs-outstream-video-player) section below. 
    * Use your own outstream video player. For more information, see [Prebid’s documentation on how to show video ads.](/dev-docs/show-outstream-video-ads.html)
9. (Optional) Configure Prebid Native with Index. For more information, see the [Prebid Native](#prebid-native-configuration) section below. Prebid Native is available from Prebid.js version 7.4.0 or higher.

<a name="modules-to-include-in-your-build-process"></a>

## Modules to include in your build process

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

<a name="set-up-first-party-data-fpd"></a>

## Set up First Party Data (FPD)

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

<a name="index-bidder-specific-fpd-module"></a>

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

<a name="adunit-specific-data"></a>

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

<a name="index-outstream-video-player"></a>

## Index's outstream video player

Publishers who are using Index as a bidding adapter in Prebid.js can show outstream video ads on their site using Index's outstream video player. This allows a video ad to be placed anywhere on a publisher’s site, such as in-article, in-feed, and more. To use Index's outstream renderer, you must be on Prebid.js version 5.13 or higher. However, if you are using your own outstream renderer, Index's adapter can accept video signals from version 2.41.0 or higher. <br />
**Note:** When you use the Index renderer for outstream video, all impressions are considered viewable, which is similar to how Google's ActiveView counts impressions for outstream. This is because Index renders the outstream video as soon as it is in view and concurrently fires any impression pixels in the VAST.

To use Index’s outstream video player, in your Prebid.js configuration:<br />

1. Perform the following steps in your Prebid.js configuration to create a new section for Index's outstream video player:
    * Add a new code property under `adUnits`. The code could be the `divID` or the Google Ad Manager adUnit code.
    * Within the `adUnits`, add `ix` as a `bidder`.
    * (Recommended) At the `adUnit` level, under `mediaTypes`, add a `video` object that supports our required video parameters. For more information about which parameters to add, see the [Bid request parameters](#video) section below. This is useful for publishers who want to apply the same settings across all SSPs.
    * Optionally, you can add the `video` object at the bidder level under `bids.params`. This is useful for publishers who may want to set up different configurations for different SSPs.   <br />
**Note:** The `bidder` level video configurations override the `adUnit` level configurations. The `playerConfig` is only a bidder level configuration.
2. (Recommended) To force the Index renderer as the default renderer for Index, set `backupOnly` to true (see below example). This configuration allows you to use your own renderer only when an adapter does not provide their own renderer. This also forces any adapter that has a renderer to use their renderer by default. If no renderer is provided, by default,  we will use our own renderer script.
3. Configure the player according to the options in the [Bid request parameters](#bid-request-parameters) section below.
4. Depending on your existing Prebid setup, complete one of the following:
    * If you have an existing Prebid.js integration for banner, you can use the corresponding line items in your Google Ad Manager (GAM) account to retrieve outstream video demand. For more information, see Prebid's documentation on [How to set up line items](/adops/step-by-step.html).
    * If you do not have an existing Prebid.js integration for banner, create a line item in your GAM account that is capable of serving an outstream video ad. For more information about how to do this, see Prebid's documentation on Setting up [Prebid Video in Google Ad Manager](/adops/setting-up-prebid-video-in-dfp.html).
5. Notify your Index Representative and provide your test page URL for validation. They will work with you to test the video player and confirm that outstream video ads are being retrieved.<br />

For more information on how to structure the video object, refer to the following code example:<br />

```javascript
pbjs.addAdUnit({
    code: 'video1',
    // This renderer would apply to all prebid creatives...
    renderer: {
        url: 'example.com/publishersCustomRenderer.js',
        backupOnly: true,
        render: function (bid) { renderAdUnit(...) }
    },
    mediaTypes: {
        // Pub renderer video settings...
        video: {
            context: 'outstream',
            playerSize: [640, 480],
            mimes: ['video/mp4'],
            protocols: [1, 2, 3, 4, 5, 6, 7, 8],
            playbackmethod: [2],
            skip: 1
            plcmt: 2

        }
    },
    bids: [{
        bidder: 'ix',
        params: {
            siteId: '12345',
            // Index renderer video settings...
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

<a name="prebid-native-configuration"></a>

## Prebid Native configuration

Prebid Native is available from Prebid.js version 7.4.0 or higher. We support the three native template rendering options that are provided in [Setting up Prebid Native in Google Ad Manager](/adops/gam-native.html). The following code is an example of a Prebid native setup using Google Ad Manager, but the concept and implementation should be similar for other ad servers.<br />

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
            privacyLink: {
                required: false
            },
            body: {
                required: true
                len: 90
            },
            icon: {
                required: true,
                sizes: [50, 50]
            }
        }
    },
    bids: [{
        bidder: 'ix',
        params: {
            siteId: '715966'
        }
    }]
});
```

<a name="bid-request-parameters"></a>

## Bid request parameters

For a list of the OpenRTB fields that Index supports in bid requests, see [List of supported OpenRTB bid request fields for sellers](https://kb.indexexchange.com/publishers/openrtb_integration/list_of_supported_openrtb_bid_request_fields_for_sellers.htm#List_of_supported_OpenRTB_bid_request_fields_for_sellers). The following are the required fields for the various supported media types.

### Banner

You must include these parameters at the bidder level.

{: .table .table-bordered .table-striped }

| Name | Scope | Type | Description |
|---|---|---|---|
| `siteId` | Required | String | An Index-specific identifier that is associated with this ad unit. This is similar to a placement ID or an ad unit ID that some other modules have. For example, `'3723'`, `'6482'`, `'3639'`|

### Video

You must include these parameters at the bidder level.

{: .table .table-bordered .table-striped }

| Name | Scope | Type | Description |
|---|---|---|---|
| `siteId` | Required | String | An Index-specific identifier that is associated with this ad unit. It will be associated with the single size, if the size is provided. This is similar to a placement ID or an ad unit ID that some other modules have. For example, `'3723'`, `'6482'`, `'3639'`<br /> **Note:** You can re-use the existing `siteId` within the same flex position or video size, if the video adapts to the containing `<div>` element.|

If you are using Index's outstream player and have placed the video object at the bidder level, you must include the Index required parameters at the bidder level. You can include the optional parameters to specify the outstream player configurations.

{: .table .table-bordered .table-striped }

| Name | Scope | Type | Description |
|---|---|---|---|
| `video.w` | Required | Integer | The width of the video player in pixels that will be passed to demand partners. You must define the size of the video player using the `video.w` and `video.h` parameters, with a minimum video player size of `300 x 250`. |
| `video.h` | Required | Integer | The height of the video player in pixels that will be passed to demand partners. You must define the size of the video player using the `video.w` and `video.h` parameters, with a minimum video player size of `300 x 250`. |
| `video.playerSize` | Required | Integer[] | The video player size that will be passed to demand partners. |
| `video.playerConfig` | Optional | Hash | The Index-specific outstream player configurations. |
| `video.playerConfig.floatOnScroll` | Optional | Boolean | A boolean specifying whether you want to use the player's floating capabilities, where:<br />- `true`: Use the Index player's float capabilities.<br /> **Note:** If you set `floatOnScroll` to `true`, Index updates the placement value to `5`.<br /> **Note:** We do not recommend using the player's default float capabilities if you have more than one outstream ad unit per page. <br /> - `false`: Do not use the Index player's float capabilities (default). |
| `video.playerConfig.floatSize` | Optional | Integer[] | The height and width of the floating player in pixels. If you do not specify a float size, the player adjusts to the aspect ratio of the player size that is defined when it is not floating. Index recommends that you review and test the float size to your user experience preference. |
| `video.plcmt` | Required | Integer[] | The video's placement type, where: <br /> - `1` = Instream<br /> - `2` = Accompanying Content <br /> - `3` = Interstitial <br /> - `4` = No Content/Standalone |

### Native

Index supports the same set of native assets that Prebid.js recognizes. For the list of native assets, see [Prebid.js Native Implementation Guide on the Prebid site.](https://docs.prebid.org/prebid/native-implementation.html#3-prebidjs-native-adunit-overview)

<a name="multi-format-ad-units"></a>

## Multi-format ad units

Index supports multi-format ad units, see [Show Multi-Format Ads with Prebid.js](https://docs.prebid.org/dev-docs/show-multi-format-ads.html). For multi-format ad units, you can optionally specify a different siteId for each multi-format type at the bidder  level. This is useful  if you have deals set up with Index at the siteId level. See multi-format examples [here](#examples).

The following are the parameters that you can specify for each multi-format type at the bidder level.

{: .table .table-bordered .table-striped }

| Name | Scope | Type | Description |
|---|---|---|---|
| `siteId` | Required | String | An Index-specific identifier that is associated with this ad unit. This is similar to a placement ID or an ad unit ID that some other modules have. For example, `'3723'`, `'6482'`, `'3639'`. <br><br><b>Note:</b> This will also act as the default siteID for multi-format adunits if a format specific siteId is not provided.|
| `banner.siteId` | Optional | String | An Index-specific identifier that is associated with this ad unit. This siteId will be prioritized over the default siteID for `banner` format in the multi-format ad unit.|
| `video.siteId` | Optional | String | An Index-specific identifier that is associated with this ad unit. This siteId will be prioritized over the default siteID for `video` format in the multi-format ad unit.|
| `native.siteId` | Optional | String | An Index-specific identifier that is associated with this ad unit. This siteId will be prioritized over the default siteID for `native` format in the multi-format ad unit.|

<a name="examples"></a>

## Examples

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
            siteId: '123456'
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
 video obj
            context: 'instream',
            playerSize: [300, 250],
            api: [2],
            protocols: [2, 3, 5, 6],
            minduration: 5,
            maxduration: 30,
            mimes: ['video/mp4', 'application/javascript'],
            placement: 3
        }
    },
    bids: [{
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
            placement: 5
        }
    },
    bids: [{
        bidder: 'ix',
        params: {
            siteId: '715964'
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
            privacyLink: {
                required: false
            },
            body: {
                required: true
                len: 90
            },
            icon: {
                required: true,
                sizes: [50, 50]
            }
        }
    },
    bids: [{
        bidder: 'ix',
        params: {
            siteId: '715966'
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
           siteId: '1111',
           video: {
               siteId: '2222'
           },
           native: {
               siteId: '3333'
           },
           banner: {
               siteId: '4444'
           }
       }
   },
]
}];

```
