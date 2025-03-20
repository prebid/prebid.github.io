---
layout: bidder
title: MediaEyes
description: MediaEyes Bidder Adapter
pbjs: true
pbs: false
gvl_id: none
biddercode: mediaeyes
media_types: banner
gdpr_supported: false
usp_supported: false
coppa_supported: false
schain_supported: false
safeframes_ok: false
dchain_supported: false
deals_supported: false
floors_supported: true
fpd_supported: false
ortb_blocking_supported: false
multiformat_supported: will-bid-on-one
prebid_member: false
---

### Description

MediaEyes adapter prebid connect to MediaEyes Bidding System.

### Bid params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                        | Example                     | Type     |
|--------------|----------|------------------------------------|-----------------------------|----------|
| `itemId`     | required | The item ID from MediaEyes         | `'4d27f3cc8bbd5bd153045e'`  | `string` |
| `bidFloor`   | optional | Lowest value of expected bid price | `0.1`                       | `float`  |

### Test Parameters

300x250 banner test

```javascript
var adUnits = [{
  code: 'zone-ads',
  mediaTypes: {
    banner: {
      sizes: [[300, 250]]
    }
  },
  bids: [{
    bidder: 'mediaeyes',
    params : {
      itemId : "4d27f3cc8bbd5bd153045e"
    }
  }]
}];
```
