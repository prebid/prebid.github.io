---
layout: bidder
title: PGAMSSP
description: Prebid PGAMSSP Bidder Adapter
biddercode: pgamssp
usp_supported: true
gvl_id: 1353
tcfeu_supported: true
coppa_supported: true
schain_supported: true
floors_supported: true
gpp_sids: tcfeu, usstate_all, usp
media_types: banner, video, native
pbjs: true
pbs: true
pbs_app_supported: true
sidebarType: 1
multiformat_supported: will-bid-on-one
safeframes_ok: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `placementId`      | optional | Placement Id         | `'0'`    | `'string'` |
| `endpointId`       | optional | Endpoint Id          | `'0'`    | `'string'` |

### Note

For the prebid server and prebid.js you only need to use one parameter: either placementId or endpointId
