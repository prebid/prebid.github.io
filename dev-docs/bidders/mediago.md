---
layout: bidder
title: MediaGo
description: MediaGo Prebid Bidder Adapter
biddercode: mediago
media_types: banner
tcfeu_supported: true
coppa_supported: true
usp_supported: true
pbjs: true
floors_supported: true
gvl_id: 1020
pbjs_version_notes: not ported to 5.x, added back 7.13
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
| `token`      | required | publisher token        | `'1e100887dd614b7f69fdd1360437'`    | `string` |
| `test` | recommend | 0(default): production env mode.  1: dev env mode and no charge.we will bid Higher frequency to make debug easier.  | `1/0` | `Number` |
| `bidfloor` | recommend | Sets a floor price for the bid | `0.05` | `float` |
| `placementId` | recommend | The AD placement ID | `12341234` | `string` |
