---
layout: bidder
title: OpenWeb
description: Prebid OpenWeb Bidder Adapter
biddercode: openweb
media_types: video,banner,adpod
gdpr_supported: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
schain_supported: true
coppa_supported: true
usp_supported: true
safeframes_ok: true
prebid_member: true
pbjs: true
pbs: true
gvl_id: 280
---

### Bid params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                     | Example  | Type      |
|-------|----------|---------------------------------|----------|-----------|
| `aid` | required | The source ID from OpenWeb. | `350975` | `integer` |

### Description
OpenWeb.com official prebid adapter. Available in both client and server side versions.
OpenWeb header bidding adapter provides solution for accessing both Video and Display demand.

### Test Parameters
```
   var adUnits = [
         // Banner adUnit
         {
           code: 'div-test-div',
           sizes: [[300, 250]],
           bids: [{
             bidder: 'openweb',
             params: {
               aid: 529814
             }
           }]
         }
       ];
```
