---
layout: bidder
title: Rubicon Project
description: Rubicon Project Prebid Bidder Adaptor
hide: true
biddercode: rubicon
biddercode_longer_than_12: false
gdpr_supported: true
userIds: unifiedId/tradedesk
---


### Note:
The Rubicon Project adapter requires setup and approval from the Rubicon Project team, even for existing Rubicon Project publishers. Please reach out to your account team or globalsupport@rubiconproject.com for more information.

### bid params

{: .table .table-bordered .table-striped }
| Name         | Scope              | Description                                                                                                                 | Example                                                                             | Type             |
|-------------|---------|--------------------|-----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|------------------|
| `accountId`    | required           | The publisher account ID                                                                                                    | `'4934'`                                                                            | `string`         |
| `siteId`       | required           | The site ID                                                                                                                 | `'13945'`                                                                           | `string`         |
| `zoneId`       | required           | The zone ID                                                                                                                 | `'23948'`                                                                           | `string`         |
| `sizes`        | optional           | Array of Rubicon Project size IDs. If not specified, the system will try to convert from the AdUnit's mediaTypes.banner.sizes.        | `[15]`                                                                              | `Array<integer>` |
| `keywords`     | optional           | Array of page-specific keywords. May be referenced in Rubicon Project reports.                                              | `['travel', 'tourism']`                                                             | `Array<string>`  |
| `inventory`   | optional           | An object defining arbitrary key-value pairs concerning the page for use in targeting. The values must be arrays.           | `{'rating':['5-star'], 'prodtype':['tech','mobile']}`                               | `object`         |
| `visitor`      | optional           | An object defining arbitrary key-value pairs concerning the visitor for use in targeting. The values must be arrays.        | `{'ucat':['new'], 'search':['iphone']}`                                             | `object`         |
| `position`     | optional           | Set the page position. Valid values are "atf" and "btf".                                                                    | `'atf'`                                                                             | `string`         |
| `userId`       | optional           | Site-specific user ID may be reflected back in creatives for analysis. Note that userId needs to be the same for all slots. | `'12345abc'`                                                                        | `string`         |
| `floor`       | optional           | Sets the global floor -- no bids will be made under this value.                                                             | `0.50`                                                                              | `float`          |
| `latLong`     | optional           | Sets the latitude and longitude for the visitor (avail since PBJS 1.10)                                                                            | `[40.7608, 111.8910]`                                                               | `Array<float>`   |
| `video`       | required for video | Video targeting parameters. See the [video section below](#rubicon-video).                                                  | `{'language': 'en', 'playerHeight': '360', 'playerWidth': '640', 'size_id': '201'}` | `object`         |

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
