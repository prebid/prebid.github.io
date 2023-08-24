---
layout: bidder
title: kiviads.com
description: Prebid kiviads.com Bidder Adaptor
biddercode: lm_kiviads
media_types: banner, video
coppa_supported: true
gdpr_supported: true
usp_supported: true
prebid_member: false
pbjs: true
pbs: true
schain_supported: true
floors_supported: true
multiformat_supported: will-bid-on-any
sidebarType: 1
---

### Note:

The lm_kiviads adapter requires setup before beginning. Please contact us at prebid@kiviads.com


### Prebid.js Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                 | Example       | Type      |
|-------------|----------|-----------------------------|---------------|-----------|
| `placement` | required | Placement ID                | `test-banner` | `string`  |
| `env`       | required | Environment name            | `lm_kiviads`  | `string`  |
| `ext`       | optional | Specific integration config | `{}`          | `object`  |

### Prebid Server Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                 | Example                            | Type      |
|-------------|----------|-----------------------------|------------------------------------|-----------|
| `env`       | required | Environment name            | `lm_kiviads-stage`                 | `string`  |
| `pid`       | required | Uniq placement ID           | `dc230510222b516f0eb9a10e5913d3b5` | `string`  |
