---
layout: bidder
title: AdRubi
description: Prebid AdRubi Bidder Adapter.
pbjs: true
pbs: true
biddercode: adrubi
media_types: banner,video,native
gvl_id: 779 (adt)
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

AdRubi header bidding adapter connects with AdRubi demand sources to fetch bids for network ID. Please reach out to your account manager or <support@adrubi.com> for more information.

### Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                         | Example  | Type     |
|-------------|----------|-------------------------------------|----------|----------|
| `networkId` | required | The network ID from AdRubi | `12345` | `number` |
| `host` | required | RTB Host | `adrubi.rtb.adrubi.com` | `string` |

### Test Parameters

300x250 banner test

```javascript
var adUnits = [{
  code: 'your-slot_1-div',
  mediaTypes: {
    banner: { sizes: [[300, 250]] },
  },
  bids: [{
      bidder: 'adrubi',
      params: { 
          networkId: 12345,
          host: 'adrubi.rtb.adrubi.com'
      }
  }]
},{
  code: 'your-slot_2-div',
  mediaTypes: {
    native: { ... },
  },
  bids: [{
      bidder: 'adrubi',
      params: { 
          networkId: 12345,
          host: 'adrubi.rtb.adrubi.com'
      }
  }]
},{
  code: 'your-slot_3-div',
  mediaTypes: {
    video: { ... },
  },
  bids: [{
      bidder: 'adrubi',
      params: { 
          networkId: 12345,
          host: 'adrubi.rtb.adrubi.com'
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
