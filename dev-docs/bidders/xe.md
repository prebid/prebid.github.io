---
layout: bidder
title: Xeworks
description: Prebid Xeworks Bidder Adapter
biddercode: xe
media_types: banner, video
coppa_supported: true
tcfeu_supported: true
usp_supported: true
prebid_member: true
pbjs: true
pbs: true
pbs_biddercode: xeworks
schain_supported: true
floors_supported: true
multiformat_supported: will-bid-on-any
sidebarType: 1
gvl_id: 1383
---

## Note

The Xe.works adapter requires setup before beginning. Please contact us at <team@xe.works>

### Prebid.js Bid params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                 | Example                                | Type     |
|-------|----------|-----------------------------|----------------------------------------|----------|
| `pid` | required | Uniq placement ID           | `dc230510222b516f0eb9a10e5913d3b5`     | `string` |
| `env` | required | Environment name            | `xe`                                   | `string` |
| `ext` | optional | Specific integration config | `{}`                                   | `object` |

Prebid.js 9.10 and later require `pid`. Bids with only the old `placement` param are rejected by the adapter.

The adapter also answers to the bidder code `xeworks`.

### Prebid Server Bid Params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description       | Example                            | Type     |
|-------|----------|-------------------|------------------------------------|----------|
| `env` | required | Environment name  | `xe-stage`                         | `string` |
| `pid` | required | Uniq placement ID | `dc230510222b516f0eb9a10e5913d3b5` | `string` |
