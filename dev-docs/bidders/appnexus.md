---
layout: bidder
title: AppNexus
description: Prebid AppNexus Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
biddercode: appnexus
biddercode_longer_than_12: false
hide: true
prebid_1_0_supported : true
media_types: banner, video, native
gdpr_supported: true
---

### Table of Contents

- [Bid Params](#appnexus-bid-params)
- [Video Object](#appnexus-video-object)
- [User Object](#appnexus-user-object)
- [App Object](#appnexus-app-object)

<a name="appnexus-bid-params" />

{: .alert.alert-danger :}
All AppNexus placements included in a single call to `requestBids` must belong to the same parent Publisher.  If placements from two different publishers are included in the call, the AppNexus bidder will not return any demand for those placements. <br />
*Note: This requirement does not apply to adapters that are [aliasing]({{site.baseurl}}/dev-docs/publisher-api-reference.html#module_pbjs.aliasBidder) the AppNexus adapter.*

#### Bid Params

{: .table .table-bordered .table-striped }
| Name                | Scope    | Description                                                                                                                                                                   | Example                                               | Type             |
|---------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|------------------|
| `placementId`       | required | The placement ID from AppNexus.  You may identify a placement using the `invCode` and `member` instead of a placement ID.                                                     | `'234234'`                                            | `string`         |
| `member`            | optional | The member ID  from AppNexus. Must be used with `invCode`.                                                                                                                    | `'12345'`                                             | `string`         |
| `invCode`           | optional | The inventory code from AppNexus. Must be used with `member`.                                                                                                                 | `'abc123'`                                            | `string`         |
| `user`              | optional | Object that specifies information about an external user. See [User Object](#appnexus-user-object) for details.                                                               | `user: { age: 25, gender: 0, dnt: true}`              | `object`         |
| `allowSmallerSizes` | optional | If `true`, ads smaller than the values in your ad unit's `sizes` array will be allowed to serve. Defaults to `false`.                                                         | `true`                                                | `boolean`        |
| `usePaymentRule`    | optional | If `true`, Appnexus will return net price to Prebid.js after publisher payment rules have been applied.                                                                       | `true`                                                | `boolean`        |
| `keywords`          | optional | A set of key-value pairs applied to all ad slots on the page.  Mapped to [query string segments for buy-side targeting](https://wiki.appnexus.com/x/7oCzAQ) (login required). | `keywords: { genre: ['rock', 'pop'] }`                | `object`         |
| `video`             | optional | Object containing video targeting parameters.  See [Video Object](#appnexus-video-object) for details.                                                                        | `video: { playback_method: ['auto_play_sound_off'] }` | `object`         |
| `app`               | optional | Object containing mobile app parameters.  See the [App Object](#appnexus-app-object) for details.                                                                      | `app : { id: 'app-id'}`                               | `object`         |
| `reserve`           | optional | Sets a floor price for the bid that is returned. If floors have been configured in the AppNexus Console, those settings will override what is configured here.                | `0.90`                                                | `float`          |
| `position`          | optional | Identify the placement as above or below the fold.  Allowed values: Unknown: `0`; Above the fold: `1`; Below the fold: `2`                                                    | `1`                                                   | `integer`        |
| `trafficSourceCode` | optional | Specifies the third-party source of this impression.                                                                                                                          | `'my_traffic_source'`                                 | `string`         |
| `supplyType`        | optional | Indicates the type of supply for this placement. Possible values are `web`, `mobile_web`, `mobile_app`                                                                        | `'web'`                                               | `string`         |
| `pubClick`          | optional | Specifies a publisher-supplied URL for third-party click tracking. This is just a placeholder into which the publisher can insert their own click tracker. This parameter should be used for an unencoded tracker. This parameter is expected to be the last parameter in the URL. Please note that the click tracker placed in this parameter will only fire if the creative winning the auction is using AppNexus click tracking properly.                                  | `'http://click.adserver.com/'`                        | `string`         |
| `extInvCode`        | optional | Specifies predefined value passed on the query string that can be used in reporting. The value must be entered into the system before it is logged.                           | `'10039'`                                             | `string`         |
| `externalImpId`     | optional | Specifies the unique identifier of an externally generated auction.                                                                                                           | `'bacbab02626452b097f6030b3c89ac05'`                  | `string`         |

<a name="appnexus-video-object" />

#### Video Object

{: .table .table-bordered .table-striped }
| Name              | Description                                                                                                                                                                                                                                  | Type             |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| `mimes`           | Array of strings listing the content MIME types supported, e.g., `["video/x-flv", "video/x-ms-wmv"]`.                                                                                                                                        | `Array<string>`  |
| `minduration`     | Integer that defines the minimum video ad duration in seconds.                                                                                                                                                                               | `integer`        |
| `maxduration`     | Integer that defines the maximum video ad duration in seconds.                                                                                                                                                                               | `integer`        |
| `startdelay`      | Integer that determines whether to show the ad before, during, or after video content.  If > 0, position is mid-roll and value indicates start delay, in seconds. Allowed values: Pre-roll: `0` (default); Mid-roll: `-1` ; Post-roll: `-2`. | `integer`        |
| `skippable`       | Boolean which, if `true`, means the user can click a button to skip the video ad.  Defaults to `false`.                                                                                                                                      | `boolean`        |
| `playback_method` | Array of strings listing playback methods supported by the publisher.  Allowed values: `"auto_play_sound_on"`; `"auto_play_sound_off"`; `"click_to_play"`; `"mouseover"`; `"auto_play_sound_unknown"`.                                       | `Array<string>`  |
| `frameworks`      | Array of integers listing API frameworks supported by the publisher. Allowed values: None: `0`; VPAID 1.0: `1`; VPAID 2.0: `2`; MRAID 1.0: `3`; ORMMA: `4`; MRAID 2.0: `5`.                                                                  | `Array<integer>` |

<a name="appnexus-user-object" />

#### User Object

{: .table .table-bordered .table-striped }
| Name              | Description                                                                                                                     | Example                                                                  | Type             |
|-------------------|---------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|------------------|
| `age`             | The age of the user.                                                                                                            | `35`                                                                     | `integer`        |
| `externalUid`     | Specifies a string that corresponds to an external user ID for this user.                                                       | `'1234567890abcdefg'`                                                    | `string`         |
| `segments`        | Specifies the segments to which the user belongs.                                                                               | `[1, 2]`                                                                 | `Array<integer>` |
| `gender`          | Specifies the gender of the user.  Allowed values: Unknown: `0`; Male: `1`; Female: `2`                                         | `1`                                                                      | `integer`        |
| `dnt`             | Do not track flag.  Indicates if tracking cookies should be disabled for this auction                                           | `true`                                                                   | `boolean`        |
| `language`        | Two-letter ANSI code for this user's language.                                                                                  | `EN`                                                                     | `string`         |


<a name="appnexus-app-object" />

#### App Object

AppNexus supports using prebid within a mobile app's webview. If you are interested in using an SDK, please see [Prebid Mobile]({{site.baseurl}}/prebid-mobile/prebid-mobile.html) instead.

{: .table .table-bordered .table-striped }
| Name              | Description                                                                                                                     | Example                                                                  | Type             |
|-------------------|---------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|------------------|
| `id`              | The App ID.                                                                                                                     | `'B1O2W3M4AN.com.prebid.webview'`                                        | `string`         |
| `device_id`       | Object that contains the advertising identifiers of the user (`idfa`, `aaid`, `md5udid`, `sha1udid`, or `windowsadid`).         | `{ aaid: "38400000-8cf0-11bd-b23e-10b96e40000d" }`                       | `object`         |
| `geo`             | Object that contains the latitude (`lat`) and longitude (`lng`) of the user.                                                    | `{ lat: 40.0964439, lng: -75.3009142 }`                                  | `object`         |
