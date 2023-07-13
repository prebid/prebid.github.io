---
layout: bidder
title: xe.works
description: Prebid Xe.works Bidder Adaptor
biddercode: xe
media_types: banner, video
coppa_supported: true
gdpr_supported: false
usp_supported: true
prebid_member: false
pbjs: true
pbs: true
schain_supported: true
floors_supported: true
multiformat_supported: will-bid-on-any
sidebarType: 1
---

### Note

The Xe.works adapter requires setup before beginning. Please contact us at <team@xe.works>

### Prebid.js Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                 | Example       | Type      |
|-------------|----------|-----------------------------|---------------|-----------|
| `placement` | required | Placement ID                | `test-banner` | `string`  |
| `env`       | required | Environment name            | `xe`          | `string`  |
| `ext`       | optional | Specific integration config | `{}`          | `object`  |

### Prebid Server Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                 | Example                            | Type      |
|-------------|----------|-----------------------------|------------------------------------|-----------|
| `env`       | required | Environment name            | `xe-stage`                         | `string`  |
| `pid`       | required | Uniq placement ID           | `dc230510222b516f0eb9a10e5913d3b5` | `string`  |
