---
layout: bidder
title: RavelTech
description: Prebid RavelTech Bidder Adaptor
biddercode: raveltech
media_types: banner, video, native
tcfeu_supported: true
dsa_supported: true
prebid_member: true
userIds: all (with commercial activation)
schain_supported: true
coppa_supported: true
usp_supported: true
gpp_supported: true
floors_supported: true
fpd_supported: false
pbjs: true
pbjs_version_notes: please avoid using v7.15 and v7.16
pbs: true
gvl_id: 32
sidebarType: 1
---

### RavelTech Bid Adapter

Ravel Technologies developed ZKAD (Zero-Knowledge ADvertising), a protocol anonymizing RTB data & PII during the RTB bidding process and during data processing.
ZKAD is using a scalable proprietary Homomorphic Encryption scheme (Ravel Homormorphic Encryption, RHE), a form of encryption that allows to perform computations at scale on encrypted data without having to first decrypt it.
ZKAD allows publishers to protect users’ privacy and publishers’ data while allowing advanced targeted advertising and advanced regulatory compliance.

Ravel Bidder is a “Privacy Bus” allowing to anonymize bid requests before forwarding them to SSP and DSP preventing any personal data to be transferred to SSP and DSP. PII IDs are removed or/and anonymized into RIDs (Ravelized IDs). Furthermore, User-Agent is truncated, and location is provided with a significant Radius. IP addresses are not stored by the Privacy Bus and are not provided in the bid requests.

The RavelTech Prebid Adapter supports only Xandr/Appnexus SSP and should be configured with your current Xandr/Appnexus existing params:

| Name                | Scope    | Description                                                                                                                                                                   | Example                                               | Type             |
|---------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|------------------|
| `placement_id` (PBS+PBJS) or `placementId` (PBJS)    | required | The placement ID from AppNexus.  You may identify a placement using the `invCode` and `member` instead of a placement ID. This parameter can be either a `string` or `integer` for Prebid.js, however `integer` is preferred. Legacy code can retain the `string` value. **Prebid Server requires an integer value.**                                                    | `234234`                                            | `integer`         |
| `member`                                        | optional | The member ID  from AppNexus. Must be used with `invCode`.                                                                                                                    | `'12345'`                                             | `string`         |
| `invCode` or `inv_code`                             | optional | The inventory code from AppNexus. Must be used with `member`.                                                                                                                 | `'abc123'`                                            | `string`         |
| `publisherId` or `publisher_id`                    | optional | The publisher ID from AppNexus. It is used by the AppNexus end point to identify the publisher when placement id is not provided and `invCode` goes wrong. The `publisherId` parameter can be either a `string` or `integer` for Prebid.js, however `integer` is preferred.                                                                                                                    | `12345`                                             | `integer`         |
| `frameworks`                                    | optional | Array of integers listing API frameworks for Banner supported by the publisher. | `[1,2]` | `array of integer` |
| `user`                                          | optional | Object that specifies information about an external user. See [User Object](#appnexus-user-object) for details.                                                               | `user: { age: 25, gender: 0, dnt: true}`              | `object`         |
| `allowSmallerSizes` or `allow_smaller_sizes`               | optional | If `true`, ads smaller than the values in your ad unit's `sizes` array will be allowed to serve. Defaults to `false`.                                                         | `true`                                                | `boolean`        |
| `usePaymentRule` (PBJS) or `use_pmt_rule` (PBS+PBJS) | optional | If `true`, Appnexus will return net price to Prebid.js after publisher payment rules have been applied.                                                                       | `true`                                                | `boolean`        |
| `keywords`                                      | optional | A set of key-value pairs applied to all ad slots on the page.  Mapped to [buy-side segment targeting](https://monetize.xandr.com/docs/segment-targeting) (login required). A maximum of 100 key/value pairs can be defined at the page level. Each tag can have up to 100 additional key/value pairs defined. Values can be empty. See [Passing Keys Without Values](#appnexus-no-value) below for examples. If you want to pass keywords for all adUnits, see [Auction Level Keywords](#appnexus-auction-keywords) for an example. Note that to use keyword with the Prebid Server adapter, that feature must be enabled for your account by an AppNexus account manager. | `keywords: { genre: ['rock', 'pop'] }`                | `object`         |
| `video`                                         | optional | Object containing video targeting parameters.  See [Video Object](#appnexus-video-object) for details.                                                                        | `video: { playback_method: ['auto_play_sound_off'] }` | `object`         |
| `app`                                           | optional | Object containing mobile app parameters.  See the [App Object](#appnexus-app-object) for details.                                                                      | `app : { id: 'app-id'}`                               | `object`         |
| `reserve`                                       | optional | Sets a floor price for the bid that is returned. If floors have been configured in the AppNexus Console, those settings will override what is configured here unless 'Reserve Price Override' is checked. See [Xandr docs](https://docs.xandr.com/bundle/monetize_monetize-standard/page/topics/create-a-floor-rule.html)                | `0.90`                                                | `float`          |
| `position`                                      | optional | Identify the placement as above or below the fold.  Allowed values: Unknown: `unknown`; Above the fold: `above`; Below the fold: `below`                                      | `'above'`                                               | `string`        |
| `trafficSourceCode` or `traffic_source_code`         | optional | Specifies the third-party source of this impression.                                                                                                                          | `'my_traffic_source'`                                 | `string`         |
| `supplyType` or `supply_type`                      | optional | Indicates the type of supply for this placement. Possible values are `web`, `mobile_web`, `mobile_app`                                                                        | `'web'`                                               | `string`         |
| `pubClick` or `pub_click`                         | optional | Specifies a publisher-supplied URL for third-party click tracking. This is just a placeholder into which the publisher can insert their own click tracker. This parameter should be used for an unencoded tracker. This parameter is expected to be the last parameter in the URL. Please note that the click tracker placed in this parameter will only fire if the creative winning the auction is using AppNexus click tracking properly.                                  | `'http://click.adserver.com/'`                        | `string`         |
| `extInvCode` or `ext_inv_code`                      | optional | Specifies predefined value passed on the query string that can be used in reporting. The value must be entered into the system before it is logged.                           | `'10039'`                                             | `string`         |
| `externalImpId` or `external_imp_id`                   | optional | Specifies the unique identifier of an externally generated auction.                                                                                                           | `'bacbab02626452b097f6030b3c89ac05'`                  | `string`         |
| `generate_ad_pod_id`                            | optional | Signal to AppNexus to split impressions by ad pod and add unique ad pod id to each request. Specific to long form video endpoint only. Supported by Prebid Server, not Prebid JS.  | `true`                                                | `boolean`        |

For more information about the Xandr/AppNexus: [https://github.com/prebid/prebid.github.io/blob/master/dev-docs/bidders/appnexus.md]

Please contact [support@raveltech.io] to activate your adapter after installation or for more information.
