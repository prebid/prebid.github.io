---
layout: bidder
title: MgidX
description: Prebid MgidX Bidder Adapter
biddercode: mgidX
gpp_sids: usstate_all
tcfeu_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
deals_supported: false
floors_supported: true
fpd_supported: false
ortb_blocking_supported: false
media_types: banner, video, native
multiformat_supported: will-not-bid
userIds: all
pbjs: true
pbs: true
pbs_app_supported: true
safeframes_ok: true
gvl_id: 358
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example                         | Type       |
|---------------|----------|--------------|---------------------------------|------------|
| `placementId` | optional | Placement Id | `'0'`                           | `'string'` |
| `endpointId`  | optional | Endpoint Id  | `'0'`                           | `'string'` |
| `region`      | optional | Region (for Prebid.js) | `'us-east'` (default) or `'eu'` | `'string'` |

### Note

For the prebid server and prebid.js you only need to use one parameter: either placementId or endpointId
