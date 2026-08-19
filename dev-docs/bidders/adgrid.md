---
layout: bidder
title: AdGrid
description: Prebid AdGrid Bidder Adapter
biddercode: adgrid
media_types: banner, video
pbjs: true
tcfeu_supported: false
dsa_supported: false
gvl_id: none
usp_supported: false
coppa_supported: false
gpp_sids: none
schain_supported: true
dchain_supported: false
userId: no
safeframes_ok: false
deals_supported: false
floors_supported: true
fpd_supported: false
prebid_member: false
ortb_blocking_supported: false
privacy_sandbox: no
sidebarType: 1
---

### Note

The AdGrid Bidding Adapter requires setup and approval before beginning. Please reach out to <support@adgrid.io> for more details.

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description  | Example | Type      |
|------------|----------|--------------|---------|-----------|
| `domainId` | required | Publisher Id | `30164` | `integer` |
| `placement`| required | Placement    | `global`| `string`  |

### Test Parameters

```javascript
var adUnits = [
  // Banner adUnit
  {
    code: 'test-div-1',
    mediaTypes:{
      banner:{
        sizes: [[300, 250]]
      }
    }
    bids: [{
      bidder: 'adgrid',
      params: {
        domainId: 12345,
        placement: 'global'
      }
    }]
  },
  {
    code: 'test-div-2',
    mediaTypes:{
      banner:{
        sizes: [[728, 90], [320, 50]]
      }
    }
    bids: [{
      bidder: 'adgrid',
      params: {
        domainId: 12345,
        placement: 'global'
      }
    }]
  },
  // Video adUnit
  {
    code: 'test-video-div',
    mediaTypes: {
      video: {
        playerSize: [
          [640, 480]
        ],
        context: 'instream'
      }
    },
    bids: [{
      bidder: 'adgrid',
      params: {
        domainId: 12345,
        placement: 'global'
      }
    }]
  }
];
```
