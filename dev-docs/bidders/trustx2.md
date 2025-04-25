---
layout: bidder
title: TRUSTX
description: Prebid TRUSTX Bidder Adapter
pbjs: true
pbs: true
biddercode: trustx2
tcfeu_supported: false
gdpr_supported: true
usp_supported: true
schain_supported: true
media_types: banner, video
gpp_sids: tcfeu, usp
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: false
multiformat_supported: will-not-bid
sidebarType: 1

---

### Integration

Approval from the TRUSTX team is required for the TRUSTX 2 Header Bidding adapter.
For additional information, please reach out to <prebid@trustx.org>.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope    | Description        | Example     | Type      |
|------|----------|--------------------|-------------|-----------|
| `publisher_id` | required | Publisher ID | `'0000'` | `string`  |
| `placement_id` | required | Placement ID | `'11111'` | `string`  |
| `bidfloor` | optional | Bid Floor | `2.3` | `float` |
| `bidfloorcur` | optional | Bid Floor Currency | `'USD'` | `string` |
