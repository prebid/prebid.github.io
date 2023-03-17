---
layout: bidder
title: Mgid
description: Prebid Mgid Bidder Adapter.
pbjs: true
pbs: true
biddercode: mgid
media_types: banner,native
gdpr_supported: true
gvl_id: 358
sidebarType: 1
---

### Table of Contents

- [Table of Contents](#table-of-contents)
- [Description](#description)
- [Bid params](#bid-params)
- [Test Parameters](#test-parameters)

<a name="mgid-bid-desc" />

### Description

One of the easiest way to gain access to MGID demand sources  - MGID header bidding adapter.

MGID header bidding adapter connects with MGID demand sources to fetch bids for display placements. Please reach out to your account manager or <prebid@mgid.com> for more information.

<a name="mgid-bid-params" />

### Bid params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                        | Example    | Type     |
|--------------|----------|------------------------------------|------------|----------|
| `accountId`  | required | The account ID from Mgid           | `'123'`    | `string` |
| `placementId`| optional | The placement ID from Mgid         | `'123456'` | `string` |
| `bidFloor`   | optional | Lowest value of expected bid price | `1.1`      | `float`  |
| `currency`   | optional | Currency of request and response   | `'GBP'`    | `string` |


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
      accountId : "219" //test accountId, please replace after test
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
      accountId : "219" //test accountId, please replace after test
    }
  }]
}];
```

native test
```
var adUnits = [{
  code: 'div-prebid',
  mediaTypes: {
    native: {
        image: {
            sendId: true,
            required: true,
            sizes: [80, 80]
        },
        clickUrl: {
            sendId: true,
            required: false
        },
        title: {
            required: true,
            len: 80
        },
        sponsored: {
            required: false
        }
    }
  },
  // Replace this object to test a new Adapter!
  bids: [{
    bidder: 'mgid',
    params : {
        accountId : "219" //test accountId, please replace after test
    }
  }]
}];
```
