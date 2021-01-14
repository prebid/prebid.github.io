---
layout: bidder
title: Rubicon Project
description: Rubicon Project Prebid Bidder Adaptor
biddercode: rubicon
gdpr_supported: true
tcf2_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
getFloor: true
media_types: video
userIds: all
prebid_member: true
safeframes_ok: true
bidder_supports_deals: true
pbjs: true
pbs: true
pbs_app_supported: true
gvl_id: 52
---

### Registration

For both Prebid.js and Prebid Server, the Rubicon Project adapter requires setup and approval from the Magnite team, even for existing accounts. Please reach out to your account team or globalsupport@magnite.com for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name         | Scope              | Description                                                                                                                 | Example                                                                             | Type             |
|-------------|---------|--------------------|-----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|------------------|
| `accountId`    | required           | The publisher account ID                                                                                                    | `'4934'`                                                                            | `string`         |
| `siteId`       | required           | The site ID                                                                                                                 | `'13945'`                                                                           | `string`         |
| `zoneId`       | required           | The zone ID                                                                                                                 | `'23948'`                                                                           | `string`         |
| `sizes`        | optional           | Array of Rubicon Project size IDs. If not specified, the system will try to convert from the AdUnit's mediaTypes.banner.sizes.        | `[15]`                                                                              | `Array<integer>` |
| `position`     | optional           | Set the page position. Valid values are "atf" and "btf".                                                                    | `'atf'`                                                                             | `string`         |
| `userId`       | optional           | Site-specific user ID may be reflected back in creatives for analysis. Note that userId needs to be the same for all slots. | `'12345abc'`                                                                        | `string`         |
| `floor`       | optional           | Sets the global floor -- no bids will be made under this value.                                                             | `0.50`                                                                              | `float`          |
| `latLong`     | optional           | Sets the latitude and longitude for the visitor (avail since PBJS 1.10)                                                                            | `[40.7608, 111.8910]`                                                               | `Array<float>`   |
| `inventory`   | optional           |  Please consider using the [First Party Data feature](/features/firstPartyData.html), e.g. AdUnit.fpd.context.data.ATTR. This parameter allows the definition of an object defining arbitrary key-value pairs concerning the page for use in targeting. The values must be arrays.           | `{"rating":["5-star"], "prodtype":["tech","mobile"]}`                               | `object`         |
| `visitor`      | optional           | Please consider using the [First Party Data feature](/features/firstPartyData.html), e.g. AdUnit.fpd.user.data.ATTR. This parameter allows the definition of an object defining arbitrary key-value pairs concerning the visitor for use in targeting. The values must be arrays. | `{"ucat":["new"], "search":["iphone"]}`                                             | `object`         |
| `keywords`     | optional           | Deprecated - please use the [First Party Data feature](/features/firstPartyData.html), e.g. AdUnit.fpd.context.data.keywords. This is a legacy parameter that only works for client-side display. To get video or server-side reporting, please use First Party data or the inventory/visitor parameters.  | `['travel', 'tourism']`                                                             | `Array<string>`  |
| `video`       | required for video | Video targeting parameters. See the [video section below](#rubicon-video).                                                  | `{"language": "en"}` | `object`  |

<a name="rubicon-video"></a>

#### Video

The following video parameters are supported:

{: .table .table-bordered .table-striped }
| Name           | Scope              | Description                                                                                                                                                                                              | Example | Type      |
|----------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|-----------|
| `playerWidth`  | optional | Video player width in pixels. If not specified, takes width set in mediaTypes.video.playerSize                                                                                                                                                                             | `'640'` | `string`  |
| `playerHeight` | optional | Video player height in pixels. If not specified, takes height set in mediaTypes.video.playerSize                                                                                                                                                                            | `'360'` | `string`  |
| `size_id`      | optional for Prebid.js, required for Prebid Server |  Integer indicating the Rubicon Project video ad format ID. If not set, Prebid.js can infer from mediaTypes.video.context | `201`   | `integer` |
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
            mimes: ['video/mp4', 'video/x-ms-wmv'] // you must review all video
            protocols: [2,3,5,6],                  // parameters to ensure validity
            api: [2],                              // for your player and DSPs
            maxduration:30,          
            linearity: 1
        }
    },
    bids: [{
        bidder: 'rubicon',                         // replace bidders
        params: {
            accountId: '7780',                     // and params
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

1) There can only be one siteId and zoneId in an AdUnit bid. To get bids on multiple sitesIds or zoneIds, just add more 'rubicon' entries in the bids array.

<a name="rubicon-revenue-type"></a>

2) Bids through the Rubicon Project Exchange are by default 'net'.  For certain use cases it is possible for Rubicon Project clients to define a bid as either 'net' or 'gross'.  In either case the Rubicon platform does not signal externally to other systems either bid state.  

For Prebid, the Rubicon Project bid adapter reports the revenue type as ‘gross’ by default before 2.35 and ‘net’ by default in 2.35 and later (as the vast majority of accounts are net and all new accounts are net). 

It’s important to note that what the Rubicon Prebid bid adapter reports is not directly related to the setting with the Rubicon Project exchange. If you are a publisher who has set your Rubicon exchange revenue type set to ‘gross’ and you'd like the Rubicon bid adapter to also report 'gross', you can change the 2.35+ default 'net' setting in Prebid.js with:

```
pbjs.setConfig({ rubicon: {netRevenue: false} });
```
