---
layout: bidder
title: StellorMedia
description: Stellor Media Bidder Adapter
biddercode: stellormedia
aliasCode: adtelligent
media_types: video,banner
tcfeu_supported: false
gpp_sids: usp
userId: all (with commercial activation)
schain_supported: true
coppa_supported: true
usp_supported: true
safeframes_ok: true
prebid_member: false
pbjs: true
pbs: false
deals_supported: false
sidebarType: 1
---

### Bid params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|-------|----------|---------------------------------|----------|-----------|
| `aid` | required | The source ID from Stellor Media. | `12412` | `integer` |

### Description

Stellor Media header bidding adapter connects with Indicue Media demand sources in order to fetch bids.
This adapter provides a solution for accessing Video demand and display demand.

### Test Parameters

```javascript
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
          bidder: 'stellormedia',
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
          bidder: 'stellormedia',
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
          bidder: 'stellormedia',
          params: {
            aid: 529814
          }
        }]
      }
    ];
```
