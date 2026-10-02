---
layout: bidder
title: TripleLift
description: TripleLift Prebid Bidder Adapter
biddercode: triplelift
tcfeu_supported: true
usp_supported: true
gpp_supported: true
coppa_supported: true
schain_supported: true
floors_supported: true
media_types: banner, video, native
userIds: all
prebid_member: true
safeframes_ok: true
deals_supported: true
pbjs: true
pbs: true
pbs_app_supported: true
fpd_supported: true
gvl_id: 28
sidebarType: 1
---

### Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview](#overview)
- [Bid Params](#bid-params)
- [Media Types](#media-types)
  - [Banner](#banner)
  - [Video](#video)
  - [Native](#native)
- [Configuration Examples](#configuration-examples)
  - [Instream Video Example](#instream-video-example)
  - [Outstream Video Example](#outstream-video-example)
  - [Native Example](#native-example)
- [Previous Auction Info](#previous-auction-info)
- [First Party Data](#first-party-data)
- [Programmatic DMP](#triplelift-programmatic-dmp)

<a name="triplelift-overview"></a>

### Overview

Publishers may integrate with Triplelift through our Prebid.js and/or Prebid Server adapters. See below for more information.


{: .alert.alert-info :}
The Triplelift Prebid Server bidding adapter and user sync endpoint require setup before beginning. Please contact us at <prebid@triplelift.com>.


{: .alert.alert-info :}
Starting with Prebid.js v11.36.0, the Triplelift Prebid.js adapter uses the oRTB Conversion Library to build requests/responses. Please reach out to your Triplelift representative to discuss specifics of the integration.


{: .alert.alert-info :}
If you would like to flag an issue for Triplelift to investigate or a question about the Triplelift Prebid.js adapter, please fill out the following Salesforce form: 
<https://triplelift.my.site.com/publishersupport/s/contactsupport>. 
Please include the following information in your request: 
**Case Type**: Integration assistance 
**Case Subtype**: Prebid Adapter Update Questions 


<a name="triplelift-bid-params"></a>

### Bid Params

{: .alert.alert-danger :}
Starting with Prebid.js v11.36.0, the `parentId` parameter is **required** for all Triplelift bid requests. **Bid requests that do not contain `parentId` from v11.34.0 forward will be dropped.** 
Please contact your Triplelift representative to obtain your `parentId` value.


{: .alert.alert-info :}
Starting with Prebid.js v11.36.0, the `publisherId` parameter is *recommended* for all Triplelift bid requests. Please contact your Triplelift representative to obtain your `publisherId` value(s).


{: .table .table-bordered .table-striped }

| Name            | Scope       | Description                                                                                             | Example                | Type     |
|-----------------|-------------|---------------------------------------------------------------------------------------------------------|------------------------|----------|
| `inventoryCode` | required    | TripleLift inventory code for this ad unit (provided to you by your partner manager)                    | `'pubname_top_banner'` | `string` |
| `parentId`      | required    | TripleLift parent ID associated with internal parent account. (provided to you by your partner manager) | `'1234'`               | `string` |
| `publisherId`   | recommended | TripleLift publisher ID associated with internal publisher. (provided to you by your partner manager)   | `'5678'`               | `string` |
| `floor`         | required    | Bid floor                                                                                               | `1.00`                 | `float`  |


<a name="triplelift-media-types"></a>

### Media Types


<a name="triplelift-banner"></a>

#### Banner 

```javascript
var adUnits = [
    {
        code: 'banner1',
        mediaTypes: {
            banner: {
                sizes: [
                    [728, 90],
                    [970, 250]
                ]
            }
    },
    bids: [{
        bidder: 'triplelift',
        params: {
            inventoryCode: 'pubname_top_banner',
            parentId: '1234',
            publisherId: '5678',
            floor: 1.00
        }
    }]
}];
```

<a name="triplelift-video"></a>

#### Video

Triplelift bid params for video mediaTypes are identical, but be sure to include the appropriate **video.plcmt** or video.placement value (if OpenRTB 2.6 is not supported) to indicate instream/outstream format. 

The following fields begin with `adUnit.mediaTypes.video` and are supported by Triplelift. See the [Ad Unit Reference](https://docs.prebid.org/dev-docs/adunit-reference.html#adunitmediatypesvideo) for more info:

{: .table .table-bordered .table-striped }

| Name           | Scope       | Description                                                                             | Example         | Type            |
|----------------|-------------|-----------------------------------------------------------------------------------------|-----------------|-----------------|
| `plcmt`        | required    | Instream: 1;      Outstream: 3, 4, 5.                                                   | `3`             | `int`           |
| `placement`    | required    | Instream: 1;      Outstream: 3, 4, 5.                                                   | `3`             | `int`           |
| `playerSize`   | required    | Video player dimensions or size in pixels                                               | `[640, 480]`    | `integer array` |
| `mimes`        | recommended | List of content MIME types supported by the player                                      | `["video/mp4"]` | `string array`  |
| `protocols`    | recommended | Supported video protocol values (see OpenRTB spec)                                      | `[2,3,4,5,6]`   | `integer array` |
| `linearity`    | recommended | OpenRTB lineary - 1: linear (in-stream ad), 2: non-linear (overlay ad)                  | `1`             | `integer`       |
| `maxduration`  | recommended | Maximum video ad duration in seconds                                                    | `30`            | `integer`       |
| `minduration`  | recommended | Minimum video ad duration in seconds                                                    | `5`             | `integer`       |
| `api`          | recommended | Supported API framework values (see OpenRTB spec)                                       | `[2]`           | `integer array` |
| `skip`         | optional    | Indicates if the player will allow the video to be skipped                              | `1`             | `integer`       |
| `skipafter`    | optional    | Number of seconds a video must play before skipping is enabled                          | `5`             | `integer`       |
| `minbitrate`   | optional    | Minimum bit rate in Kbps                                                                | `300`           | `integer`       |
| `maxbitrate`   | optional    | Maximum bit rate in Kbps                                                                | `9600`          | `integer`       |
| `startdelay`   | optional    | Indicates the start delay in seconds for pre-roll, mid-roll, or post-roll ad placements | `0`             | `integer`       |


<a name="triplelift-native"></a>

#### Native

{: .alert.alert-info :}
As of version 11.36.0, Triplelift supports native ads. Please reach out to your Triplelift representative to discuss specifics of the integration.


We **highly** recommend using the OpenRTB Native 1.2 Specification. If you cannot support OpenRTB Native 1.2, please reach out to us.

The following fields begin with `adUnit.mediaTypes.native.ortb` and are supported by Triplelift:

{: .table .table-bordered .table-striped }

| Name               | Scope       | Description                                                                                        | Example             | Type                |
|--------------------|-------------|----------------------------------------------------------------------------------------------------|---------------------|---------------------|
| `ver`              | recommended | OpenRTB native version                                                                             | `'1.2'`             | `string`            |
| `context`          | recommended | The context for which the ad appears (see OpenRTB Native 1.2 spec)                                 | `1`                 | `integer`           |
| `plcmttype`        | recommended | The design/format/layout of the ad unit (see OpenRTB Native 1.2 spec)                              | `1`                 | `integer`           |
| `privacy`          | recommended | Set to 1 when the native ad support buyer-specific privacy notice                                  | `0`                 | `integer`           |
| `eventtrackers`    | recommended | Specifies what type of event tracking is supported                                                 | `0`                 | `object array`      |
| `assets.id`        | required    | Unique asset ID                                                                                    | `0`                 | `integer`           |
| `assets.title`     | required    | Title object for title assets                                                                      | `See example below` | `See example below` |
| `assets.img`       | required    | Image object for image assets                                                                      | `See example below` | `See example below` |
| `assets.img.w`     | required    | Width of image for image asset                                                                     | `See example below` | `See example below` |
| `assets.img.h`     | required    | Height of image for image assets                                                                   | `See example below` | `See example below` |
| `assets.data`      | required    | Data object for brand name, description, rating, etc.                                              | `See example below` | `See example below` |
| `assets.data.type` | required    | Specifies type of data object. Sponsored field (type: 1) is required (see OpenRTB Native 1.2 spec) | `See example below` | `See example below` |

<a name="triplelift-config-examples"></a>

### Configuration Examples

<a name="triplelift-instream-example"></a>

##### Instream Video Example

```javascript
var videoAdUnit = {
    code: 'video1',
    mediaTypes: {
        video: {
            playerSize: [640, 480],
            plcmt: 1,
            context: 'instream',
            placement: 1,
            mimes: ['video/mp4'],
            maxduration: 30,
            minduration: 5,
            protocols: [2,3,5,6]
        }
    },
    bids: [{
        bidder: 'triplelift',
        params: {
            inventoryCode: 'pubname_instream1',
            parentId: '1234',
            publisherId: '5678',
            floor: 3.00
        }
    }]
};
```

<a name="triplelift-outstream-example"></a>

##### Outstream Video Example

```javascript
var videoAdUnit = {
    code: 'video2',
    mediaTypes: {
        video: {
            playerSize: [640, 480],
            plcmt: 3,
            context: 'outstream',
            placement: 3,
            mimes: ['video/mp4']
        }
    },
    bids: [{
        bidder: 'triplelift',
        params: {
            inventoryCode: 'pubname_outstream1',
            parentId: '1234',
            publisherId: '5678',
            floor: 2.00
        }
    }]
};
```

{: .alert.alert-info :}
Triplelift does not have a default outstream renderer. Publishers must provide their own outstream renderer for the Triplelift bidder to work with outstream video.


<a name="triplelift-native-example"></a>

##### Native Example

```javascript
var nativeAdUnit = {
    code: 'native1',
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
        bidder: 'triplelift',
        params: {
            inventoryCode: 'pubname_native1',
            parentId: '1234',
            publisherId: '5678',
            floor: 2.00
        }
    }]
};
```

<a name="triplelift-previous-auction-info"></a>

### Previous Auction Info

Triplelift is able to use information from previous auctions to improve the performance of future auctions. In order to facilitate this, you will need to do the following:
1. Include the Previous Auction Info module in your Prebid.js build. See the [Prebid.js Modules](https://docs.prebid.org/dev-docs/modules.html) page for more information.
2. Configure Prebid.js to enable the Previous Auction Info module and add Triplelift to the bidder list:

```javascript
pbjs.setConfig({
    previousAuction: {
        enabled: true,              
        bidders: ['triplelift'],
      maxQueueLength: 10
    }
});
```


<a name="triplelift-first-party"></a>

### First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html). The following fields are supported:

- `ortb2.site.*`: Standard IAB OpenRTB 2.5 site fields
- `ortb2.user.*`: Standard IAB OpenRTB 2.5 user fields

AdUnit-specific data is supported using `AdUnit.ortb2Imp.ext.*`


<a name="triplelift-programmatic-dmp"></a>

### Programmatic DMP

Triplelift provides audience and contextual targeting via the integration of a Programmatic DMP tag. Please reach out to your Triplelift representative to discuss specifics of the integration.

#### Requirements

- Prebid v7.1.0 or later
- In Prebid's `bidderSettings`, the `storageAllowed` parameter must be set to **true**. In Prebid v7.0 and later, `storageAllowed` defaults to false, so you will need to explicitly set this value to true.

{% include dev-docs/storageAllowed.md %}

```javascript
        pbjs.bidderSettings = {
            triplelift: {
                storageAllowed: true
            }
        }
```

- The Programmatic DMP **tag** must be included at the top of every webpage in order to collect audience and contextual information on the respective page.
- The Programmatic DMP **tag** should be as high up in `<head>` as possible.
