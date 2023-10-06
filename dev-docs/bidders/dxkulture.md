---
layout: bidder
title: DXKulture
description: Prebid DXKulture Bidder Adaptor
pbjs: true
biddercode: dxkulture
media_types: banner, video
tcfeu_supported: false
gdpr_supported: true
usp_supported: true
schain_supported: true
sidebarType: 1

---

### Integration Note

The DXKulture Header Bidding adapter requires approval from the DXKulture team. Please reach out to  <devops@kulture.media> for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope    | Description        | Example     | Type      |
|------|----------|--------------------|-------------|-----------|
| `placementId` | required | Placement Id | `'1234abcd'` | `string`  |
| `publisherId` | required | Publisher Id       | `'12345'`     | `string` |
| `bidfloor` | optional | Bid Floor       | `2.3`     | `float` |
| `bidfloorcur` | optional | Bid Floor Currency       | `'USD'`     | `string` |