---
layout: bidder
title: Wildberries
description: Prebid Wildberries Bidder Adapter
biddercode: wb
pbjs: true
media_types: banner
multiformat_supported: will-bid-on-one
floors_supported: true
safeframes_ok: false
sidebarType: 1
---

## Note

The Wildberries adapter connects publishers to the Wildberries advertising network. It supports banner ads and sends all bids of an auction in a single OpenRTB request. Contact <support_publishers@rwb.ru> to set up a site and placements.

Bids are returned in RUB. If the ad server currency is not RUB, include the [Currency module](/dev-docs/modules/currency.html) and provide a RUB conversion rate (`rates` or `conversionRateFile`): the default Prebid rate file does not contain RUB.

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                      | Example                                  | Type     |
|---------------|----------|------------------------------------------------------------------|------------------------------------------|----------|
| `placementId` | required | Placement ID, UUID (dashed or 32 hex characters without dashes)  | `'43d7cdd5-61db-4b12-889f-3d48a9fd213f'` | `string` |

## Test Parameters

```javascript
var adUnits = [
  {
    code: 'banner-1',
    mediaTypes: {
      banner: {
        sizes: [[728, 90]]
      }
    },
    bids: [
      {
        bidder: 'wb',
        params: {
          placementId: '43d7cdd5-61db-4b12-889f-3d48a9fd213f'
        }
      }
    ]
  }
];
```
