---
layout: bidder
title: Loyal
description: Prebid Loyal Bidder Adapter
biddercode: loyal
usp_supported: true
tcfeu_supported: false
coppa_supported: true
schain_supported: true
floors_supported: true
media_types: banner, video, native
multiformat_supported: will-not-bid
pbjs: true
pbs: true
pbs_app_supported: true
safeframes_ok: true
deals_supported: false
ortb_blocking_supported: false
fpd_supported: false
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example                         | Type       |
|---------------|----------|--------------|---------------------------------|------------|
| `placementId` | optional | Placement Id | `'0'`                           | `'string'` |
| `endpointId`  | optional | Endpoint Id  | `'0'`                           | `'string'` |

### Note

For the prebid server and prebid.js you only need to use one parameter: either placementId or endpointId
