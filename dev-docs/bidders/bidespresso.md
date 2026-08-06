---
layout: bidder
title: Bid Espresso
description: Prebid Bid Espresso Bidder Adapter
biddercode: bidespresso
media_types: banner, video
tcfeu_supported: false
dsa_supported: true
gvl_id: none
gpp_sids: usnat, usstate_all, usp
usp_supported: true
coppa_supported: true
schain_supported: true
dchain_supported: false
deals_supported: true
floors_supported: true
fpd_supported: true
ortb_blocking_supported: true
multiformat_supported: will-bid-on-any
userIds: all
prebid_member: false
pbjs: true
pbs: false
sidebarType: 1
---

## Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `publisherId` | required | Publisher ID on the Bid Espresso gateway. Provided by Bid Espresso during onboarding. | `'k8xw2r4p'` | `string` |
| `inventoryId` | required | Inventory segment ID, assigned by Bid Espresso during onboarding. Single-placement integrations receive a default segment ID. | `'n7c3tkqe'` | `string` |

## Example Ad Unit

```javascript
var adUnits = [
  {
    code: 'div-ad-leaderboard',
    mediaTypes: {
      banner: {
        sizes: [
          [728, 90],
          [970, 90]
        ]
      }
    },
    bids: [{
      bidder: 'bidespresso',
      params: {
        publisherId: 'k8xw2r4p', // Required - provided by Bid Espresso during onboarding
        inventoryId: 'n7c3tkqe'  // Required - provided by Bid Espresso during onboarding
      }
    }]
  }
];

// Enable iframe user syncing so Bid Espresso can match users to demand.
// Required — without it no syncs fire and match rates drop.
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: ['bidespresso'],
        filter: 'include'
      }
    }
  }
});
```
