---
layout: bidder
title: Consumable
description: Prebid Consumable Bidder adapter
userIds: all
pbjs: true
pbs: false
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

The Consumable adapter requires setup and approval from your Consumable account manager, even for existing Consumable publishers. Please reach out to your account manager to enable Prebid.js for your account.

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

### Table of contents

* [Table of contents](#table-of-contents)
* [Introduction](#introduction)
* [Supported media types](#supported-media-types)
* [Set up Prebid.js to call Consumable directly from the browser](#set-up-prebidjs-to-call-consumable-directly-from-the-browser-client-side-adapter)
* [Set up Prebid.js to call Consumable through Prebid Server](#set-up-prebidjs-to-call-consumable-through-prebid-server-server-side-adapter)
* [Set up First Party Data (FPD)](#set-up-first-party-data-fpd)
  * [Global data](#set-up-first-party-data-fpd)
  * [Consumable bidder-specific data](#consumable-bidder-specific-data)
  * [AdUnit-specific data](#adunit-specific-data)
* [Bid request parameters](#bid-request-parameters)
  * [Banner](#banner)
  * [Video](#video)
* [Examples](#examples)

### Introduction

Publishers can use Prebid.js to call Consumable Exchange (Consumable) in any of the following ways:

* **Call through our client-side adapter:** Prebid.js calls Consumable directly from the browser using our client-side adapter. This option tends to have a better cookie match rate. For configuration instructions, see the [Set up Prebid.js to call Consumable directly from the browser (client-side adapter)](#set-up-prebidjs-to-call-consumable-directly-from-the-browser-client-side-adapter) on this page.
* **Call through our server-side adapter**: Prebid.js makes a call to Prebid Server and then Prebid Server uses our server-side adapter to call Consumable. This reduces workload on the browser. For configuration instructions, see the [Set up Prebid.js to call Consumable through Prebid Server (server-side adapter)](#set-up-prebidjs-to-call-consumable-through-prebid-server-server-side-adapter) on this page.

**Notes:**

* **Recommended Global Bidder settings:** For our adapter, Consumable recommends enabling local storage. As of Prebid.js 7.x, local storage access must be explicitly specified. By leveraging local storage, Consumable is able to take advantage of the latest features our exchange has to offer. For instructions on enabling local storage, see Prebid’s [pbjs.bidderSettings](/dev-docs/publisher-api-reference/bidderSettings.html) documentation.

{% include dev-docs/storageAllowed.md %}

### Example

```javascript
pbjs.bidderSettings = { 
    consumable: { 
        storageAllowed: true 
    } 
};
```

### Supported media types

The following table lists the media types that Consumable supports. 

{: .table .table-bordered .table-striped }

| Type   | Prebid Server support |
|--------| ----------- |
| banner | Supported       |
| video  | Supported      |

### Set up Prebid.js to call Consumable directly from the browser (client-side adapter)

To call Consumable from a web browser environment using a Prebid Server integration, see the Consumable-specific configuration steps in [Setup instructions to call Consumable through Prebid Server](/dev-docs/bidders/consumable-server.html#setup-instructions-to-call-consumable-through-prebid-server) in our Prebid Server documentation on the Prebid site.

### Set up Prebid.js to call Consumable through Prebid Server (server-side adapter)

In this configuration, Prebid.js makes a call to Prebid Server and then Prebid Server uses our server-side adapter to call Consumable. Complete the following steps to configure Consumable as a demand source:

1. If you are hosting your own Prebid Server instance, see [Setup instructions to call Consumable through Prebid Server](/dev-docs/pbs-bidders.html#setup-instructions-to-call-consumable-through-prebid-server).
2. In the `[pbjs.setConfig()]` function, within the `s2sConfig` property, add `consumable` to the `bidders` attribute.
3. Define the Consumable-specific parameters at the bidder level. For Consumable's bidder-specific parameters, see the [Bid request parameters](#bid-request-parameters) section below.
4. Define your ad units in the `adUnit` object. For more information about this object, see Prebid's [Ad Unit Reference](/dev-docs/adunit-reference.html) documentation.
5. Enable user syncing by adding the following code in the [pbjs.setConfig()](/dev-docs/publisher-api-reference/setConfig.html) function. Consumable strongly recommends enabling user syncing through iFrames, though we do also support image-based syncing. This functionality improves DSP user match rates and increases the Consumable bid rate and bid price. Be sure to call `pbjs.setConfig()` only once. This configuration is optional in Prebid, but required by Consumable.   <br />
    
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
   
6. (Optional) Set up First Party Data (FPD). For more information about the data types we support and the instructions for each option, see the [Set up First Party Data (FPD)](#set-up-first-party-data-fpd) section below.
7. (Optional) If you want to monetize instream video, you need to enable a cache endpoint in the `[pbjs.setConfig()]` function as follows:
    
   ```javascript
    pbjs.setConfig({
        cache: {
                url: 'https://prebid.adnxs.com/pbc/v1/cache'
            }
    });
    ```

### Set up First Party Data (FPD)

You can set up the Prebid.js FPD module using Global data, Consumable bidder-specific site data, or ad unit-specific data. Consumable supports deal targeting in all the three FPD types.

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

### Consumable bidder-specific data

This data type is available from Prebid version 7.49.0 and above. You can use it to specify key-value pairs that will be included in your query string when targeting deals. For example, if a user visits a news page, you can pass that information by submitting a key-value pair for `category = news`. You can then create a deal in the Consumable UI and activate the deal only on pages that contain `category = news` as the key-value pair.

To include the FPD in a bid request, in the `[pbjs.setConfig()]` object at the `consumable` bidder level, provide the key-values in the `firstPartyData` parameter. Make sure that you set it before the `pbjs.requestBids` configuration. If you want to change the values, you can update the `pbjs.setConfig` once again. The change will be reflected in all future bid requests.

```javascript
pbjs.setConfig({
    consumable: {
        firstPartyData: {
            '<key name>': '<key value>',
            '<key name>': '<key value>',
            // ...
        }
    }
});
```

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

### Bid request parameters

### Banner

You must include these parameters at the bidder level.

{: .table .table-bordered .table-striped }

| Name        | Scope    | Description                    | Example | Type      |
|-------------|----------|--------------------------------|---------|-----------|
| `siteId`    | required | The site ID from Consumable.    | `12345` | `integer` |
| `networkId` | required | The network ID from Consumable. | `9969`  | `integer` |
| `unitId` | required | The unit ID from Consumable. | `987654`  | `integer` |
| `unitName` | required | The unit name from Consumable. | `cnsmbl-unit`  | `string` |

### Video

You must include these parameters at the bidder level.

{: .table .table-bordered .table-striped }

| Name        | Scope    | Description                    | Example | Type      |
|-------------|----------|--------------------------------|---------|-----------|
| `siteId`    | required | The site ID from Consumable.    | `12345` | `integer` |
| `networkId` | required | The network ID from Consumable. | `9969`  | `integer` |
| `unitId` | required | The unit ID from Consumable. | `987654`  | `integer` |
| `unitName` | required | The unit name from Consumable. | `cnsmbl-unit`  | `string` |

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
        bidder: 'consumable',
        params: {
            "networkId": 11,
            "siteId": 32,
            "unitId": 42,
            "unitName": "the-answer"
        }
    } 
    ]
}];

```

**Video:** <br />

```javascript
var adUnits = [{
    code: 'video-div-a',
    mediaTypes: {
        video: {
            // Preferred location as of version 4.43
 video obj
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
        bidder: 'consumable',
        params: {
            "networkId": 11,
            "siteId": 32,
            "unitId": 42,
            "unitName": "the-answer"
            video: {
                // openrtb v2.5 compatible video obj
                // If required, use this to override mediaTypes.video.XX properties
            }
        }
    }]
}];

```
