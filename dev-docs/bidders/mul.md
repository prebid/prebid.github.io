---
layout: bidder
title: MonetiseUp (Mul)
description: Prebid MonetiseUp (Mul) Bidder Adapter
biddercode: mul
pbjs: true
pbs: false
media_types: banner
tcfeu_supported: false
usp_supported: true
coppa_supported: true
floors_supported: true
safeframes_ok: true
multiformat_supported: will-bid-on-one
sidebarType: 1
---

## Note

The MonetiseUp (`mul`) adapter connects publishers directly to MonetiseUp programmatic demand and integrated RTB exchanges, aggregating demand from top partners including Adagio, PubMatic, OpenX, 152Media, Nobid, OnlineMediaSolutions, Scalibur, TripleLift, Eskimi, and Equativ.

To begin monetizing your inventory, contact [business@responsiq.com](mailto:business@responsiq.com).

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                   | Example            | Type     |
|---------------|----------|-----------------------------------------------|--------------------|----------|
| `placementId` | required | Your MonetiseUp placement or inventory tag ID | `'placement-123'`  | `string` |
| `zoneId`      | optional | Alternative zone identifier                   | `'zone-456'`       | `string` |

## Test Parameters

```javascript
var adUnits = [
  {
    code: 'test-ad-unit',
    mediaTypes: {
      banner: {
        sizes: [[300, 250], [728, 90]]
      }
    },
    bids: [
      {
        bidder: 'mul',
        params: {
          placementId: 'test-placement-123'
        }
      }
    ]
  }
];
```
