---
layout: bidder
title: Kivi
description: Prebid Kivi Bidder Adapter
biddercode: kiviads
media_types: banner, video, native
pbjs: true
pbs: true
safeframes_ok: true
floors_supported: true
fpd_supported: false
multiformat_supported: will-not-bid
ortb_blocking_supported: partial
pbs_app_supported: true
gdpr_supported: true
usp_supported: true 
coppa_supported: true
deals_supported: false
schain_supported: true
dchain_supported: false
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `placementId`      | optional | Placement Id         | `'0'`    | `'string'` |
| `endpointId`      | optional | Endpoint Id         | `'0'`    | `'string'` |

### Note

For the prebid server and prebid.js you only need to use one parameter: either placementId or endpointId
