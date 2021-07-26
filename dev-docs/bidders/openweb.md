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
| `aid` | required | The source ID from OpenWeb. | `650342` | `integer` |

### Description
OpenWeb.com official prebid adapter. Available in both client and server side versions.
OpenWeb header bidding adapter provides solution for accessing both Video and Display demand.

### Test Parameters
```
var adUnits = [
    // Video instream adUnit
    {
        code: 'test-div',
        mediaTypes: {
          video: {
            context: 'instream',
            playerSize: [640, 480]
          }
        },
        bids: [{
          bidder: 'openweb',
          params: {
            aid: 650344
          }
        }]
    },
    // Banner adUnit
    {
        mediaTypes: {
          banner: {
            sizes: [[300, 250]]
          }
        },
        code: 'div-test-div',
        bids: [{
         bidder: 'openweb',
         params: {
           aid: 650342
         }
        }]
    },
    // Prebid server 
    {
        mediaTypes: {
          banner: {
            sizes: [[300, 250]]
          }
        },
        code: 'div-test-div',
        bids: [{
         bidder: 'openweb',
         params: {
           aid: 650346
         }
        }]
    }
];
```
