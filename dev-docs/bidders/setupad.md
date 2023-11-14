---
layout: bidder
title: Setupad
description: Setupad bid adapter
gvl_id: dev-docs/bidders/setupad.md
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
| `account_id` | optional | Account ID, provided by setupad | `'12345'` | String |

### Additional options

#### User Sync

Add the following code to enable user sync. Setupad strongly recommends enabling user syncing through iFrames. This functionality improves partners' user match rates and increases the Setupad bid rate and bid price. Be sure to call `pbjs.setConfig()` only once.

```
pbjs.setConfig({
    userSync: {
        iframeEnabled: true,
        filterSettings: {
            iframe: {
                bidders: '*',   // '*' means all bidders
                filter: 'include'
            }
        }
    }
});
```

#### disabledSendingStatisticData

The `disabledSendingStatisticData` parameter disables sending statistics data to the setupad server, such as bidRequested, bidResponse, noBid and bidTimeout events.
An example of enabling this option:

```javascript
pbjs.setBidderConfig({
  bidders: ['setupad'],
  config: {
    disabledSendingStatisticData: true,
  },
});
```
