---
layout: bidder
title: OptimizeRx
description: Prebid OptimizeRx Bidder Adapter
biddercode: oprx
tcfeu_supported: false
usp_supported: false
coppa_supported: false
schain_supported: false
dchain_supported: false
userId: none
media_types: banner
safeframes_ok: true
deals_supported: false
floors_supported: true
fpd_supported: false
pbjs: true
pbs: false
pbs_app_supported: true
prebid_member: false
multiformat_supported: will-not-bid
ortb_blocking_supported: false
privacy_sandbox: no
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description            | Example    | Type      |
|---------------|----------|------------------------|------------|-----------|
| `placementId` | required | Placement ID           | `11111`    | `integer` |
| `key`         | required | Key                    | `'abc123'` | `string`  |
| `width`       | optional | Banner Width           | `123`      | `integer` |
| `height`      | optional | Banner Height          | `456`      | `integer` |
| `bid_floor`   | optional | Bidding Price Floor    | `123.45`   | `number`  |
| `npi`         | optional | NPI                    | `'22222'`  | `string`  |
| `ndc`         | optional | NDC                    | `'33333'`  | `string`  |
| `type`        | required | Type of Bid/Impression | `'banner'` | `string`  |

### AdUnit Format

```javascript
var adUnits = [
  {
    code: 'test-div',
    mediaTypes: {
        banner: {
            sizes: [[728, 90]]
          }
        },
    bids: [
      {
        bidder: 'oprx',
        params: {
            placement_id: 1234567890,   // placement ID (required)
            key: "123456abcd",          // key (required)            
            width: 728,                 // width
            height: 90,                 // height
            bid_floor: 0.5,             // bidding price floor
			npi: "1234567890",          // NPI
			ndc: "12345678901"          // NDC
            type: "banner",             // media type (required)
          },
        }
      }
    ]
  }
];
```
