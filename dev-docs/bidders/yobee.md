---
layout: bidder
title: Yobee
description: Prebid Yobee Bidder Adapter.
pbjs: true
pbs: true
biddercode: yobee
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

Yobee header bidding adapter connects with Yobee demand sources to fetch bids for network ID. Please reach out to your account manager or <adops@yobee.it> for more information.

### Bid params

{: .table .table-bordered .table-striped }

| Name        | Scope    | Description                         | Example  | Type     |
|-------------|----------|-------------------------------------|----------|----------|
| `networkId` | required | The network ID from Yobee | `12345` | `number` |
| `host` | required | RTB Host | `*.rtb.yobee.it` | `string` |

### Test Parameters

300x250 banner test

```javascript
var adUnits = [{
  code: 'your-slot_1-div',
  mediaTypes: {
    banner: { sizes: [[300, 250]] },
  },
  bids: [{
      bidder: 'yobee',
      params: { 
          networkId: 12345,
          host: '*.rtb.yobee.it'
      }
  }]
},{
  code: 'your-slot_2-div',
  mediaTypes: {
    native: { ... },
  },
  bids: [{
      bidder: 'yobee',
      params: { 
          networkId: 12345,
          host: '*.rtb.yobee.it'
      }
  }]
},{
  code: 'your-slot_3-div',
  mediaTypes: {
    video: { ... },
  },
  bids: [{
      bidder: 'yobee',
      params: { 
          networkId: 12345,
          host: '*.rtb.yobee.it'
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
