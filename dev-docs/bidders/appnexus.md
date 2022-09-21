---
layout: bidder
title: AppNexus
description: Prebid AppNexus Bidder Adaptor
biddercode: appnexus
media_types: banner, video, native
gdpr_supported: true
prebid_member: true
userIds: criteo, flocId, identityLink, netId, pubProvidedId, uid2, unifiedId,
schain_supported: true
coppa_supported: true
usp_supported: true
floors_supported: true
fpd_supported: true
pbjs: true
pbjs_version_notes: please avoid using v7.15 and v7.16
pbs: true
gvl_id: 32
---

### Disclosure:

This adapter is known to use an HTTP 1 endpoint. Header bidding often generates multiple requests to the same host and bidders are encouraged to change to HTTP 2 or above to help improve publisher page performance via multiplexing.

### Table of Contents

- [Bid Params](#appnexus-bid-params)
- [Video Object](#appnexus-video-object)
- [User Object](#appnexus-user-object)
- [App Object](#appnexus-app-object)
- [Custom Targeting keys](#custom-targeting-keys)
- [Auction Level Keywords](#appnexus-auction-keywords)
- [Passing Keys Without Values](#appnexus-no-value)
- [First Party Data](#appnexus-fpd)
- [User Sync in AMP](#appnexus-amp)
- [Debug Auction](#appnexus-debug-auction)

<a name="appnexus-bid-params" />

{: .alert.alert-danger :}
All AppNexus (Xandr) placements included in a single call to `requestBids` must belong to the same parent Publisher.  If placements from two different publishers are included in the call, the AppNexus bidder will not return any demand for those placements. <br />
*Note: This requirement does not apply to adapters that are [aliasing](/dev-docs/publisher-api-reference/aliasBidder.html) the AppNexus adapter.*

#### Bid Params

{: .table .table-bordered .table-striped }
| Name                | Scope    | Description                                                                                                                                                                   | Example                                               | Type             |
|---------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|------------------|
| `placement_id` (PBS) or `placementId` (PBJS)    | required | The placement ID from AppNexus.  You may identify a placement using the `invCode` and `member` instead of a placement ID. This parameter can be either a `string` or `integer` for Prebid.js, however `integer` is preferred. Legacy code can retain the `string` value. **Prebid Server requires an integer value.**                                                    | `234234`                                            | `integer`         |
| `member`                                        | optional | The member ID  from AppNexus. Must be used with `invCode`.                                                                                                                    | `'12345'`                                             | `string`         |
| `invCode`                                       | optional | The inventory code from AppNexus. Must be used with `member`.                                                                                                                 | `'abc123'`                                            | `string`         |
| `publisherId`                                   | optional | The publisher ID from AppNexus. It is used by the AppNexus end point to identify the publisher when placement id is not provided and `invCode` goes wrong. The `publisherId` parameter can be either a `string` or `integer` for Prebid.js, however `integer` is preferred.                                                                                                                    | `12345`                                             | `integer`         |
| `frameworks`                                    | optional | Array of integers listing API frameworks for Banner supported by the publisher. | `integer` |
| `user`                                          | optional | Object that specifies information about an external user. See [User Object](#appnexus-user-object) for details.                                                               | `user: { age: 25, gender: 0, dnt: true}`              | `object`         |
| `allowSmallerSizes`                             | optional | If `true`, ads smaller than the values in your ad unit's `sizes` array will be allowed to serve. Defaults to `false`.                                                         | `true`                                                | `boolean`        |
| `usePaymentRule` (PBJS) or `use_pmt_rule` (PBS) | optional | If `true`, Appnexus will return net price to Prebid.js after publisher payment rules have been applied.                                                                       | `true`                                                | `boolean`        |
| `keywords`                                      | optional | A set of key-value pairs applied to all ad slots on the page.  Mapped to [buy-side segment targeting](https://monetize.xandr.com/docs/segment-targeting) (login required). A maximum of 100 key/value pairs can be defined at the page level. Each tag can have up to 100 additional key/value pairs defined. Values can be empty. See [Passing Keys Without Values](#appnexus-no-value) below for examples. If you want to pass keywords for all adUnits, see [Auction Level Keywords](#appnexus-auction-keywords) for an example. Note that to use keyword with the Prebid Server adapter, that feature must be enabled for your account by an AppNexus account manager. | `keywords: { genre: ['rock', 'pop'] }`                | `object`         |
| `video`                                         | optional | Object containing video targeting parameters.  See [Video Object](#appnexus-video-object) for details.                                                                        | `video: { playback_method: ['auto_play_sound_off'] }` | `object`         |
| `app`                                           | optional | Object containing mobile app parameters.  See the [App Object](#appnexus-app-object) for details.                                                                      | `app : { id: 'app-id'}`                               | `object`         |
| `reserve`                                       | optional | Sets a floor price for the bid that is returned. If floors have been configured in the AppNexus Console, those settings will override what is configured here unless 'Reserve Price Override' is checked. See [Xandr docs](https://docs.xandr.com/bundle/monetize_monetize-standard/page/topics/create-a-floor-rule.html)                | `0.90`                                                | `float`          |
| `position`                                      | optional | Identify the placement as above or below the fold.  Allowed values: Unknown: `unknown`; Above the fold: `above`; Below the fold: `below`                                      | `'above'`                                               | `string`        |
| `trafficSourceCode`                             | optional | Specifies the third-party source of this impression.                                                                                                                          | `'my_traffic_source'`                                 | `string`         |
| `supplyType`                                    | optional | Indicates the type of supply for this placement. Possible values are `web`, `mobile_web`, `mobile_app`                                                                        | `'web'`                                               | `string`         |
| `supplyType`                                    | optional | Indicates the type of supply for this placement. Possible values are `web`, `mobile_web`, `mobile_app`                                                                        | `'web'`                                               | `string`         |
| `pubClick`                                      | optional | Specifies a publisher-supplied URL for third-party click tracking. This is just a placeholder into which the publisher can insert their own click tracker. This parameter should be used for an unencoded tracker. This parameter is expected to be the last parameter in the URL. Please note that the click tracker placed in this parameter will only fire if the creative winning the auction is using AppNexus click tracking properly.                                  | `'http://click.adserver.com/'`                        | `string`         |
| `extInvCode`                                    | optional | Specifies predefined value passed on the query string that can be used in reporting. The value must be entered into the system before it is logged.                           | `'10039'`                                             | `string`         |
| `externalImpId`                                 | optional | Specifies the unique identifier of an externally generated auction.                                                                                                           | `'bacbab02626452b097f6030b3c89ac05'`                  | `string`         |
| `generate_ad_pod_id`                            | optional | Signal to AppNexus to split impressions by ad pod and add unique ad pod id to each request. Specific to long form video endpoint only. Supported by Prebid Server, not Prebid JS.  | `true`                                                | `boolean`        |

<a name="appnexus-video-object" />

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

<a name="custom-targeting-keys" />

#### Custom Targeting keys

AppNexus returns custom keys that can be sent to the adserver through bidderSettings: buyerMemberId, dealPriority, and dealCode. The following snippet demonstrates how to add these custom keys as key-value pairs.

```
pbjs.bidderSettings = {
  appnexus: {
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

<a name="appnexus-auction-keywords" />

#### Auction Level Keywords

It's possible to pass a set of keywords for the whole request, rather than a particular adUnit.  Though they would apply to all adUnits (which include the appnexus bidder) in an auction, these keywords can work together with the bidder level keywords (if for example you want to have specific targeting for a particular adUnit).

Below is an example of how to define these auction level keywords for the appnexus bidder:
```
pbjs.setConfig({
  appnexusAuctionKeywords: {
    genre: ['classical', 'jazz'],
    instrument: 'piano'
  }
});
```

Like in the bidder.params.keywords, the values here can be empty.  Please see the section immediately below for more details.

<a name="appnexus-no-value" />

#### Passing Keys Without Values

It's possible to use the `keywords` parameter to define keys that do not have any associated values. Keys with empty values can be created in Prebid.js and can also be sent through Prebid Server to AppNexus. The following are examples of sending keys with empty values:


```
keywords: {
  myKeyword: '',
  myOtherKeyword: ['']
}
```

The preceding example passes the key `myKeyword` with an empty value. The key `myOtherKeyword` contains an empty value array.

You can define keys with values and without values in the same `keywords` definition. In this next example, we've defined the key `color` with an array of values: `red`, `blue`, and `green`. We've followed that with the key `otherKeyword` with an empty value array.

```
keywords: {
  color: ['red', 'blue', 'green'],
  otherKeyword: ['']
}
```

<a name="appnexus-fpd" />

#### First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html).

At this time however, the `appnexus` bidder only reads the First Party Data when using the Prebid Server and Prebid Server Premium endpoints.  The client-side version of the `appnexus` bidder does not use the values from the First Party Data fields.

PBS/PSP supports all first party data fields: site, user, segments, and imp-level first party data.


<a name="appnexus-amp" />

#### User Sync in AMP

If you are syncing user id's with Prebid Server and are using AppNexus' managed service, see [AMP Implementation Guide cookie-sync instructions](/dev-docs/show-prebid-ads-on-amp-pages.html#user-sync) for details.

<a name="appnexus-debug-auction" />

#### Mobile App Display Manager Version

The AppNexus endpoint expects `imp.displaymanagerver` to be populated for mobile app sources
requests, however not all SDKs will populate this field. If the `imp.displaymanagerver` field
is not supplied for an `imp`, but `request.app.ext.prebid.source`
and `request.app.ext.prebid.version` are supplied, the adapter will fill in a value for
`diplaymanagerver`. It will concatenate the two `app` fields as `<source>-<version>` fo fill in
the empty `displaymanagerver` before sending the request to AppNexus.

#### Debug Auction

{: .alert.alert-danger :}
Enabling the AppNexus Debug Auction feature should only be done for diagnosing the AppNexus auction. Do not enable this feature in a production setting where it may impact users.

To understand what is happening behind the scenes during an auction, you can enable a debug auction by adding an `apn_prebid_debug` cookie with a JSON string. For example:

{% highlight js %}
{ "enabled": true, "dongle": "QWERTY", "debug_timeout": 1000, "member_id": 958 }
{% endhighlight %}

To view the results of the debug auction, add the `pbjs_debug=true` query string parameter and open your browser's developer console.

{: .table .table-bordered .table-striped }
| Name              | Description                                                     | Example               | Type             |
|-------------------|-----------------------------------------------------------------|-----------------------|------------------|
| `enabled`         | Toggle the debug auction to occur                               | `true`                | `boolean`        |
| `dongle`          | Your account's unique debug password.                           | `QWERTY`              | `string`         |
| `member_id`       | The ID of the member running the debug auction                  | `958`                 | `integer`        |
| `debug_timeout`   | The timeout for the debug auction results to be returned        | `3000`                | `integer`        |

#### Prebid Server Test Request

The following test parameters can be used to verify that Prebid Server is working properly with the
server-side Appnexus adapter. This example includes an `imp` object with an Appnexus test placement ID and sizes
that would match with the test creative.

```
	"imp": [{
		"id": "some-impression-id",
		"banner": {
			"format": [{
				"w": 600,
				"h": 500
			}, {
				"w": 300,
				"h": 600
			}]
		},
		"ext": {
			"appnexus": {
				"placement_id": 13144370
			}
		}
	}]
```
