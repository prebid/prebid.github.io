---
layout: bidder
title: Adtelligent
description: Prebid Adtelligent Bidder Adapter
biddercode: adtelligent
media_types: video,banner
gdpr_supported: true
gpp_supported: true
userIds: all (with commercial activation)
schain_supported: true
coppa_supported: true
usp_supported: true
safeframes_ok: true
prebid_member: true
pbjs: true
pbs: true
gvl_id: 410
sidebarType: 1
---

### Bid params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                     | Example  | Type      |
|-------|----------|---------------------------------|----------|-----------|
| `aid` | required | The source ID from Adtelligent. | `350975` | `integer` |

### Description

Get access to multiple demand partners across Adtelligent AdExchange and maximize your yield with Adtelligent header bidding adapter.

Adtelligent header bidding adapter connects with Adtelligent demand sources in order to fetch bids.
This adapter provides a solution for accessing Video demand and display demand.

Adtelligent now supports adpod.

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
          bidder: 'adtelligent',
          params: {
            aid: 331133
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
          bidder: 'adtelligent',
          params: {
            aid: 331133
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
          bidder: 'adtelligent',
          params: {
            aid: 331133
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
          bidder: 'adtelligent',
          params: {
            aid: 350975
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
            adtelligent: {
                chunkSize: 1   // makes 1 http request per 1 adunit configured
            }
        }
    });
```
