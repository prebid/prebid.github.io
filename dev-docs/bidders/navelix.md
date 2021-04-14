---
layout: bidder
title: Navelix
description: Prebid Navelix Bidder Adapter
biddercode: navelix
aliasCode: adtelligent
media_types: video,banner
gdpr_supported: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
schain_supported: true
coppa_supported: true
usp_supported: true
safeframes_ok: true
prebid_member: true
pbjs: true
pbs: false
---

### Bid params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                     | Example  | Type      |
|-------|----------|---------------------------------|----------|-----------|
| `aid` | required | The source ID from navelix.   | `529814` | `integer` |

### Description
Get access to multiple demand partners across Navelix AdExchange and maximize your yield with Navelix header bidding adapter.

Navelix header bidding adapter connects with Navelix demand sources in order to fetch bids.
This adapter provides a solution for accessing Video demand and display demand.

Navelix now supports adpod. 

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
          bidder: 'navelix',
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
          bidder: 'navelix',
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
          bidder: 'navelix',
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
          bidder: 'navelix',
          params: {
            aid: 529814
          }
        }]
      }
    ];
```

### Additional Configuration

It is possible to configure requests to be split into chunks so as to have fewer bid requests in a single http request 
(default value is 10).

```
    pbjs.setBidderConfig({
        config: {              
            navelix: {
                chunkSize: 1   // makes 1 http request per 1 adunit configured
            }
        }
    });
```
