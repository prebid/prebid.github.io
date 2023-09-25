---
layout: bidder
title: NextMillennium
description: NextMillennium bid adapter
gvl_id: dev-docs/bidders/nextMillennium.md
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
pbs: true
biddercode: nextMillennium
media_types: banner, video
prebid_member: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope | Description                              | Example   | Type    |
|----------------+-------+-----------------------------------+-----------+---------|
| `placement_id` | required | Placement ID, provided by nextMillennium | `'12345'` | String  |
| `group_id`     | optional | Group ID, provided by nextMillennium     | `'12345'` | String  |

Required one of the two parameters placement_id or group_id.

Further information for the auction on NextMillennium side is generated automatically.

### Additional options

#### disabledSendingStatisticData

The `disabledSendingStatisticData` parameter disables sending statistics data to the nextMillennium server, such as bidRequested, bidResponse, noBid and bidTimeout events.
An example of enabling this option:  

```javascript
pbjs.setBidderConfig({
  bidders: ['nextMillennium'],
  config: {
    disabledSendingStatisticData: true,
  },
})
```
