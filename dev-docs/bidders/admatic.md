---
layout: bidder
title: AdMatic
description: Prebid AdMatic Bidder Adapter.
pbjs: true
pbs: false
biddercode: admatic
media_types: banner,video,native
tcfeu_supported: false
usp_supported: false
coppa_supported: false
schain_supported: false
dchain_supported: false
userIds: criteo, id5Id, sharedId, unifiedId
safeframes_ok: true
floors_supported: true
multiformat_supported: will-bid-on-any
sidebarType: 1
---

### Description

AdMatic header bidding adapter connects with AdMatic demand sources to fetch bids for banner network ID. Please reach out to your account manager or <prebid@admatic.com.tr> for more information.

### Bid params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                        | Example    | Type     |
|--------------|----------|------------------------------------|------------|----------|
| `networkId` | required | The network ID from AdMatic | `12345` | `number` |
| `host` | required | RTB Host | `layer.serve.admatic.com.tr` | `string` |

### Test Parameters

300x250 banner test

```
var adUnits = [{
  code: 'your-slot_1-div',
  mediaTypes: {
    banner: { sizes: [[300, 250]] },
  },
  bids: [{
      bidder: 'admatic',
      params: { 
          networkId: 12345,
          host: 'layer.serve.admatic.com.tr'
      }
  }]
},{
  code: 'your-slot_2-div',
  mediaTypes: {
    native: { ... },
  },
  bids: [{
      bidder: 'admatic',
      params: { 
          networkId: 12345,
          host: 'layer.serve.admatic.com.tr'
      }
  }]
},{
  code: 'your-slot_3-div',
  mediaTypes: {
    video: { ... },
  },
  bids: [{
      bidder: 'admatic',
      params: { 
          networkId: 12345,
          host: 'layer.serve.admatic.com.tr'
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
