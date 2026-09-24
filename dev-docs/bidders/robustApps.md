---
layout: bidder
title: RobustApps
description: RobustApps Bidder Adapter
biddercode: robustApps
media_types: banner, video
coppa_supported: true
tcfeu_supported: false
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
| Name        | Scope    | Description                 | Example                            | Type      |
|-------------|----------|-----------------------------|------------------------------------|-----------|
| `pid`       | required | Placement ID                | `aa8217e20131c095fe9dba67981040b0` | `string`  |
| `env`       | optional | Environment name            | `robustApps`                       | `string`  |
| `ext`       | optional | Specific integration config | `{}`                               | `object`  |

### Prebid Server Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                 | Example                            | Type      |
|-------------|----------|-----------------------------|------------------------------------|-----------|
| `pid`       | required | Placement ID                | `aa8217e20131c095fe9dba67981040b0` | `string`  |
| `env`       | required | Environment name            | `robustApps`                       | `string`  |
