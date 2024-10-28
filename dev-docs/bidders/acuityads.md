---
layout: bidder
title: AcuityAds
description: Prebid AcuityAds Bidder Adaptor
biddercode: acuityads
filename: acuityadsBidAdapter
gvl_id: 231
tcfeu_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
gpp_supported: true
userId: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
media_types: banner, video, native
safeframes_ok: true
deals_supported: true
pbjs: true
pbs: true
sidebarType: 1
---

### Note

The Example Bidding adapter requires setup before beginning. Please contact us at <rafi.babler@acuityads.com>

### Prebid.JS Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `placementId` | required | Placement ID          | `'123'`     | `string`  |

### Prebid Server Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `host`      | required | Region id               | `'ep1'`    | `string` |
| `accountid`      | required | Endpoint id / Placement id | `'hash'`    | `string` |
