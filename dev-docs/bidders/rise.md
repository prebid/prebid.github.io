---
layout: bidder
title: Rise
description: Prebid Bidder Adaptor
pbjs: true
biddercode: rise
media_types: banner, video
schain_supported: true
gdpr_supported: true
usp_supported: true
floors_supported: true
userIds: all
fpd_supported: true
gvl_id: 1043
---

### Note

The Rise adapter requires setup and approval. Please reach out to prebid-rise-engage@risecodes.com to setup an Rise account.

### Bid Parameters

#### Video

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description | Example
| ---- | ----- | ---- | ----------- | -------
| `org` | required | String |  Rise publisher Id provided by your Rise representative  | "56f91cd4d3e3660002000033"
| `floorPrice` | optional | Number |  Minimum price in USD. <br/><br/> **WARNING:**<br/> Misuse of this parameter can impact revenue | 2.00
| `placementId` | optional | String |  A unique placement identifier  | "12345678"
| `testMode` | optional | Boolean |  This activates the test mode  | false

## Example
```javascript
var adUnits = [{
        code: 'banner-div',
        mediaTypes: {
            banner: {
                sizes: [
                    [300, 250],
                    [728, 90]
                ]
            }
        },
        bids: [{
            bidder: 'rise',
            params: {
                org: '56f91cd4d3e3660002000033', // Required
                floorPrice: 0.05, // Optional
                placementId: '12345678', // Optional
                testMode: false // Optional
            }
        }]
    },
    {
        code: 'dfp-video-div',
        sizes: [
            [640, 480]
        ],
        mediaTypes: {
            video: {
                playerSize: [
                    [640, 480]
                ],
                context: 'instream'
            }
        },
        bids: [{
            bidder: 'rise',
            params: {
                org: '56f91cd4d3e3660002000033', // Required
                floorPrice: 5.00, // Optional
                placementId: '12345678', // Optional
                testMode: false // Optional
            }
        }]
    }
];
```

### Configuration
Rise recommends setting UserSync by iframe for monetization.

### Versions
Prebid versions 5.0-5.3 are not supported
Banner >= 6.14.0
