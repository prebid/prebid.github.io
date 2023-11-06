---
layout: bidder
title: MediaBrama
description: Prebid MediaBrama Bidder Adapter.
pbjs: true
pbs: false
gvl_id: none
biddercode: mediabrama
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

MediaBrama header bidding adapter connects with mediabrama demand sources to fetch bids for display placements. Please reach out to your account manager or <support@mediabrama.com> for more information.

### Bid params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                        | Example    | Type     |
|--------------|----------|------------------------------------|------------|----------|
| `placementId`| optional | The placement ID from MediaBrama   | `'24428'`  | `string` |
| `bidFloor`   | optional | Lowest value of expected bid price | `1.1`      | `float`  |

### Test Parameters

300x250 banner test

```javascript
var adUnits = [{
  code: 'prebid-place',
  mediaTypes: {
    banner: {
      sizes: [[300, 250]]
    }
  },
  // Replace this object to test a new Adapter!
  bids: [{
    bidder: 'mediabrama',
    params : {
      placementId : "24428" //test, please replace after test
    }
  }]
}];
```
