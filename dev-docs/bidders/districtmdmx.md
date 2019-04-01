---
layout: bidder
title: DistrictmDMX
description: Prebid DistrictmDMX Bidder Adaptor
hide: true
biddercode: districtmDMX
gdpr_supported: true
biddercode_longer_than_12: false
---



### bid params

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

