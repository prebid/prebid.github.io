---
layout: bidder
title: JANet
description: Prebid JANet Bidder Adapter
biddercode: janet
aliasCode: adtelligent
media_types: video,banner
gdpr_supported: true
gpp_supported: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
schain_supported: true
coppa_supported: true
usp_supported: true
safeframes_ok: true
prebid_member: true
pbjs: true
pbs: true
sidebarType: 1
---

### Bid params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                     | Example  | Type      |
|-------|----------|---------------------------------|----------|-----------|
| `aid` | required | The source ID from janet.   | `529814` | `integer` |

### Description

JANet header bidding adapter connects with JANet demand sources in order to fetch bids.
This adapter provides a solution for accessing Video demand and display demand.

### Test Parameters

``` javascript
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
          bidder: 'janet',
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
          bidder: 'janet',
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
          bidder: 'janet',
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
          bidder: 'janet',
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

``` javascript
    pbjs.setBidderConfig({
        config: {              
            janet: {
                chunkSize: 1   // makes 1 http request per 1 adunit configured
            }
        }
    });
```
