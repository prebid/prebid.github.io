---
layout: bidder
title: Adcluster
description: Prebid Adcluster Bidder Adapter
pbjs: true
pbs: false
biddercode: adcluster
media_types: banner, video
tcfeu_supported: false
usp_supported: false
coppa_supported: false
schain_supported: false
dchain_supported: false
prebid_member: false
safeframes_ok: true
floors_supported: true
multiformat_supported: will-bid-on-any
sidebarType: 1
---

### Description

The Adcluster bidding adapter requires setup & approval before usage. Please reach out to <dev@adcluster.com.tr> for more information.

### Bid Params

{: .table .table-bordered .table-striped }

| Name     | Scope    | Description       | Example                                | Type     |
| -------- | -------- | ----------------- | -------------------------------------- | -------- |
| `unitId` | required | Adcluster Unit ID | `10f4f9f3-cc3f-4f20-982d-5cbba92adfdc` | `string` |

### Example

```javascript
const adUnits = [
  {
    code: "adcluster-banner",
    mediaTypes: {
      banner: {
        sizes: [[300, 250]],
      },
    },
    bids: [
      {
        bidder: "adcluster",
        params: {
          unitId: "42d1f525-5792-47a6-846d-1825e53c97d6",
        },
      },
    ],
  },
  {
    code: "adcluster-video",
    mediaTypes: {
      video: {
        playerSize: [[640, 480]],
      },
    },
    bids: [
      {
        bidder: "adcluster",
        params: {
          unitId: "37dd91b2-049d-4027-94b9-d63760fc10d3",
        },
      },
    ],
  },
];
```
