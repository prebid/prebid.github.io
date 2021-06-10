---
layout: bidder
title: Between
description: Prebid Between Bidder Adapter
pbjs: true
pbs: true
biddercode: between
schain_supported: true
gdpr_supported: true
pbs_app_supported: true
userIds: sharedId
gvl_id: 724
usp_supported: true
---

### Prebid.js Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description | Example | Type     |
|---------------|----------|-------------|---------|----------|
| `s` | required |  Section ID from Between SSP control panel | 999999 | `integer` |
| `w`        | required | width of placement(Number)                | 240       |
| `h`        | required | height of placement(Number)               | 400       |

### Prebid-Server Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description | Example | Type     |
|---------------|----------|-------------|---------|----------|
| `host` | required |  Between SSP host url prefix. Defines data center where requests will be sent. Choose the closest one to the prebid-server you are using. Allowed values: `lbs-eu1.ads`, `lbs-ru1.ads`, `lbs-asia1.ads`, `lbs-us-east1.ads` | `'lbs-eu1.ads'` | `string` |
| `publisher_id` | required |  Publisher ID from Between SSP control panel | `'123'` | `string` |
| `bid_floor` | optional | Minimum price acceptable for a bid. `0.00001` by default  | `0.05` | `float` |
| `bid_floor_cur` | optional |  Bid floor currency. Allowed values: `USD`, `EUR`, `RUB` | `'USD'` | `string` |


