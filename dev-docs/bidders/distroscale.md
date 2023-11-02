---
layout: bidder
title: DistroScale
description: Prebid DistroScale Bidder Adaptor
biddercode: distroscale
media_types: banner
pbjs: true
pbs: false
tcfeu_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
fpd_supported: true
userIds: all
floors_supported: true
safeframes_ok: false
prebid_member: true
gvl_id: 754
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description        | Example         | Type     |
|---------------|----------|--------------------|-----------------|----------|
| `pubid`       | required | Publisher ID       | `'12345'`       | `string` |
| `zoneid`      | optional | Zone ID            | `'67890'`       | `string` |

### Prebid Test Request

```javascript
var adUnits = [{
  code: 'banner-1',
    mediaTypes: {
        banner: {
            sizes: [[300, 250]],
        }
    },
  bids: [{
    bidder: 'distroscale',
    params: {
      pubid: '12345'               // required, must be a string
      ,zoneid: '67890'             // optional, must be a string
    }
  }]
}];
```

These test parameters can be used to verify that the DistroScale adapter is working properly. This example includes a DistroScale test publisher ID, an optional zone ID and sizes that would match with the test creative.
