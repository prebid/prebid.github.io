---
layout: bidder
title: Microsoft
description: Prebid Microsoft Bidder Adaptor
biddercode: msft
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
fpd_supported: true
pbjs: true
pbjs_version_notes: This adapter is new, and will ultimately replace the AppNexus adapter. We recommend careful monitoring of this replacement, and please communicate any questions or unexpected behavior.
pbs: true
gvl_id: 32
sidebarType: 1
---

### Table of Contents

- [Table of Contents](#table-of-contents)
  - [Bid Params](#bid-params)
  - [Migrating from the AppNexus Bid Adapter & Bid Params](#migration-from-appnexus-bid-params)
  - [Migrating from the AppNexus Bid Adapter & Ad Server Targeting](#migration-from-appnexus-adserver-targeting)
  - [Migrating from the AppNexus Bid Adapter & Native](#migration-from-appnexus-native)
  - [Migrating from the AppNexus Bid Adapter & Auction Level Keywords](#migration-from-appnexus-auction-level-keywords)
  - [First Party Data](#first-party-data)
  - [Debug Auction](#debug-auction)

{: .alert.alert-danger :}
This adapter is new, and will ultimately replace the AppNexus adapter. We recommend careful monitoring of this replacement, and please communicate any questions or unexpected behavior.

<a name="bid-params"></a>

{: .alert.alert-danger :}
All Microsoft (formerly AppNexus/Xandr) placements included in a single call to `requestBids` must belong to the same parent Publisher.  If placements from two different publishers are included in the call, the Microsoft bidder will not return any demand for those placements. <br />
*Note: This requirement does not apply to adapters that are [aliasing](/dev-docs/publisher-api-reference/aliasBidder.html) the Microsoft adapter.*

#### Bid Params

**NOTE** Either `placement_id` OR both `member` and `inv_code` are required.  Please don't specify all three together, it may impact delivery.

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
|------|-------|-------------|---------|------|
| `placement_id` | required (see note above) | The placement ID from Microsoft Monetize.  You may identify a placement using the `inv_code` and `member` instead of a placement ID. | `11223344` | `integer` |
| `member` | required (see note above) | The member ID from Microsoft Monetize.  Must be used with `inv_code`. | `1234` | `integer` |
| `inv_code` | required (see note above) | The inventory code from Microsoft Monetize.  Must be used with `member`. | `'abc123'` | `string` |
| `allow_smaller_sizes` | optional | If `true`, ads smaller than the values in your ad unit's `sizes` array will be allowed to serve. Defaults to `false`. | `true` | `boolean` |
| `use_pmt_rule` | optional | If `true`, Microsoft Monetize will return net price to Prebid.js after publisher payment rules have been applied. | `true` | `boolean` |
| `keywords` | optional | A comma-delimited string of key-value pairs (or terms) applied to this sepcific ad slot on the page. Mapped to [buy-side segment targeting](https://learn.microsoft.com/en-us/xandr/monetize/segment-targeting) (login required). A maximum of 100 key/value pairs can be defined at the request/page level. Each tag can have up to 100 additional key/value pairs defined. If you want to pass keywords for all adUnits, please use the relevant keywords fields in the First Party Data feature. Note that to use keyword with the Prebid Server adapter, that feature must be enabled for your account by an Microsoft Monetize account manager.  | `pet=dog,food,brand=oldroy` | `string` |
| `traffic_source_code` | optional | Specifies the third-party source of this impression. | `'my_traffic_source'` | `string` |
| `pubclick` | optional | Specifies a publisher-supplied URL for third-party click tracking. This is just a placeholder into which the publisher can insert their own click tracker. This parameter should be used for an unencoded tracker. This parameter is expected to be the last parameter in the URL. Please note that the click tracker placed in this parameter will only fire if the creative winning the auction is using Microsoft Monetize click tracking properly. | `'http://click.adserver.com/'` | `string` |
| `ext_inv_code` | optional | Specifies predefined value passed on the query string that can be used in reporting. The value must be entered into the system before it is logged. | `'10039'` | `string` |
| `ext_imp_id` | optional | Specifies the unique identifier of an externally generated auction. | `'bacbab02626452b097f6030b3c89ac05'` | `string` |
| `banner_frameworks` | optional | Array of integers listing API frameworks for Banner supported by the publisher. | `[1,2]` | `array of integers` |

<a name="migration-from-appnexus-bid-params"></a>

#### Migrating from the AppNexus Bid Adapter & Bid Params

If you are migrating from the AppNexus bid adapter, a number of the previously available AppNexus bid parameters have been deprecated as available options for the Microsoft bid parameters. These deprecated bid parameters are still available however, they're just read from other standarized locations offered within Prebid.js. This change was implemented to help us align better to the publisher-aligned features (such as First Party Data) to use a single setup for many bidders.

The following table shows how the bid parameters have changed between the two adapters:

{: .table .table-bordered .table-striped }

| AppNexus Parameter | Microsoft Parameter | Description |
|-------------------|-------------------|-------------|
| `params.placementId` | `params.placement_id` | Placement ID (**only** the underscore case is now supported in the name, value **only** accepts integers) |
| `params.member` | `params.member` | Member ID (value **only** accepts integers) |
| `params.inv_code` | `params.inv_code` | Inventory code (unchanged) |
| `params.publisher_id` | Use `ortb2.publisher.id` | Publisher ID (moved to ortb2 config) |
| `params.frameworks` | `params.banner_frameworks` | Banner API frameworks array (small name change to clarify banner only) |
| `params.user` | Use `ortb2.user` | User data (moved to ortb2 config) |
| `params.allow_smaller_sizes` | `params.allow_smaller_sizes` | Allow smaller ad sizes (unchanged) |
| `params.use_pmt_rule` | `params.use_pmt_rule` | Use payment rule (unchanged) |
| `params.keywords` | `params.keywords` | Tag/Imp-level keywords (use ORTB format of comma-delimited string value; eg `'pet=cat,food,brand=fancyfeast'`) |
| `params.video` | Use `mediaTypes.video` | Video parameters (moved to mediaTypes) |
| `params.video.frameworks` | Use `mediaTypes.video.api` | Video API frameworks (moved to mediaTypes) |
| `params.app` | Use `ortb2.app` | App data (moved to ortb2 config) |
| `params.reserve` | Use bidfloor module | Reserve price (use bidfloor module) |
| `params.position` | Use `mediaTypes.banner.pos` | Banner position (moved to mediaTypes) |
| `params.traffic_source_code` | `params.traffic_source_code` | Traffic source code (unchanged) |
| `params.supply_type` | Use `ortb2.site` or `ortb2.app` | Supply type (moved to ortb2 config) |
| `params.pub_click` | `params.pubclick` | Publisher click URL (dropped underscore to align to endpoint) |
| `params.ext_inv_code` | `params.ext_inv_code` | External inventory code (unchanged) |
| `params.external_imp_id` | `params.ext_imp_id` | External impression ID (shortend to ext) |

<a name="migration-from-appnexus-adserver-targeting"></a>

#### Migrating from the AppNexus Bid Adapter & Ad Server Targeting

If you are migrating from the AppNexus bid adapter and your Ad Server Line Items (or related entities) relied on bidder specific keyword targeting to the Prebid.js keys (eg hb_bidder=appnexus or hb_pb_appnexus=5.00), you will like need to adjust your setup.  Some adjustments could be creating additional line-items, updating the existing targeting, reomving targeting (if it's no longer needed), or some other variation to ensure the targeting includes the `msft` term in either the key-name or key-value.

<a name="migration-from-appnexus-native"></a>

#### Migrating from the AppNexus Bid Adapter & Native Ads

If you are migrating from the AppNexus bid adapter, the setup for Native adUnits now require the use of the Prebid.js ORTB Native setup.  The Microsoft Bid Adapter **no longer offers support** to the legacy Prebid.js Native adUnit setup.  

Requests using that legacy approach will **NOT** work and will need to be converted to the equivalent values in the adUnit.  This change is made to better align with Prebid.js and many other Bid Adapters that support Native in an ORTB context.

Please refer to the [Prebid.js Native Implementation Guide](https://docs.prebid.org/prebid/native-implementation.html) if you need additional information to implement the Native ORTB setup.

<a name="migration-from-appnexus-auction-level-keywords"></a>

#### Migrating from the AppNexus Bid Adapter & Auction Level Keywords

If you are migrating from the AppNexus bid adapter, the previously available `setConfig` option named `appnexusAuctionKeywords` is not supported within the Microsoft bid adapter.

If you need to specify keyword-like data at the auction/request level, please instead specify that data within the appropriate area of the First Party Data section of your setup (eg `ortb2.site.keywords`).  If you wish to set bidder-specific First Party Data data, please refer to this [page](https://docs.prebid.org/features/firstPartyData.html#supplying-bidder-specific-data).  

<a name="fpd"></a>

#### First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html).

PBS/PSP supports all first party data fields: site, user, segments, and imp-level first party data.

<a name="debug-auction"></a>

#### Debug Auction

{: .alert.alert-danger :}
Enabling the Microsoft Monetize Debug Auction feature should only be done for diagnosing the Monetize auction. Do **NOT** enable this feature in a production setting where it may impact users.  The debug output will take the place of the normal bid response, meaning the ad will **NOT** show even if the auction debug output indicated there was a winning bid.

To understand what is happening behind the scenes during an auction, you can enable a debug auction by either adding an `apn_prebid_debug` cookie with a JSON string or add certain key-value pairs in the page URL's query string. 

To use the cookie approach, the JSON payload for the cookie could look like:

```javascript
{ "enabled": true, "dongle": "QWERTY", "debug_timeout": 1000, "member_id": 958 }
```

**NOTE** If you use this approach, you may need to grant permission to the msft Bid Adapter in the your Prebid.js config storageAllowed settings, otherwise Prebid.js will block the adapter from attempting to find/read the cookie.

To use the page URL query string approach, you can append the following set of `apn_debug_...` key-value pairs to the existing page URL's query string:
`html
https://my.site.com/page/stuff.html?normal=data_here&apn_debug_enabled=true&apn_debug_dongle=QWERTY&apn_debug_member_id=958&apn_debug_timeout=1000`

To view the results of the debug auction, add the `pbjs_debug=true` query string parameter and open your browser's developer console.

{: .table .table-bordered .table-striped }

| Name              | Description                                                     | Example               | Type             |
|-------------------|-----------------------------------------------------------------|-----------------------|------------------|
| `enabled`         | Toggle the debug auction to occur                               | `true`                | `boolean`        |
| `dongle`          | Your account's unique debug password.                           | `QWERTY`              | `string`         |
| `member_id`       | The ID of the member running the debug auction                  | `958`                 | `integer`        |
| `debug_timeout`   | The timeout for the debug auction results to be returned        | `3000`                | `integer`        |

<a name="prebid-server-test-request"></a>
