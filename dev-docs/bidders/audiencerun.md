---
layout: bidder
title: AudienceRun
description: Prebid AudienceRun Bidder Adaptor
pbjs: true
biddercode: audiencerun
media_types: banner
gvl_id: 944
gdpr_supported: true
usp_supported: true
schain_supported: true
safeframes_ok: false
prebid_member: false
userIds: all
floors_supported: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                                                 | Example        | Type     |
| ---------- | -------- | --------------------------------------------------------------------------- | -------------- | -------- |
| `zoneId`   | required | The zone id provided by AudienceRun                                         | `'xtov2mgij0'` | `string` |
| `bidfloor` | optional | The bid floor for the zone id provided by AudienceRun in USD (default: 0.0) | `0.5`          | `float`  |

### Registration

The AudienceRun Header Bidding adaptor requires setup and approval from the AudienceRun team. Please reach out to our team on <https://www.audiencerun.com/> for more details.

### Example

Use `audiencerun` as bidder. Note that `zoneId` is required and must be 10 alphanumeric characters.

```js
var adUnits = [
  {
    code: "test-div",
    sizes: [[300, 600]],
    bids: [
      {
        bidder: "audiencerun",
        params: {
          zoneId: "xtov2mgij0",
        },
      },
    ],
  },
];
```
