---
layout: bidder
title: NextRoll
description: Prebid NextRoll Bidder Adapter
hide: true
biddercode: nextroll
media_types: display
gdpr_supported: false
usp_supported: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                                                       | Example                     | Type     |
|----------------|----------|---------------------------------------------------------------------------------------------------|-----------------------------|----------|
| `sellerId`     | required | The seller ID from NextRoll.Please reach out your NextRoll representative for more details.       | `'541459'`                  | `string` |
| `publisherId`  | optional | The publisher ID from NextRoll.Please reach out your NextRoll representative for more details.    | `'956812'`                  | `string` |
| `zoneId`       | optional | Descriptive or unique identifier for the ad position                                              | `'main-banner-505/600x160'` | `string` |
| `bidfloor`     | optional | Per ad-unit bid floor                                                                             | `2.3`                       | `number` |

#### Example of Banner Ad-unit
```
var adUnits = [
    {
        code: 'div-1',
        mediaTypes: {
            banner: {sizes: [[300, 250], [160, 600]]}
        },
        bids: [{
            bidder: 'nextroll',
            params: {
                bidfloor: 1,
                zoneId: "13144370",
                publisherId: "publisherId",
                sellerId: "sellerId",
            }
        }]
    },
    {
        code: 'div-2',
        mediaTypes: {
            banner: {
                sizes: [[728, 90], [970, 250]]
            }
        },
        bids: [{
            bidder: 'nextroll',
            params: {
                bidfloor: 2.3,
                zoneId: "13144370",
                publisherId: "publisherId",
                sellerId: "sellerId",
            }
        }]
    }
];
```
