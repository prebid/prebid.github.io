---
layout: bidder
title: Index Exchange (Prebid.js)
description: Prebid Index Exchange Bidder Adapter
biddercode: ix
pbjs: true
pbs: false
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
---

## Table of contents

- [Introduction](#introduction)
- [Supported media types](#supported-media-types)
- [Set up Prebid.js to call Index directly from the browser](#client-side-adapter)
- [Set up Prebid.js to call Index through Prebid Server](#server-side-adapter)
- [Modules to include in your build process](#modules-to-include-in-your-build-process)
- [Set up First Party Data (FPD)](#set-up-first-party-data-fpd)
- [Index's outstream video player](#index-outstream-video-player)
- [Prebid Native configuration](#prebid-native-configuration)
- [Bid request parameters](#bid-request-parameters)
- [Examples](#examples)


<a name="introduction" />

## Introduction

Publishers can use Prebid.js to call Index Exchange (Index) in any of the following ways:

* **Call through our client-side adapter:** Prebid.js calls Index directly from the browser using our client-side adapter. This option tends to have a better cookie match rate. For configuration instructions, see the [Set up Prebid.js to call Index directly from the browser (client-side adapter)](#client-side-adapter) on this page.
* **Call through our server-side adapter**: Prebid.js makes a call to Prebid Server and then Prebid Server uses our server-side adapter to call Index. This reduces workload on the browser. For configuration instructions, see the [Set up Prebid.js to call Index through Prebid Server (server-side adapter)](#server-side-adapter) on this page.

**Notes:** 
* **Bid request limit**: You can send up to 20 ad slots in a single bid request to Index. If a single bid request contains more than 20 ad slots, only the first 20 are accepted and the rest are ignored.
* **How to view bid requests sent to Index:** 
    * In your browser, open a new tab.
    * Open the **Developer tools**. 
    * In **Developer tools**, click the **Network** tab. 
    * In the **Network** tab, search for requests sent to `casalemedia.com/cygnus` (from version 6.28.0 and earlier) or `casalemedia.com/openrtb/pbjs` (from version 6.29.0 and later). These are the bid requests sent to Index. 


<a name="supported-media-types" />

## Supported media types 

The following table lists the media types that Index supports. For information about the the Time-To-Live (TTL) for each media type, see [How Index counts impressions](https://kb.indexexchange.com/publishers/billing/how_Index_counts_impressions.htm) in our Knowledge Base.

{: .table .table-bordered .table-striped }

| Type      | Prebid Server support |
| ----------- | ----------- |
| banner      | Supported       |
| video   | Supported      |
| native      | Supported       |

<a name="client-side-adapter" />

## Set up Prebid.js to call Index directly from the browser (client-side adapter)

In this configuration Prebid.js calls Index directly from the browser using our client-side adapter. Follow the quick start instructions provided in Prebid's [Getting Started for Developers](https://docs.prebid.org/dev-docs/getting-started.html) documentation. Complete the following steps to complete the Index-specific configuration:


1. Build the binary in one of the following ways:
   * [Download Prebid.js](https://docs.prebid.org/download.html) from the Prebid site to use the standard compiled binary that Prebid includes in the download process and select **Index Exchange** as an adapter.
    * Build it on your own from the source code by following the instructions in [Prebid.js project README](https://github.com/prebid/Prebid.js/blob/master/README.md#build-optimization). If you use this method, you will need to include several modules in your build process. See the [Index modules to include in your build process](#modules-to-include-in-your-build-process) section below.
2. Define the Index-specific parameters at the bidder level which include adding `ix` as the bidder and the `siteId`. For Index's bidder-specific parameters, see the [Bid request parameters](#bid-request-parameters) section below. <br />
**Example:** 
```javascript
{
        bidder: 'ix',
        params: {
            siteId: '123456'
        }
    }
```

3. Define your ad units in the `adUnit` object. This includes the details about the ad slots such as the media types, ad size, and ad code. For more information about this object, see Prebid's [Ad Unit Reference](https://docs.prebid.org/dev-docs/adunit-reference.html) documentation.
4. Enable user syncing by adding the following code in the [pbjs.setConfig()](https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html) function. Index strongly recommends enabling user syncing through iFrames, though we do also support image-based syncing. This functionality improves DSP user match rates and increases the Index bid rate and bid price. Make  sure to call `pbjs.setConfig()` only once. This configuration is optional in Prebid, but required by Index.  <br />

**Example:** 
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


5. (Optional) Set up First Party Data (FPD) using the Index bidder-specific FPD (preferred method) setting or the Prebid FPD module. For more information, see the [Set up First Party Data (FPD)](#set-up-first-party-data-fpd) section below.
6. (Optional) If you want to monetize instream video, you need to enable a cache endpoint in the `[pbjs.setConfig()](https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html)` function as follows: <br />
```javascript
pbjs.setConfig({
    cache: {
        url: 'https://prebid.adnxs.com/pbc/v1/cache'
    }
});
```

7. (Optional) If you want to monetize outstream video, you can choose among the following options. Outstream video is available from Prebid.js version 6.25 or higher.
    * Use Index’s outstream video player. For more information, see the [Index's outstream video player ](#indexs-outstream-video-player)section below. 
    * Use your own outstream video player. For more information, see [Prebid's documentation on how to show video ads.](https://docs.prebid.org/dev-docs/show-outstream-video-ads.html)
8. (Optional) Configure Prebid Native with Index. For more information, see the [Prebid Native](#prebid-native-configuration) section below. Prebid Native is available from Prebid.js version 7.4.0 or higher. 

<a name="server-side-adapter" />

## Set up Prebid.js to call Index through Prebid Server (server-side adapter)

In this configuration, Prebid.js makes a call to Prebid Server and then Prebid Server uses our server-side adapter to call Index. Complete the following steps to complete the Index-specific configuration:

1. In your PrebidServer adapter configuration Prebid.js, you must enable the Index adapter as follows:
```javascript
    adapters.ix.enabled=true 
    adapters.ix.endpoint=http://<Your Prebid Server Host's URL>
```


2. In the `[pbjs.setConfig()]` function, within the `s2sConfig` property, add `ix` to the `bidders` attribute. 
3. Define the Index-specific parameters at the bidder level. For Index's bidder-specific parameters, see the [Bid request parameters](#bid-request-parameters) section below.
4. Define your ad units in the `adUnit` object. For more information about this object, see Prebid's [Ad Unit Reference](https://docs.prebid.org/dev-docs/adunit-reference.html) documentation. 
5. Enable user syncing by adding the following code in the [pbjs.setConfig()](https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html) function. Index strongly recommends enabling user syncing through iFrames, though we do also support image-based syncing. This functionality improves DSP user match rates and increases the Index bid rate and bid price. Be sure to call `pbjs.setConfig()` only once. This configuration is optional in Prebid, but required by Index.   <br />

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


6. (Optional) Set up First Party Data (FPD) using the Index bidder-specific FPD (preferred method) setting or the Prebid FPD module. For more information, see the [Set up First Party Data (FPD)](#set-up-first-party-data-fpd) section below.
7. (Optional) If you want to monetize instream video, you need to enable a cache endpoint in the `[pbjs.setConfig()]` function as follows:
```javascript
pbjs.setConfig({
    cache: {
           url: 'https://prebid.adnxs.com/pbc/v1/cache'
        }
});
```



8. (Optional) If you want to monetize outstream video, you can choose among the following options. Outstream video is available from Prebid.js version 6.25 or higher.
    * Use Index's outstream video player. For more information, see the [Index's outstream video player ](#indexs-outstream-video-player) section below. 
    * Use your own outstream video player. For more information, see [Prebid’s documentation on how to show video ads.](https://docs.prebid.org/dev-docs/show-outstream-video-ads.html)
9. (Optional) Configure Prebid Native with Index. For more information, see the [Prebid Native](#prebid-native-configuration) section below. Prebid Native is available from Prebid.js version 7.4.0 or higher. 



<a name="modules-to-include-in-your-build-process" />

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
 

<a name="set-up-first-party-data-fpd" />

## Set up First Party Data (FPD)
 
You can set up FPD using the Index bidder-specific module (recommended) or the Prebid FPD module. 

**Notes:**

* Index does not support ad unit-specific FPD and `ortb2.imp`.
* To target deals with Index, you must use the Index bidder-specific FPD module. The Prebid FPD module does not support deals targeting. If you have any questions or need help setting up the configuration, contact your Index Representative.

<a name="index-bidder-specific-fpd-module" />

### Index bidder-specific FPD module 

This module allows you to specify key-value pairs that will be included in your query string when targeting deals. For example, if a user visits a news page, you can pass that information by submitting a key-value pair for `category = news`. You can then create a deal in the Index UI and activate the deal only on pages that contain `category = news` as the key-value pair.

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


<a name="prebid-fpd-module" />

### Prebid FPD module 

This module allows all bid adapters to have access to first party data that might be useful in ad targeting. This is available from Prebid.js version 4.30 and above.  
To supply data that is accessible to all bidders, use the `[pbjs.setConfig()]` object as illustrated below. Use the `[setBidderConfig()]` function to supply bidder-specific data. For more information about the standard or more detailed examples, see Prebid's [First Party Data Feature](https://docs.prebid.org/features/firstPartyData.html) documentation. 

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

<a name="index-outstream-video-player" />

## Index's outstream video player

Publishers who are using Index as a bidding adapter in Prebid.js can show outstream video ads on their site using Index's outstream video player. This allows a video ad to be placed anywhere on a publisher’s site, such as in-article, in-feed, and more. Outstream video is available from Prebid.js version 6.25 or higher. <br />
**Note:** When you use the Index renderer for outstream video, all impressions are considered viewable, which is similar to how Google's ActiveView counts impressions for outstream. This is because Index renders the outstream video as soon as it is in view and concurrently fires any impression pixels in the VAST. 

To use Index’s outstream video player, in your Prebid.js configuration:<br />

1. Define a new video object in any of the following ways:
    * At the `adUnit` level: Define the size using `video.playerSize`.
    * At the `bidder` level: Define the size of the video player using the `video.h` and `video.w` parameters.  <br />
**Note:** The `bidder` level video configurations override the `adUnit` level configurations. The `playerConfig` is only a bidder level configuration.
2. Configure the player according to the options in the [Bid request parameters](#bid-request-parameters) section below. <br />
For more information on how to structure the video object, refer to the following code example:<br />

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
```


*Please note that your use of the outstream video player will be governed by and subject to the terms and conditions of i) any master services or license agreement entered into by you and Index Exchange; ii) the information provided on our knowledge base linked [here](https://kb.indexexchange.com/publishers/prebid_integration/outstream_video_prebidjs.htm) and [here](https://kb.indexexchange.com/publishers/guidelines/standard_contractual_clauses.htm), and iii) our [Privacy Policy](https://www.indexexchange.com/privacy/). Your use of Index's outstream video player constitutes your acknowledgement and acceptance of the foregoing.*

<a name="prebid-native-configuration" />

## Prebid Native configuration

Prebid Native is available from Prebid.js version 7.4.0 or higher. We support the three native template rendering options that are provided in [Setting up Prebid Native in Google Ad Manager](https://docs.prebid.org/adops/gam-native.html). The following code is an example of a Prebid native setup using Google Ad Manager, but the concept and implementation should be similar for other ad servers.<br />

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


<a name="bid-request-parameters" />

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


### Native

Index supports the same set of native assets that Prebid.js recognizes. For the list of native assets, see [Prebid.js Native Implementation Guide on the Prebid site.](https://docs.prebid.org/prebid/native-implementation.html#3-prebidjs-native-adunit-overview)


<a name="examples" />

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
    }]
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
