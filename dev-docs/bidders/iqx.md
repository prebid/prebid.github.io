---
layout: bidder
title: IQX
description: IQX Bidder Adapter
biddercode: iqx
media_types: banner, video, native
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
safeframes_ok: true
---

### Prebid Server Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                   | Example                            | Type      |
|-------------|----------|-------------------------------|------------------------------------|-----------|
| `env`       | required | Environment name              | `iqx-stage`                        | `string`  |
| `pid`       | required | unique placement ID           | `aa8217e20131c095fe9dba67981040b0` | `string`  |
