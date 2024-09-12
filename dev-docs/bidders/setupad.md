---
layout: bidder
title: Setupad
description: Setupad bid adapter
gvl_id: 1241
tcfeu_supported: true
usp_supported: true
coppa_supported: false
schain_supported: false
dchain_supported: false
safeframes_ok: false
deals_supported: false
floors_supported: false
fpd_supported: false
pbs_app_supported: false
pbjs: true
pbs: false
biddercode: setupad
media_types: banner
prebid_member: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|----------------+-------+-----------------------------------+-----------+---------|
| `placement_id` | required | Placement ID, provided by setupad | `'12345'` | String |
| `account_id` | required | Account ID, provided by setupad | `'12345'` | String |

### Additional options

#### User Sync

Add the following code to activate user sync. Setupad advises enabling user syncing through iFrames, as it significantly improves partners' user match rates and increases the Setupad bid rate and bid price. Be sure to call `pbjs.setConfig()` only once.

```javascript
pbjs.setConfig({
  userSync: {
    iframeEnabled: true,
    filterSettings: {
      iframe: {
        bidders: ['setupad'],
        filter: 'include',
      },
    },
  },
});
```
