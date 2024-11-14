---
layout: bidder
title: AdMatic GMBH
description: Prebid AdMatic GMBH Bidder Adapter.
pbjs: true
pbs: true
biddercode: admaticde
media_types: banner,video,native
gvl_id: 1281 (admatic)
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

AdMatic GMBH header bidding adapter connects with AdMatic GMBH demand sources to fetch bids for network ID. Please reach out to your account manager or <fatih.kaya@admatic.de> for more information.

### Bid params

{: .table .table-bordered .table-striped }

| Name        | Scope    | Description                         | Example  | Type     |
|-------------|----------|-------------------------------------|----------|----------|
| `networkId` | required | The network ID from AdMatic GMBH | `12345` | `number` |
| `host` | required | RTB Host | `rtb.network.admatic.de` | `string` |

### Test Parameters

300x250 banner test

```javascript
var adUnits = [{
  code: 'your-slot_1-div',
  mediaTypes: {
    banner: { sizes: [[300, 250]] },
  },
  bids: [{
      bidder: 'admaticde',
      params: { 
          networkId: 12345,
          host: 'rtb.network.admatic.de'
      }
  }]
},{
  code: 'your-slot_2-div',
  mediaTypes: {
    native: { ... },
  },
  bids: [{
      bidder: 'admaticde',
      params: { 
          networkId: 12345,
          host: 'rtb.network.admatic.de'
      }
  }]
},{
  code: 'your-slot_3-div',
  mediaTypes: {
    video: { ... },
  },
  bids: [{
      bidder: 'admaticde',
      params: { 
          networkId: 12345,
          host: 'rtb.network.admatic.de'
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
