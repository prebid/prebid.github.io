---
layout: bidder
title: Pixad
description: Prebid Pixad Bidder Adapter.
pbjs: true
pbs: false
biddercode: pixad
media_types: banner,video,native
gvl_id: 1281
tcfeu_supported: true
usp_supported: true
coppa_supported: true
gpp_sids: tcfeu, tcfca, usnat, usstate_all, usp
schain_supported: true
dchain_supported: false
userIds: criteo, id5Id, sharedId, unifiedId
safeframes_ok: true
floors_supported: true
aliasCode: admatic
multiformat_supported: will-bid-on-any
sidebarType: 1
---

### Description

Pixad header bidding adapter connects with Pixad demand sources to fetch bids for network ID. Please reach out to your account manager or <prebid@pixad.com.tr> for more information.

### Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                         | Example  | Type     |
|-------------|----------|-------------------------------------|----------|----------|
| `networkId` | required | The network ID from Pixad | `12345` | `number` |
| `host` | required | RTB Host | `rtb.network.pixad.com.tr` | `string` |

### Test Parameters

300x250 banner test

```javascript
var adUnits = [{
  code: 'your-slot_1-div',
  mediaTypes: {
    banner: { sizes: [[300, 250]] },
  },
  bids: [{
      bidder: 'pixad',
      params: { 
          networkId: 12345,
          host: 'rtb.network.pixad.com.tr'
      }
  }]
},{
  code: 'your-slot_2-div',
  mediaTypes: {
    native: { ... },
  },
  bids: [{
      bidder: 'pixad',
      params: { 
          networkId: 12345,
          host: 'rtb.network.pixad.com.tr'
      }
  }]
},{
  code: 'your-slot_3-div',
  mediaTypes: {
    video: { ... },
  },
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
