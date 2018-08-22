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

**Table of Contents**

- [Bid params](#appnexus-bid-params)
- [Banner Ads](#appnexus-Banner)
- [Video Ads](#appnexus-Video)
- [Native Ads](#appnexus-Native)
- [Multi-Format Ads](#appnexus-Multi-Format)
- [Mobile App](#appnexus-Mobile-App)

<a name="appnexus-bid-params" />

### Bid params

{: .table .table-bordered .table-striped }
| Name             | Scope    | Description                                                                                                                                                                                                          | Example           | Type             |
|------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|------------------|
| `placementId`    | required | The placement ID from AppNexus.  You may identify a placement using the `invCode` and `member` instead of a placement ID.                                                                                            | `234234`          | `int`            |
| `"arbitraryKey"` | optional | This key can be *any publisher-defined string*. The value (also a string) maps to a querystring segment for enhanced buy-side targeting. Multiple key-value pairs can be added as shown [below](#appnexus-pub-keys). | `'genre': 'rock'` | `keyValue`       |
| `invCode`        | optional | The inventory code from AppNexus. Must be used with `member`.                                                                                                                                                        | `'abc123'`        | `string`         |
| `member`         | optional | The member ID  from AppNexus. Must be used with `invCode`.                                                                                                                                                           | `'12345'`         | `string`         |
| `reserve`        | optional | Sets a floor price for the bid that is returned.                                                                                                                                                                     | `0.90`            | `float`          |

{: .alert.alert-danger :}
All AppNexus placements included in a single call to `requestBids` must belong to the same publisher object.  If placements from two different publishers are included in the call, the AppNexus bidder may not return any demand for those placements. <br />
*Note: This requirement does not apply to adapters that are [aliasing]({{site.baseurl}}/dev-docs/publisher-api-reference.html#module_pbjs.aliasBidder) the AppNexus adapter.*


### Bid Params

{: .table .table-bordered .table-striped }
| Name                | Scope    | Description                                                                                                                                                                   | Example                                               | Type      |
|---------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|-----------|
| `placementId`       | required | The placement ID from AppNexus.  You may identify a placement using the `invCode` and `member` instead of a placement ID.                                                     | `'234234'`                                            | `string`  |
| `allowSmallerSizes` | optional | If `true`, ads smaller than the values in your ad unit's `sizes` array will be allowed to serve. Defaults to `false`.                                                         | `true`                                                | `boolean` |
| `keywords`          | optional | A set of key-value pairs applied to all ad slots on the page.  Mapped to [query string segments for buy-side targeting](https://wiki.appnexus.com/x/7oCzAQ) (login required). | `{ genre: ['rock', 'pop'] }`                          | `object`  |
| `video`             | optional | Video targeting parameters.  See the [video section below](#appnexus-Video) for details.                                                                                      | `{ playback_method: ['auto_play_sound_off'] }`        | `object`  |
| `app`               | optional | Mobile App parameters.  See the [mobile app section below](#appnexus-Mobile-App) for details.                                                                                 | `{ app : { id: 'app-id'} }`                           | `object`  |
| `invCode`           | optional | The inventory code from AppNexus. Must be used with `member`.                                                                                                                 | `'abc123'`                                            | `string`  |
| `member`            | optional | The member ID  from AppNexus. Must be used with `invCode`.                                                                                                                    | `'12345'`                                             | `string`  |
| `reserve`           | optional | Sets a floor price for the bid that is returned. If floors have been configured in the AppNexus Console, those settings will override what is configured here.                | `0.90`                                                | `float`   |


<a name="appnexus-Banner" />

#### Banner Ads

AppNexus supports the banner features described in:

- [The `adUnit` banner documentation]({{site.baseurl}}/dev-docs/adunit-reference.html#adUnit-banner-example)
- [Getting Started for Developers]({{site.baseurl}}/dev-docs/getting-started.html)

<a name="appnexus-Video" />

#### Video Ads

AppNexus supports the video features described in:

- [The `adUnit` video documentation]({{site.baseurl}}/dev-docs/adunit-reference.html#adUnit-video-example)
- [Show Video Ads]({{site.baseurl}}/dev-docs/show-video-with-a-dfp-video-tag.html)
- [Show Outstream Video Ads]({{site.baseurl}}/dev-docs/show-outstream-video-ads.html)

The Following video-related parameters are supported under the `video` parameter

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

<a name="appnexus-Native" />

#### Native Ads

AppNexus supports the native features described in:

- [The `adUnit` native documentation]({{site.baseurl}}/dev-docs/adunit-reference.html#adUnit-native-example)
- [Show Native Ads]({{site.baseurl}}/dev-docs/show-native-ads.html)

<a name="appnexus-Multi-Format" />

### Multi-Format

AppNexus supports the multi-format ad unit features described in:

- [The `adUnit` multi-format documentation]({{site.baseurl}}/dev-docs/adunit-reference.html#adUnit-multi-format-example)
- [Show Multi-Format Ads]({{site.baseurl}}/dev-docs/show-multi-format-ads.html)

<a name="appnexus-Mobile-App" />

### Mobile App

AppNexus supports using prebid within a mobile app's webview. If you are interested in using an SDK, please see [Prebid Mobile]({{site.baseurl}}/prebid-mobile/prebid-mobile.html) instead.

The Following mobile app related parameters are supported under the `app` parameter

{: .table .table-bordered .table-striped }
| Name              | Description                                                                                                                     | Example                                                                  | Type             |
|-------------------|---------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|------------------|
| `id`              | The App ID                                                                                                                      | `app: { id: "B1O2W3M4AN.com.prebid.webview" }`.                          | `string`         |
| `device_id`       | Object that contains the advertising identifiers of the user (`idfa`, `aaid`, `md5udid`, `sha1udid`, or `windowsadid`).         | `app: { device_id: { aaid: "38400000-8cf0-11bd-b23e-10b96e40000d" }}`    | `object`         |
| `geo`             | Object that contains the latitude (`lat`) and longitude (`lng`) of the user.                                                    | `app: { geo: { lat: 40.0964439, lng: -75.3009142 }}`                     | `object`         |

### Upgrading from Prebid 0.x
As part of the transition to Prebid 1.0, the existing AppNexus AST (legacy) adapter has become the standard and only AppNexus adapter (and renamed to "AppNexus"). You may continue to use the existing `appnexus` or `appnexusAst` bidder code without the need to re-create ad server line items/key value targeting.

From a developer's perspective, the primary change needed is that keywords must be passed using the `keywords` parameter instead of an `"arbitraryKey"` if they were not already being passing in this manner.
