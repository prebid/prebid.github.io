---
layout: bidder
title: Mgid
description: Prebid Mgid Bidder Adapter.
hide: true
biddercode: mgid
biddercode_longer_than_12: false
media_types: banner
gdpr_supported: true
---

### Table of Contents

- [Description](#mgid-bid-desc)
- [Bid Params](#mgid-bid-params)
- [Test Params](#mgid-test-params)

<a name="mgid-bid-desc" />

### Description

One of the easiest way to gain access to MGID demand sources  - MGID header bidding adapter.

MGID header bidding adapter connects with MGID demand sources to fetch bids for display placements. Please reach out to your account manager or <prebid@mgid.com> for more information.

<a name="mgid-bid-params" />

### Bid params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                 | Example    | Type     |
|--------------|----------|-----------------------------|------------|----------|
| `accountId`  | required | The account ID from Mgid    | `'123'`    | `string` |
| `placementId`| required | The placement ID from Mgid  | `'123456'` | `string` |


<a name="mgid-test-params" />

### Test Parameters

300x600 banner test
```
var adUnits = [{
  code: 'div-prebid',
  mediaTypes: {
    banner: {
      sizes: [[300, 600]]
    }
  },
  // Replace this object to test a new Adapter!
  bids: [{
    bidder: 'mgid',
    params : {
      accountId : "219", //test accountId, please replace after test
      placementId : "331749" // 300x600 test placementId, please replace after test
    }
  }]
}];
```

300x250 banner test
```
var adUnits = [{
  code: 'div-prebid',
  mediaTypes: {
    banner: {
      sizes: [[300, 250]]
    }
  },
  // Replace this object to test a new Adapter!
  bids: [{
    bidder: 'mgid',
    params : {
      accountId : "219", //test accountId, please replace after test
      placementId : "331748" // 300x250 test placementId, please replace after test
    }
  }]
}];
```
