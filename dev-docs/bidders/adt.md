---
layout: bidder
title: AdTarget Teknoloji
description: Prebid AdTarget Teknoloji Bidder Adapter.
pbjs: true
pbs: true
biddercode: adt
media_types: banner,video,native
gvl_id: 779
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

AdTarget Teknoloji header bidding adapter connects with AdTarget Teknoloji demand sources to fetch bids for network ID. Please reach out to your account manager or <kamil@adtarget.com.tr> for more information.

### Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                         | Example  | Type     |
|-------------|----------|-------------------------------------|----------|----------|
| `networkId` | required | The network ID from AdTarget Teknoloji | `12345` | `number` |
| `host` | required | RTB Host | `adt.rtb.adtarget.biz` | `string` |

### Test Parameters

300x250 banner test

```javascript
var adUnits = [{
  code: 'your-slot_1-div',
  mediaTypes: {
    banner: { sizes: [[300, 250]] },
  },
  bids: [{
      bidder: 'adt',
      params: { 
          networkId: 12345,
          host: 'adt.rtb.adtarget.biz'
      }
  }]
},{
  code: 'your-slot_2-div',
  mediaTypes: {
    native: { ... },
  },
  bids: [{
      bidder: 'adt',
      params: { 
          networkId: 12345,
          host: 'adt.rtb.adtarget.biz'
      }
  }]
},{
  code: 'your-slot_3-div',
  mediaTypes: {
    video: { ... },
  },
  bids: [{
      bidder: 'adt',
      params: { 
          networkId: 12345,
          host: 'adt.rtb.adtarget.biz'
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
