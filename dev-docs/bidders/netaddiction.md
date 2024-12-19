---
layout: bidder
title: NetAddiction
description: Prebid NetAddiction Bidder Adapter.
pbjs: true
pbs: true
biddercode: netaddiction
media_types: banner,video,native
gvl_id: 1281 (admatic)
tcfeu_supported: true
usp_supported: true
coppa_supported: true
gpp_sids: tcfeu, tcfca, usnat, usstate_all, usp
schain_supported: true
dchain_supported: false
userIds: all
safeframes_ok: true
floors_supported: true
aliasCode: admatic
multiformat_supported: will-bid-on-any
sidebarType: 1
---

### Description

NetAddiction header bidding adapter connects with NetAddiction demand sources to fetch bids for network ID. Please reach out to your account manager or <publishers-support@netaddiction.it> for more information.

### Bid params

{: .table .table-bordered .table-striped }

| Name        | Scope    | Description                         | Example  | Type     |
|-------------|----------|-------------------------------------|----------|----------|
| `networkId` | required | The network ID from NetAddiction | `12345` | `number` |
| `host` | required | RTB Host | `netaddiction.rtb.netaddiction.tech` | `string` |

### Test Parameters

300x250 banner test

```javascript
var adUnits = [{
  code: 'your-slot_1-div',
  mediaTypes: {
    banner: { sizes: [[300, 250]] },
  },
  bids: [{
      bidder: 'netaddiction',
      params: { 
          networkId: 12345,
          host: 'rtb.network.netaddiction.tech'
      }
  }]
},{
  code: 'your-slot_2-div',
  mediaTypes: {
    native: { ... },
  },
  bids: [{
      bidder: 'netaddiction',
      params: { 
          networkId: 12345,
          host: 'rtb.network.netaddiction.tech'
      }
  }]
},{
  code: 'your-slot_3-div',
  mediaTypes: {
    video: { ... },
  },
  bids: [{
      bidder: 'netaddiction',
      params: { 
          networkId: 12345,
          host: 'rtb.network.netaddiction.tech'
      }
  }]
}];
```

### UserSync example

```javascript
pbjs.setConfig({
  userSync: {
    iframeEnabled: true,
    syncEnabled: true,
    syncDelay: 1,
    aliasSyncEnabled: true
  }
});
```
