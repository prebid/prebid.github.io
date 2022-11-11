---
layout: bidder
title: Redtram
description: Prebid Redtram Bidder Adapter.
pbjs: true
biddercode: redtram
media_types: banner
---

### Table of Contents

- [Description](#redtram-bid-desc)
- [Bid Params](#redtram-bid-params)
- [Test Params](#redtram-test-params)

<a name="redtram-bid-desc" />

### Description

Redtram header bidding adapter connects with redtram demand sources to fetch bids for display placements. Please reach out to your account manager or <support@redtram.com> for more information.

<a name="redtram-bid-params" />

### Bid params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                        | Example    | Type     |
|--------------|----------|------------------------------------|------------|----------|
| `placementId`| optional | The placement ID from Redtram      | `'23611'`  | `string` |
| `bidFloor`   | optional | Lowest value of expected bid price | `1.1`      | `float`  |
| `currency`   | optional | Currency of request and response   | `'USD'`    | `string` |


<a name="redtram-test-params" />

### Test Parameters

300x250 banner test
```
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
