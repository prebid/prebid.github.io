---
layout: bidder
title: Pixad
description: Prebid Pixad Bidder Adapter.
pbjs: true
pbs: false
biddercode: pixad
media_types: banner,video
gdpr_supported: false
usp_supported: false
coppa_supported: false
schain_supported: false
dchain_supported: false
userIds: criteo, id5Id, sharedId, unifiedId
safeframes_ok: true
floors_supported: false
aliasCode: admatic
multiformat_supported: will-bid-on-any
sidebarType: 1
---

### Description

Pixad header bidding adapter connects with Pixad demand sources to fetch bids for banner network ID. Please reach out to your account manager or <prebid@pixad.com.tr> for more information.

### Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                         | Example  | Type     |
|-------------|----------|-------------------------------------|----------|----------|
| `networkId` | required | The network ID from Pixad | `12345` | `number` |
| `host` | required | RTB Host | `rtb.network.pixad.com.tr` | `string` |

### Test Parameters

300x250 banner test
```
var adUnits = [{
  code: 'your-slot_1-div', //use exactly the same code as your slot div id.
  sizes: [[300, 250]],
  bids: [{
      bidder: 'pixad',
      params: { 
          networkId: 12345,
          host: 'rtb.network.pixad.com.tr'
      }
  }]
},{
  code: 'your-slot_2-div', //use exactly the same code as your slot div id.
  sizes: [[600, 800]],
  bids: [{
      bidder: 'pixad',
      params: { 
          networkId: 12345,
          host: 'rtb.network.pixad.com.tr'
      }
  }]
}];
```

## UserSync example

```
pbjs.setConfig({
  userSync: {
    iframeEnabled: true,
    syncEnabled: true,
    syncDelay: 1
  }
});
```
