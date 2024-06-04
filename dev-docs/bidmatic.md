---
layout: bidder
title: Bidmatic Bid Adapter
description: Prebid example Bidder Adapter
biddercode: bidmatic
tcfeu_supported: true
dsa_supported: true
gvl_id: 1134
usp_supported: true
coppa_supported: true
gpp_sids: tcfeu, usp
schain_supported: true
dchain_supported: false
userId: all
media_types: banner, video
safeframes_ok: true
deals_supported: false
floors_supported: true
fpd_supported: true
pbjs: true
pbs: true
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: true
sidebarType: 1
---

### Note

Unleash the power of fast client-oRTB connection.
Contact us at [advertising@bidmatic.io](mailto:advertising@bidmatic.io).

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `source`      | required | Traffic source origin id      | `'11111'`    | `int` |

### Test Parameters

``` javascript
    var adUnits = [
      // Banner adUnit
      {
        code: 'elemtId',
        mediaTypes:{
            banner:{
                sizes: [[300, 250]]
            }
        }
        bids: [{
          bidder: 'bidmatic',
          params: {
            source: 886409
          }
        }]
      }
    ];
```
