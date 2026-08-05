---
layout: bidder
title: Bid Espresso
description: Prebid Bid Espresso Bidder Adapter
biddercode: bidespresso
media_types: banner, video
tcfeu_supported: false
dsa_supported: false
gvl_id: none
gpp_sids: usnat, usstate_all, usp
usp_supported: true
coppa_supported: true
schain_supported: false
dchain_supported: false
deals_supported: false
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

### Note

The Bid Espresso adapter sends a single OpenRTB request per auction to the
Bid Espresso gateway, which enriches it and fans out to demand server-side.
Bids are returned net of the Bid Espresso margin. Registration is required —
contact prebid@bidespresso.com to receive your `publisherId` and `inventoryId`.

Outstream video requires a publisher-supplied renderer. Mixed banner+video
ad units are fully supported: both media objects are sent on a single imp
and either media class can bid.

User syncing requires iframe syncs to be enabled for this bidder in the
publisher's `userSync` configuration; the adapter registers no syncs in
pixel-only mode. Price floors from the floors module are forwarded only when
they resolve in USD; floors configured in another currency are converted
automatically when the currency module is present.

### Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                                                                    | Example      | Type     |
|---------------|----------|------------------------------------------------------------------------------------------------|--------------|----------|
| `publisherId` | required | Publisher ID on the Bid Espresso gateway. Provided by Bid Espresso during onboarding.           | `'k8xw2r4p'` | `string` |
| `inventoryId` | required | Inventory segment ID. Always assigned by Bid Espresso during onboarding — single-placement integrations receive their default segment ID. | `'n7c3tkqe'` | `string` |

### Example Ad Unit

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
        inventoryId: 'n7c3tkqe'  // Required - assigned by Bid Espresso during onboarding
      }
    }]
  }
];
```
