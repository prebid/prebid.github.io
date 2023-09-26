---
layout: bidder
title: Mgid
description: Prebid Mgid Bidder Adapter.
pbjs: true
pbs: true
biddercode: mgid
media_types: banner,native
tcfeu_supported: true
usp_supported: true
gvl_id: 358
floors_supported: true
ortb_blocking_supported: partial
multiformat_supported: will-bid-on-any
sidebarType: 1
---

### Table of Contents

- [Table of Contents](#table-of-contents)
- [Description](#description)
- [Bid params](#bid-params)
- [Test Parameters](#test-parameters)
- [User Sync](#user-sync)

<a name="mgid-bid-desc"></a>

### Description

One of the easiest way to gain access to MGID demand sources  - MGID header bidding adapter.

MGID header bidding adapter connects with MGID demand sources to fetch bids for display placements. Please reach out to your account manager or <prebid@mgid.com> for more information.

<a name="mgid-bid-params"></a>

### Bid params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                        | Example    | Type     |
|--------------|----------|------------------------------------|------------|----------|
| `accountId`  | required | The account ID from Mgid           | `'123'`    | `string` |
| `placementId`| optional | The placement ID from Mgid         | `'123456'` | `string` |
| `bidFloor`   | optional | Lowest value of expected bid price | `1.1`      | `float`  |
| `currency`   | optional | Currency of request and response   | `'GBP'`    | `string` |

<a name="mgid-test-params"></a>

### Test Parameters

300x600 banner test

```javascript
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

```javascript
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

```javascript
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

<a name="mgid-user-sync"></a>

### User Sync

Mgid recommends UserSync configuration to be enabled. Without it, Mgid adapter will not be able to perform user syncs, which lowers match rate and reduces monetization.

For Prebid.js v1.15.0 and later:

```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: '*',      // '*' represents all bidders
        filter: 'include'
      }
    }
  }
});
```

For Prebid.js v1.14.0 and before:

```javascript
pbjs.setConfig({
   userSync: {
    iframeEnabled: true,
    enabledBidders: ['mgid']
 }});
```

Note: Combine the above configuration with any other UserSync configuration. Multiple setConfig() calls overwrite each other and only the last call for a given attribute will take effect.
