---
layout: bidder
title: Goldbach
description: Prebid Goldbach Bidder Adaptor
biddercode: goldbach
media_types: banner, video, native
gdpr_supported: true
prebid_member: true
userIds: criteo, unifiedId, netId, identityLink, uid2
schain_supported: true
coppa_supported: true
usp_supported: true
getFloor: true
pbjs: true
pbs: true
sidebarType: 1
---

### Table of Contents

- [Table of Contents](#table-of-contents)
  - [Bid Params](#bid-params)
  - [Video Object](#video-object)
  - [User Object](#user-object)
  - [App Object](#app-object)
  - [Custom Targeting keys](#custom-targeting-keys)
  - [Passing Keys Without Values](#passing-keys-without-values)
  - [User Sync in AMP](#user-sync-in-amp)
  - [Mobile App Display Manager Version](#mobile-app-display-manager-version)
  - [Debug Auction](#debug-auction)

<a name="godlbach-bid-params"></a>

{: .alert.alert-danger :}
All Goldbach (Xandr) placements included in a single call to `requestBids` must belong to the same parent Publisher.  If placements from two different publishers are included in the call, the Goldbach bidder will not return any demand for those placements. <br />
*Note: This requirement does not apply to adapters that are [aliasing](/dev-docs/publisher-api-reference/aliasBidder.html) the Goldbach adapter.*

#### Bid Params

{: .table .table-bordered .table-striped }
| Name                | Scope    | Description                                                                                                                                                                   | Example                                               | Type             |
|---------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|------------------|
| `placementId`       | required | The placement ID from Goldbach.  You may identify a placement using the `invCode` and `member` instead of a placement ID. The `placementID` parameter can be either a `string` or `integer` for Prebid.js, however `integer` is preferred. Legacy code can retain the `string` value. **Prebid Server requires an integer value.**                                                    | `234234`                                            | `integer`         |
| `member`            | optional | The member ID  from Goldbach. Must be used with `invCode`.                                                                                                                    | `'12345'`                                             | `string`         |
| `invCode`           | optional | The inventory code from Goldbach. Must be used with `member`.                                                                                                                 | `'abc123'`                                            | `string`         |
| `publisherId`       | optional | The publisher ID from Goldbach. It is used by the Goldbach end point to identify the publisher when `placementId` is not provided and `invCode` goes wrong. The `publisherId` parameter can be either a `string` or `integer` for Prebid.js, however `integer` is preferred.                                                                                                                    | `12345`                                             | `integer`         |
| `frameworks`        | optional | Array of integers listing API frameworks for Banner supported by the publisher. | `integer` |
| `user`              | optional | Object that specifies information about an external user. See [User Object](#godlbach-user-object) for details.                                                               | `user: { age: 25, gender: 0, dnt: true}`              | `object`         |
| `allowSmallerSizes` | optional | If `true`, ads smaller than the values in your ad unit's `sizes` array will be allowed to serve. Defaults to `false`.                                                         | `true`                                                | `boolean`        |
| `usePaymentRule` (PBJS) or `use_pmt_rule` (PBS)    | optional | If `true`, Xandr will return net price to Prebid.js after publisher payment rules have been applied.                                                                       | `true`                                                | `boolean`        |
| `keywords`          | optional | A set of key-value pairs applied to all ad slots on the page.  Mapped to [buy-side segment targeting](https://monetize.xandr.com/docs/segment-targeting) (login required). Values can be empty. See [Passing Keys Without Values](#godlbach-no-value) below for examples. Note that to use keyword with the Prebid Server adapter, that feature must be enabled for your account by an Goldbach account manager. | `keywords: { genre: ['rock', 'pop'] }`                | `object`         |
| `video`             | optional | Object containing video targeting parameters.  See [Video Object](#godlbach-video-object) for details.                                                                        | `video: { playback_method: ['auto_play_sound_off'] }` | `object`         |
| `app`               | optional | Object containing mobile app parameters.  See the [App Object](#godlbach-app-object) for details.                                                                      | `app : { id: 'app-id'}`                               | `object`         |
| `reserve`           | optional | Sets a floor price for the bid that is returned. If floors have been configured in the Goldbach Console, those settings will override what is configured here unless 'Reserve Price Override' is checked. See [Xandr docs](https://docs.xandr.com/bundle/monetize_monetize-standard/page/topics/create-a-floor-rule.html)                | `0.90`                                                | `float`          |
| `position`          | optional | Identify the placement as above or below the fold.  Allowed values: Unknown: `unknown`; Above the fold: `above`; Below the fold: `below`                                      | `'above'`                                               | `string`        |
| `trafficSourceCode` | optional | Specifies the third-party source of this impression.                                                                                                                          | `'my_traffic_source'`                                 | `string`         |
| `supplyType`        | optional | Indicates the type of supply for this placement. Possible values are `web`, `mobile_web`, `mobile_app`                                                                        | `'web'`                                               | `string`         |
| `supplyType`        | optional | Indicates the type of supply for this placement. Possible values are `web`, `mobile_web`, `mobile_app`                                                                        | `'web'`                                               | `string`         |
| `pubClick`          | optional | Specifies a publisher-supplied URL for third-party click tracking. This is just a placeholder into which the publisher can insert their own click tracker. This parameter should be used for an unencoded tracker. This parameter is expected to be the last parameter in the URL. Please note that the click tracker placed in this parameter will only fire if the creative winning the auction is using Goldbach click tracking properly.                                  | `'http://click.adserver.com/'`                        | `string`         |
| `extInvCode`        | optional | Specifies predefined value passed on the query string that can be used in reporting. The value must be entered into the system before it is logged.                           | `'10039'`                                             | `string`         |
| `externalImpId`     | optional | Specifies the unique identifier of an externally generated auction.                                                                                                           | `'bacbab02626452b097f6030b3c89ac05'`                  | `string`         |
| `generate_ad_pod_id`| optional | Signal to Goldbach to split impressions by ad pod and add unique ad pod id to each request. Specific to long form video endpoint only. Supported by Prebid Server, not Prebid JS.  | `true`                                                | `boolean`        |

<a name="godlbach-video-object"></a>

#### Video Object

{: .table .table-bordered .table-striped }
| Name              | Description                                                                                                                                                                                                                                  | Type             |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| `minduration` | Integer that defines the minimum video ad duration in seconds. | `integer` |
| `maxduration` | Integer that defines the maximum video ad duration in seconds. | `integer` |
|`context` | A string that indicates the type of video ad requested.  Allowed values: `"pre_roll"`; `"mid_roll"`; `"post_roll"`; `"outstream"`. | `string` |
| `skippable` | Boolean which, if `true`, means the user can click a button to skip the video ad.  Defaults to `false`. | `boolean` |
|`skipoffset`| Integer that defines the number of seconds until an ad can be skipped.  Assumes `skippable` setting was set to `true`. | `integer` |
| `playback_method` | A string that sets the playback method supported by the publisher.  Allowed values: `"auto_play_sound_on"`; `"auto_play_sound_off"`; `"click_to_play"`; `"mouse_over"`; `"auto_play_sound_unknown"`. | `string` |
| `frameworks` | Array of integers listing API frameworks supported by the publisher.  Allowed values: None: `0`; VPAID 1.0: `1`; VPAID 2.0: `2`; MRAID 1.0: `3`; MRAID 2.0: `4`; ORMMA: `5`; OMID 1.0 `6`. | `Array<integer>` |

<a name="godlbach-user-object"></a>

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

<a name="godlbach-app-object"></a>

#### App Object

Goldbach supports using prebid within a mobile app's webview. If you are interested in using an SDK, please see [Prebid Mobile]({{site.baseurl}}/prebid-mobile/prebid-mobile.html) instead.

{: .table .table-bordered .table-striped }
| Name              | Description                                                                                                                     | Example                                                                  | Type             |
|-------------------|---------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|------------------|
| `id`              | The App ID.                                                                                                                     | `'B1O2W3M4AN.com.prebid.webview'`                                        | `string`         |
| `device_id`       | Object that contains the advertising identifiers of the user (`idfa`, `aaid`, `md5udid`, `sha1udid`, or `windowsadid`).         | `{ aaid: "38400000-8cf0-11bd-b23e-10b96e40000d" }`                       | `object`         |
| `geo`             | Object that contains the latitude (`lat`) and longitude (`lng`) of the user.                                                    | `{ lat: 40.0964439, lng: -75.3009142 }`                                  | `object`         |

<a name="custom-targeting-keys"></a>

#### Custom Targeting keys

Goldbach returns custom keys that can be sent to the adserver through bidderSettings: buyerMemberId, dealPriority, and dealCode. The following snippet demonstrates how to add these custom keys as key-value pairs.

```javascript
pbjs.bidderSettings = {
  godlbach: {
    adserverTargeting: [
      {
        key: "apn_buyer_memberid", // Use key configured in your adserver
        val: function(bidResponse) {
          return bidResponse.appnexus.buyerMemberId;
        }
      },
      {
        key: "apn_prio", // Use key configured in your adserver
        val: function(bidResponse) {
          return bidResponse.appnexus.dealPriority;
        }
      }, {
        key: "apn_dealcode", // Use key configured in your adserver
        val: function(bidResponse) {
          return bidResponse.appnexus.dealCode;
        }
      }
    ]
  }
}
```

<a name="godlbach-no-value"></a>

#### Passing Keys Without Values

It's possible to use the `keywords` parameter to define keys that do not have any associated values. Keys with empty values can be created in Prebid.js and can also be sent through Prebid Server to Goldbach. The following are examples of sending keys with empty values:


```javascript
keywords: {
  myKeyword: '',
  myOtherKeyword: ['']
}
```

The preceding example passes the key `myKeyword` with an empty value. The key `myOtherKeyword` contains an empty value array.

You can define keys with values and without values in the same `keywords` definition. In this next example, we've defined the key `color` with an array of values: `red`, `blue`, and `green`. We've followed that with the key `otherKeyword` with an empty value array.

```javascript
keywords: {
  color: ['red', 'blue', 'green'],
  otherKeyword: ['']
}
```

<a name="godlbach-amp"></a>

#### User Sync in AMP

If you are syncing user id's with Prebid Server and are using Goldbach's managed service, see [AMP Implementation Guide cookie-sync instructions](/dev-docs/show-prebid-ads-on-amp-pages.html#user-sync) for details.

<a name="godlbach-debug-auction"></a>

#### Mobile App Display Manager Version

The Goldbach endpoint expects `imp.displaymanagerver` to be populated for mobile app sources
requests, however not all SDKs will populate this field. If the `imp.displaymanagerver` field
is not supplied for an `imp`, but `request.app.ext.prebid.source`
and `request.app.ext.prebid.version` are supplied, the adapter will fill in a value for
`diplaymanagerver`. It will concatenate the two `app` fields as `<source>-<version>` fo fill in
the empty `displaymanagerver` before sending the request to Goldbach.

#### Debug Auction

{: .alert.alert-danger :}
Enabling the Goldbach Debug Auction feature should only be done for diagnosing the Goldbach auction. Do not enable this feature in a production setting where it may impact users.

To understand what is happening behind the scenes during an auction, you can enable a debug auction by adding an `apn_prebid_debug` cookie with a JSON string. For example:

```javascript
{ "enabled": true, "dongle": "QWERTY", "debug_timeout": 1000, "member_id": 958 }
```

To view the results of the debug auction, add the `pbjs_debug=true` query string parameter and open your browser's developer console.

{: .table .table-bordered .table-striped }
| Name              | Description                                                     | Example               | Type             |
|-------------------|-----------------------------------------------------------------|-----------------------|------------------|
| `enabled`         | Toggle the debug auction to occur                               | `true`                | `boolean`        |
| `dongle`          | Your account's unique debug password.                           | `QWERTY`              | `string`         |
| `member_id`       | The ID of the member running the debug auction                  | `958`                 | `integer`        |
| `debug_timeout`   | The timeout for the debug auction results to be returned        | `3000`                | `integer`        |
