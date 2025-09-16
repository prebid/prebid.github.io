---
layout: bidder
title: Clydo
description: Prebid Clydo Bidder Adapter
biddercode: Clydo
gpp_sids: usstate_all
gvl_id: none
tcfeu_supported: false
usp_supported: true
coppa_supported: true
schain_supported: true
deals_supported: true
floors_supported: true
fpd_supported: false
ortb_blocking_supported: true
media_types: banner, video, native
multiformat_supported: will-bid-on-one
userIds: all
pbjs: true
pbs: true
pbs_app_supported: true
safeframes_ok: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example                         | Type       |
|---------------|----------|--------------|---------------------------------|------------|
| `partnerId` | required | Partner Id | `'adpartnerid'`                           | `'string'` |

### Note

partnerId is required parameter for prebid server and prebid.js as well. 

To change the region, use one of the available domain prefixes: [us, usw, eu, apac]