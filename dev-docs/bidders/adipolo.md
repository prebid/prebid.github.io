---
layout: bidder
title: Adipolo
description: Adipolo Bidder Adapter
biddercode: adipolo
media_types: banner, video
coppa_supported: true
tcfeu_supported: false
usp_supported: true
prebid_member: false
pbjs: true
pbs: false
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
