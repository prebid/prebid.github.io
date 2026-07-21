---
layout: bidder
title: msftstaila
description: Prebid Microsoft Bidder Adaptor
biddercode: msftstaila
aliasCode : msft
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
pbjs_version_notes: 	
pbs: true
gvl_id: 32
sidebarType: 1
---

### Bid Params

**NOTE**
msftstaila is an aliased bidder of Microsoft.
Either `placement_id` OR both `member` and `inv_code` are required.  Please don't specify all three together, it may impact delivery. 

**NOTE**
We recommend to use the “use_pmt_rule” parameter set to true, when integrating, to ensure the bidding is net.

For setup with Staila Media, please reach out to prebid@stailamedia.com.


{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| :--- | :--- | :--- | :--- | :--- |
| `placement_id` | required (see note above) | The placement ID from Microsoft Monetize. You may identify a placement using the `inv_code` and `member` instead of a placement ID. | `11223344` | `integer` |
| `member` | required (see note above) | The member ID from Microsoft Monetize. Must be used with `inv_code`. | `1234` | `integer` |
| `inv_code` | required (see note above) | The inventory code from Microsoft Monetize. Must be used with `member`. | `'abc123'` | `string` |
| `allow_smaller_sizes` | optional | If `true`, ads smaller than the values in your ad unit's `sizes` array will be allowed to serve. Defaults to `false`. | `true` | `boolean` |
| `use_pmt_rule` | optional | If `true`, Microsoft Monetize will return net price to Prebid.js after publisher payment rules have been applied. | `true` | `boolean` |
| `keywords` | optional | A comma-delimited string of key-value pairs (or terms) applied to this specific ad slot on the page. Mapped to [buy-side segment targeting](https://learn.microsoft.com/en-us/xandr/monetize/segment-targeting) (login required). A maximum of 100 key/value pairs can be defined at the request/page level. Each tag can have up to 100 additional key/value pairs defined. If you want to pass keywords for all adUnits, please use the relevant keywords fields in the First Party Data feature. Note that to use keyword with the Prebid Server adapter, that feature must be enabled for your account by an Microsoft Monetize account manager. | `pet=dog,food,brand=oldroy` | `string` |
| `traffic_source_code` | optional | Specifies the third-party source of this impression. | `'my_traffic_source'` | `string` |
| `pubclick` | optional | Specifies a publisher-supplied URL for third-party click tracking. This is just a placeholder into which the publisher can insert their own click tracker. This parameter should be used for an unencoded tracker. This parameter is expected to be the last parameter in the URL. Please note that the click tracker placed in this parameter will only fire if the creative winning the auction is using Microsoft Monetize click tracking properly. | `'http://click.adserver.com/'` | `string` |
| `ext_inv_code` | optional | Specifies predefined value passed on the query string that can be used in reporting. The value must be entered into the system before it is logged. | `'10039'` | `string` |
| `ext_imp_id` | optional | Specifies the unique identifier of an externally generated auction. | `'bacbab02626452b097f6030b3c89ac05'` | `string` |
| `banner_frameworks` | optional | Array of integers listing API frameworks for Banner supported by the publisher. | `[1,2]` | `array of integers` |

<a name="migration-from-appnexus-bid-params"></a>

### Migrating from the AppNexus Bid Adapter & Bid Params

If you are migrating from the AppNexus bid adapter, a number of the previously available AppNexus bid parameters have been deprecated as available options for the Microsoft bid parameters. These deprecated bid parameters are still available however, they're just read from other standarized locations offered within Prebid.js. This change was implemented to help us align better to the publisher-aligned features (such as First Party Data) to use a single setup for many bidders.

The Microsoft Bid Adapter connects to Microsoft's advertising exchange for bids. This adapter supports banner, video (instream and outstream), and native ad formats using OpenRTB 2.5 standards.

For reference, here is the IAB OpenRTB 2.5 [specification](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf)

The following table shows how the bid parameters have changed between the two adapters:

{: .table .table-bordered .table-striped }

| AppNexus Parameter | Microsoft Parameter | Description |
| :--- | :--- | :--- |
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

### Keywords
With the AppNexus adapter, keywords followed this format: keyname=keyvalue1,keyvalue2,keyvalue3

In the Microsoft Bid Adapter, the new required format is: keyname=keyvalue1,keyname=keyvalue2,keyname=keyvalue3


### First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html).

PBS/PSP supports all first party data fields: site, user, segments, and imp-level first party data.

<a name="debug-auction"></a>
