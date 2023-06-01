---
layout: bidder
title: SSP Copper6
description: SSP Copper6 Bidder Adapter
biddercode: copper6
aliasCode: adtelligent
media_types: video,banner
gdpr_supported: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
schain_supported: true
coppa_supported: true
usp_supported: true
safeframes_ok: true
prebid_member: false
pbjs: true
pbs: true
deals_supported: false
sidebarType: 1
---

### Bid params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                     | Example  | Type      |
|-------|----------|---------------------------------|----------|-----------|
| `aid` | required | The source ID from Copper6 Media.   | `12412` | `integer` |

### Description
Copper6 Media header bidding adapter connects with Copper6 Media demand sources in order to fetch bids.
This adapter provides a solution for accessing Video demand and display demand.


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
          bidder: 'copper6',
          params: {
            aid: 472386
          }
        }]
      },

      // Video outstream adUnit
      {
        code: 'test-div',
        mediaTypes: {
          video: {
            context: 'outstream',
            playerSize: [640, 480]
          }
        },
        bids: [{
          bidder: 'copper6',
          params: {
            aid: 472386
          }
        }]
      },

       // Video ADPOD adUnit
      {
        code: 'test-div',
        sizes: [[640, 480]],
        mediaTypes: {
          video: {
            context: 'adpod',
            playerSize: [640, 480]            
          }
        },
        bids: [{
          bidder: 'copper6',
          params: {
            aid: 472386
          }
        }]
      },

      // Banner adUnit
      {
        code: 'test-div',
        mediaTypes:{
            banner:{
                sizes: [[300, 250]]
            }
        }
        bids: [{
          bidder: 'copper6',
          params: {
            aid: 529814
          }
        }]
      }
    ];
```
