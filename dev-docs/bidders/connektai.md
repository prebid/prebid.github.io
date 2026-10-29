---
layout: bidder
title: connekt.ai
description: Prebid connekt.ai Bidder Adaptor
biddercode: connektai
media_types: banner, video
coppa_supported: true
tcfeu_supported: false
usp_supported: true
prebid_member: false
pbjs: false
pbs: true
schain_supported: true
floors_supported: true
multiformat_supported: will-bid-on-any
sidebarType: 1
dchain_supported: false
deals_supported: true
fpd_supported: false
ortb_blocking_supported: true
safeframes_ok: true
privacy_sandbox: no
---

### Note

The connekt.ai adapter requires setup before beginning. Please contact us at <adops@connekt.ai>

### Prebid Server Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                 | Example                            | Type      |
|-------------|----------|-----------------------------|------------------------------------|-----------|
| `env`       | required | Environment name            | `stage`                            | `string`  |
| `pid`       | required | Uniq placement ID           | `ab230510222b516f0eb9a10e5913d3b5` | `string`  |
