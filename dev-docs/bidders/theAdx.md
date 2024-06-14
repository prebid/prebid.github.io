---
layout: bidder
title: theadx
description: Prebid TheAdx Bidder Adapter
pbs: true
pbs_app_supported: true
pbjs: true
biddercode: theadx
tcfeu_supported: true
usp_supported: true
schain_supported: true
userIds: all
media_types: banner, video
gvl_id: 556
deals_supported: true
multiformat_supported: will-not-bid
ortb_blocking_supported: true
floors_supported: true
coppa_supported: true
gpp_sids: false
fpd_supported: false
sidebarType: 1
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                           | Example    | Type  |
|-------------|----------|-----------------------------------------------------------------------|------------|-------|
| `pid`     | required | Publisher  GUID from theadx.com                                         | `'1000'`   | `int` |
| `wid`     | required | Web Site ID from theadx.com                                             | `'2000'`   | `int` |
| `tagId`   | required | Tag ID from theadx.com                                                  | `'3000'`   | `int` |
|           |          |                                                                          |          |        |
