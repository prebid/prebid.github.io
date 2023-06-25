---
layout: bidder
title: Redtram
description: Prebid Redtram Bidder Adapter.
pbjs: true
pbs: false
gvl_id: none
biddercode: redtram
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
sidebarType: 1
---

### Table of Contents

- [Table of Contents](#table-of-contents)
- [Description](#description)
- [Bid params](#bid-params)
- [Test Parameters](#test-parameters)

<a name="redtram-bid-desc"></a>

### Description

Redtram header bidding adapter connects with redtram demand sources to fetch bids for display placements. Please reach out to your account manager or <support@redtram.com> for more information.

<a name="redtram-bid-params"></a>

### Bid params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                        | Example    | Type     |
|--------------|----------|------------------------------------|------------|----------|
| `placementId`| optional | The placement ID from Redtram      | `'23611'`  | `string` |
| `bidFloor`   | optional | Lowest value of expected bid price | `1.1`      | `float`  |

<a name="redtram-test-params"></a>

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
    bidder: 'redtram',
    params : {
      placementId : "23611" //test, please replace after test
    }
  }]
}];
```
