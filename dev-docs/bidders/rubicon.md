---
layout: bidder
title: Rubicon Project
description: Rubicon Project Prebid Bidder Adaptor
hide: true
biddercode: rubicon
biddercode_longer_than_12: false
gdpr_supported: true
media_types: video
userIds: unifiedId/tradedesk
---


### Note:
The Rubicon Project adapter requires setup and approval from the Rubicon Project team, even for existing Rubicon Project publishers. Please reach out to your account team or globalsupport@rubiconproject.com for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name         | Scope              | Description                                                                                                                 | Example                                                                             | Type             |
|-------------|---------|--------------------|-----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|------------------|
| `accountId`    | required           | The publisher account ID                                                                                                    | `'4934'`                                                                            | `string`         |
| `siteId`       | required           | The site ID                                                                                                                 | `'13945'`                                                                           | `string`         |
| `zoneId`       | required           | The zone ID                                                                                                                 | `'23948'`                                                                           | `string`         |
| `sizes`        | optional           | Array of Rubicon Project size IDs. If not specified, the system will try to convert from the AdUnit's mediaTypes.banner.sizes.        | `[15]`                                                                              | `Array<integer>` |
| `keywords`     | optional           | Array of page-specific keywords. May be referenced in Rubicon Project reports.                                              | `['travel', 'tourism']`                                                             | `Array<string>`  |
| `inventory`   | optional           | An object defining arbitrary key-value pairs concerning the page for use in targeting. The values must be arrays.           | `{"rating":["5-star"], "prodtype":["tech","mobile"]}`                               | `object`         |
| `visitor`      | optional           | An object defining arbitrary key-value pairs concerning the visitor for use in targeting. The values must be arrays.        | `{"ucat":["new"], "search":["iphone"]}`                                             | `object`         |
| `position`     | optional           | Set the page position. Valid values are "atf" and "btf".                                                                    | `'atf'`                                                                             | `string`         |
| `userId`       | optional           | Site-specific user ID may be reflected back in creatives for analysis. Note that userId needs to be the same for all slots. | `'12345abc'`                                                                        | `string`         |
| `floor`       | optional           | Sets the global floor -- no bids will be made under this value.                                                             | `0.50`                                                                              | `float`          |
| `latLong`     | optional           | Sets the latitude and longitude for the visitor (avail since PBJS 1.10)                                                                            | `[40.7608, 111.8910]`                                                               | `Array<float>`   |
| `video`       | required for video | Video targeting parameters. See the [video section below](#rubicon-video).                                                  | `{"language": "en"}` | `object`  |

<a name="rubicon-video"></a>

#### Video

The following video parameters are supported:

{: .table .table-bordered .table-striped }
| Name           | Scope              | Description                                                                                                                                                                                              | Example | Type      |
|----------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|-----------|
| `playerWidth`  | optional | Video player width in pixels. If not specified, takes width set in mediaTypes.video.playerSize                                                                                                                                                                             | `'640'` | `string`  |
| `playerHeight` | optional | Video player height in pixels. If not specified, takes height set in mediaTypes.video.playerSize                                                                                                                                                                            | `'360'` | `string`  |
| `size_id`      | optional |  Integer indicating the Rubicon Project video ad format ID. If not set, infers from mediaTypes.video.context | `201`   | `integer` |
| `language`     | recommended | Indicates the language of the content video, in ISO 639-1/alpha2. Highly recommended for successful monetization for pre-, mid-, and post-roll video ads. Not applicable for interstitial and outstream. | `'en'`  | `string`  |

{: .alert.alert-warning :}
For Prebid.js 2.5 and later, the Rubicon Project adapter for video requires more parameters in the AdUnit's `mediaTypes.video` definition than required for version 2.4 and earlier. 
We are requiring these parameters for publishers to fully declare their video inventory to be transparent to bidders, getting the best chance at a high value and technically compatible bid.
Specifically, we're requiring: `mimes`, `protocols`, `maxduration`, `linearity`, and `api`. See the example below.

Here's a video example for Prebid.js 2.5 or later:

```
var videoAdUnit = {
    code: 'myVideoAdUnit',
    mediaTypes: {
        video: {
            context: 'instream',
            playerSize: [640, 480],
            mimes: ['video/mp4', 'video/x-ms-wmv']
            protocols: [2,5],
            maxduration:30,
            linearity: 1,
            api: [2]
        }
    },
    bids: [{
        bidder: 'rubicon',
        params: {
            accountId: '7780',
            siteId: '87184',
            zoneId: '413290',
            video: {
                language: 'en'
            }
        }
    }]
};
```

This example adunit will also work Prebid.js 2.4 and earlier, but mimes, protocols, maxduration, linearity, and api are not required.

We recommend discussing video demand with your Rubicon Project account representative.

Lists of api, protocol, and linearity values are in the [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) documentation, copied here for convenience:

##### api

+ `1` : VPAID 1.0
+ `2` : VPAID 2.0
+ `3` : MRAID 1.0
+ `4` : ORMMA
+ `5` : MRAID 2.0
+ `6` : MRAID 3.0

##### linearity
+ `1` : Linear / In-Stream
+ `2` : Non-Linear / Overlay

##### protocols
+ `1` : VAST 1.0
+ `2` : VAST 2.0
+ `3` : VAST 3.0
+ `4` : VAST 1.0 Wrapper
+ `5` : VAST 2.0 Wrapper
+ `6` : VAST 3.0 Wrapper
+ `7` : VAST 4.0
+ `8` : VAST 4.0 Wrapper
+ `9` : DAAST 1.0
+ `10` : DAAST 1.0 Wrapper


#### Outstream Video

Rubicon Project supports outstream video with these restrictions:

* The publisher must [provide their own renderer](/dev-docs/show-outstream-video-ads.html#renderers).
* Rubicon Project does not make concurrent banner and video requests. The Rubicon adapter will send a video request if bids[].params.video is supplied, else a banner request will be made.

### Configuration

#### Single-Request

By default, the Rubicon Project adapter sends one request to rubiconproject.com for each AdUnit. For example, if there are 4 PBJS AdUnits defined on the page, you'll see 4 calls out to rubiconproject.com/fastlane.json.

As of PBJS 1.12, the Rubicon Project adapter supports `Single Request` mode, where all AdUnit requests are made in a single call to rubiconproject.com. To turn this feature on, call `setConfig`:
```
pbjs.setConfig({
   rubicon: {singleRequest: true}
});
```

### Notes

There can only be one siteId and zoneId in an AdUnit bid. To get bids on multiple sitesIds or zoneIds, just add more 'rubicon' entries in the bids array.
