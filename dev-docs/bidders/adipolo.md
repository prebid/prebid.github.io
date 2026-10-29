---
layout: bidder
title: Adipolo
description: Adipolo Bidder Adapter
biddercode: adipolo
media_types: banner, video
coppa_supported: true
tcfeu_supported: true
gvl_id: 1456
usp_supported: true
prebid_member: false
pbjs: true
pbs: true
schain_supported: true
floors_supported: true
multiformat_supported: will-bid-on-any
sidebarType: 1
safeframes_ok: true
dchain_supported: false
deals_supported: true
fpd_supported: false
ortb_blocking_supported: true
privacy_sandbox: no
---

### Prebid.js Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                 | Example       | Type      |
|-------------|----------|-----------------------------|---------------|-----------|
| `pid`       | required | Placement ID                | `test-banner` | `string`  |
| `env`       | optional | Environment name            | `adipolo`     | `string`  |
| `ext`       | optional | Specific integration config | `{}`          | `object`  |

### Prebid Server Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                   | Example                            | Type      |
|-------------|----------|-------------------------------|------------------------------------|-----------|
| `env`       | required | Environment name              | `adipolo-stage`                    | `string`  |
| `pid`       | required | unique placement ID           | `aa8217e20131c095fe9dba67981040b0` | `string`  |
