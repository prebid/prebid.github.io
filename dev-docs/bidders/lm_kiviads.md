---
layout: bidder
title: LM KiviAds
description: LM Kiviads Bidder Adapter
biddercode: lm_kiviads
media_types: banner, video
coppa_supported: true
tcfeu_supported: true
usp_supported: true
prebid_member: false
pbjs: true
pbs: true
schain_supported: true
floors_supported: true
multiformat_supported: will-bid-on-any
sidebarType: 1
---

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
| `pid`       | required | Unique placement ID           | `cs230510321b516f0eb9a10e5913d3b1` | `string`  |
