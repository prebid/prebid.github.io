---
layout: bidder
title: Monetix Ads
description: Prebid Monetix Bidder Adapter.
pbjs: true
pbs: true
biddercode: monetixads
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

Monetix Ads header bidding adapter connects with Monetix Ads demand sources to fetch bids for network ID. Please reach out to your account manager or <team@monetixads.com> for more information.

### Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                         | Example  | Type     |
|-------------|----------|-------------------------------------|----------|----------|
| `networkId` | required | The network ID from Monetix Ads | `12345` | `number` |
| `host` | required | RTB Host | `rtb.network.monetixads.com` | `string` |

### Test Parameters

300x250 banner test

```javascript
var adUnits = [{
  code: 'your-slot_1-div',
  mediaTypes: {
    banner: { sizes: [[300, 250]] },
  },
  bids: [{
      bidder: 'monetixads',
      params: { 
          networkId: 12345,
          host: 'rtb.network.monetixads.com'
      }
  }]
},{
  code: 'your-slot_2-div',
  mediaTypes: {
    native: { ... },
  },
  bids: [{
      bidder: 'monetixads',
      params: { 
          networkId: 12345,
          host: 'rtb.network.monetixads.com'
      }
  }]
},{
  code: 'your-slot_3-div',
  mediaTypes: {
    video: { ... },
  },
  bids: [{
      bidder: 'monetixads',
      params: { 
          networkId: 12345,
          host: 'rtb.network.monetixads.com'
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
