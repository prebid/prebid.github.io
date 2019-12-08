---
layout: bidder
title: Dailyhunt
description: Prebid Dailyhunt Bidder Adaptor
hide: true
biddercode: dailyhunt
media_types: display, native
gdpr_supported: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name              | Scope    | Description                                                                                                          | Example                                       | Type       |
|-------------------|----------|----------------------------------------------------------------------------------------------------------------------|-----------------------------------------------|------------|
| `partnerId`          | required | Serving ads based on partnerId. Contact Dailyhunt for PartnerIds.                                    | `'pb-partner'`                                      | `string`  |

### Test Parameters
```
    var adUnits = [
        {
            code: 'test-banner-adunit-code',
            sizes: [[300, 250], [320, 50]],
            bids: [
                {
                    bidder: 'dailyhunt',
                    params: {
                      partnerId: 'pb-partnerId'
                    }
                }
            ]
        },
        {
            code: 'test-native-adunit-code',
            sizes: [[300, 250]],
            mediaTypes: {
                native: {
                    title: {
                        required: true
                    },
                    body: {
                        required: true
                    },
                    image: {
                        required: true
                    },
                    sponsoredBy: {
                        required: true
                    },
                }
            },
            bids: [
                {
                    bidder: 'dailyhunt',
                    params: {
                      partnerId: 'pb-partnerId'
                    }
                }
            ]
        }
    ];
```
