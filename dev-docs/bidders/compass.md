---
layout: bidder
title: Compass
description: Prebid Compass Bidder Adapter
biddercode: compass
usp_supported: true
tcfeu_supported: true
coppa_supported: true
schain_supported: true
floors_supported: true
gpp_sids: tcfeu, usstate_all, usp
media_types: banner, video, native
pbjs: true
pbs: true
pbs_app_supported: true
gvl_id: 883
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
