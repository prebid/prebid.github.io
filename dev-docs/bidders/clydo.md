---
layout: bidder
title: Clydo
description: Prebid Clydo Bidder Adapter
biddercode: clydo
gpp_sids: usstate_all
tcfeu_supported: false
usp_supported: true
coppa_supported: true
schain_supported: true
dchain_supported: false
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
| `region` | required | Region | `'us'`                           | `'string'` |

### Note

partnerId is required parameter for both prebid server and prebid.js.
Allowed values for region field are: [us, usw, eu, apac]. 
If the region is not passed when using the prebid server, the default value "us" will be set.