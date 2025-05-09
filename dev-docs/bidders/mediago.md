---
layout: bidder
title: MediaGo
description: MediaGo Prebid Bidder Adapter
biddercode: mediago
media_types: banner,native
prebid_member: true
userIds: all (with commercial activation)
tcfeu_supported: true
coppa_supported: true
usp_supported: true
pbjs: true
pbs: true
floors_supported: true
gvl_id: 1020
pbjs_version_notes:
sidebarType: 1
---
### Modules

SharedID: We need you to include SharedID module,which is used to get prebid user commonid.It can better differentiating users to bid on ads.

### Note

The MediaGo Bidding adapter requires setup before beginning. Please contact us at <ext_mediago_cm@baidu.com>

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `token`      | required | publisher token, This parameter expects all imps to be the same        | `'1e100887dd614b7f69fdd1360437'`    | `string` |
| `region`      | recommend | Server region for PBS request: US for US Region, EU for EU Region, APAC for APAC Region, default is US. This parameter expects all imps to be the same. This parameter is available for PBS only.        | `'US'`    | `string` |
| `test` | recommend | 0(default): production env mode. <br> 1: dev env mode and no charge.we will bid Higher frequency to make debug easier. This parameter is available for PBJS only.  | `1/0` | `Number` |
| `bidfloor` | recommend | Sets a floor price for the bid. This parameter is available for PBJS only. | `0.05` | `float` |
| `publisher`      | required | publisher id         | `'abcdefg'`    | `string` |
| `placementId` | recommend | The AD placement ID | `12341234` | `string` |
