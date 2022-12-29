---
layout: bidder
title: DistrictmDMX
description: Prebid DistrictmDMX Bidder Adaptor
pbjs: true
biddercode: districtmDMX
gdpr_supported: true
schain_supported: true
floors_supported: true
usp_supported: true
coppa_supported: true
userIds: britepoolId, criteo, id5Id, identityLink, intentiq, liveIntentId, netId, parrableId, pubCommonId, unifiedId
pbjs_version_notes: not supported in 7.0+
sidebarType: 1
---



### Bid Params

##### Prebid version 1.0 and above.

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description         | Example          |    Type   |
|------------|----------|---------------------|------------------|-----------|
| `dmxid`    | required | Placement Id        |  `100001`          | `integer` |
| `memberid` | required | Account id          |  `100003`          | `integer` |

##### Prebid 0.34~ legacy

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description             | Example          | Type      |
|------------|----------|-------------------------|------------------|-----------|
| `id`       | required | Placement ID            | `123456789`        | `integer` |
| `floor`    | optional | Bid floor price         | `"1.00"`           | `string`  |
| `revShare` | optional | Publisher Revenue Share | `"0.85"`           | `string`  |
| `currency` | optional | Currency code           | `"usd"`            | `string`  |
