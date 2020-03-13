---
layout: bidder
title: Nobid
description: Prebid Nobid Bidder Adaptor
biddercode: nobid
hide: true
media_types: banner
gdpr_supported: true
usp_supported: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description | Example | Type     |
|---------------|----------|-------------|---------|----------|
| `siteId` | required | siteId is provided by your NoBid account manager |         | `integer` |
| `placementId` | optional | placementId is provided by your NoBid account manager. This parameter allows to report on a specific ad unit |         | `integer` |

# Test Parameters
```
    var adUnits = [
        {
            code: 'test-div',
            mediaTypes: {
                banner: {
                    sizes: [[300, 250]],  // a display size
                }
            },
            bids: [
                {
                    bidder: "nobid",
                    params: {
                        siteId: 2,
                        placementId: 3
                    }
                }
            ]
        },{
            code: 'test-div',
            mediaTypes: {
                banner: {
                    sizes: [[320, 50]],   // a mobile size
                }
            },
            bids: [
                {
                    bidder: "nobid",
                    params: {
                        siteId: 2
                    }
                }
            ]
        }
    ];
```