---
layout: bidder
title: DXTech
description: Prebid DXTech Bidder Adapter
pbjs: true
pbs: false
biddercode: dxtech
media_types: banner, video
tcfeu_supported: false
gdpr_supported: true
usp_supported: true
schain_supported: true
sidebarType: 1
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: false
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: partial
---

### Integration Note

The DXTech Header Bidding adapter requires approval from the DXTech team. Please reach out to <support@dxtech.ai> for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope    | Description        | Example     | Type      |
|------|----------|--------------------|-------------|-----------|
| `placementId` | required | Placement Id | `'1234abcd'` | `string`  |
| `publisherId` | required | Publisher Id       | `'12345'`     | `string` |
