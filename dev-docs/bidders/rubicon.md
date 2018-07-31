---
layout: bidder
title: Rubicon
description: Prebid Rubicon Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: rubicon
biddercode_longer_than_12: false
prebid_1_0_supported : true
gdpr_supported: true
media_types: video
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
| `sizes`        | optional           | Array of Rubicon Project size IDs. If not specified, the system will try to convert from bid.sizes.                         | `[15]`                                                                              | `Array<integer>` |
| `keywords`     | optional           | Array of page-specific keywords. May be referenced in Rubicon Project reports.                                              | `['travel', 'tourism']`                                                             | `Array<string>`  |
| `inventory` |   | optional           | An object defining arbitrary key-value pairs concerning the page for use in targeting. The values must be arrays.           | `{'rating':['5-star'], 'prodtype':['tech','mobile']}`                               | `object`         |
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
| `playerWidth`  | required for video | Video player width in pixels                                                                                                                                                                             | `'640'` | `string`  |
| `playerHeight` | required for video | Video player height in pixels                                                                                                                                                                            | `'360'` | `string`  |
| `size_id`      | required for video | Integer indicating the video ad format ID:<br/><br/>201: Pre-Roll<br/>202: Interstitial <br/>204: Mid-Roll <br/>205: Post-Roll <br/>207: Vertical Video                                                  | `201`   | `integer` |
| `language`     | required for video | Indicates the language of the content video, in ISO 639-1/alpha2. Highly recommended for successful monetization for pre-, mid-, and post-roll video ads. Not applicable for interstitial and outstream. | `'en'`  | `string`  |
| `aeParams`     | optional           | Optional parameter that enables overriding of pre-defined video options in account setup. Some common samples are shown below. Additional options are available by contacting your account team.         |         | `object`  |

#### aeParams

{: .table .table-bordered .table-striped }
| Name                                     | Scope    | Description                                                                                                                                      | Example | Type      |
|------------------------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------|---------|-----------|
| `aeParams.p_aso.video.ext.skip`          | optional | Defines whether the user can skip the ad. Defaults to non-skippable. Set to 1 to indicate skippable.                                             | `1`     | `integer` |
| `aeParams.p_aso.video.ext.skipdelay`     | optional | If the ad is skippable, this is an integer duration (in seconds) after which the user has the option to skip the ad. Default is 0.               | `15`    | `integer` |
| `aeParams.p_aso.video.ext.maxbitrate`    | optional | Integer indicating maximum bitrate of video ad in kbps.                                                                                          | `1200`  | `integer` |
| `aeParams.p_aso.video.ext.minbitrate`    | optional | Integer indicating minimum bitrate of video ad in kbps.                                                                                          | `400`   | `integer` |
| `aeParams.p_aso.video.ext.boxingallowed` | optional | Integer indicating whether the seller permits letterboxing. The default is "1", -- letterboxing is permitted. "0" indicates it is not permitted. | `1`     | `integer` |

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
