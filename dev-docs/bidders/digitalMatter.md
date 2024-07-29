---
layout: bidder
title: digital_matter
description: Digital Matter Bidder Adapter
biddercode: digital_matter
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
---

### Prebid.js Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                 | Example         | Type      |
|-------------|----------|-----------------------------|-----------------|-----------|
| `pid`       | required | Placement ID                | `test-banner`   | `string`  |
| `env`       | required | Environment name            | `digital_matter`| `string`  |
| `ext`       | optional | Specific integration config | `{}`            | `object`  |

### Prebid Server Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                 | Example       | Type      |
|-------------|----------|-----------------------------|---------------|-----------|
| `pid`       | required | Unique placement ID         | `pid1`        | `string`  |
| `env`       | optional | digital_matter environment  | `test`        | `string`  |
