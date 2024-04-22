---
layout: bidder
title: Playdigo
description: Prebid Playdigo Bidder Adapter
biddercode: playdigo
usp_supported: true
coppa_supported: true
schain_supported: true
floors_supported: true
media_types: banner, video, native
multiformat_supported: will-not-bid
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
| `placementId` | optional | Placement Id | `'0'`                           | `'string'` |
| `endpointId`  | optional | Endpoint Id  | `'0'`                           | `'string'` |

### Note

For the prebid server and prebid.js you only need to use one parameter: either placementId or endpointId
