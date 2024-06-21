---
layout: bidder
title: Shinez
description: Prebid Shinez Bidder Adapter
multiformat_supported: will-bid-on-any
pbjs: true
biddercode: shinez
media_types: banner, video
schain_supported: true
usp_supported: true
floors_supported: true
userIds: all
fpd_supported: true
safeframes_ok: false
sidebarType: 1
---

### Note

The Shinez adapter requires setup and approval. Please reach out to <tech-team@shinez.io> to setup an Shinez account.

### Bid Parameters

#### Banner, Video

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description | Example
| ---- | ----- | ---- | ----------- | -------
| `org` | required | String |  Shinez publisher Id provided by your Shinez representative  | "56f91cd4d3e3660002000033"
| `floorPrice` | optional | Number |  Minimum price in USD.  | 2.00
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
            bidder: 'shinez',
            params: {
                org: '56f91cd4d3e3660002000033', // Required
                floorPrice: 0.05, // Optional
                placementId: '12345678', // Optional
                testMode: true // Optional
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
            bidder: 'shinez',
            params: {
                org: '56f91cd4d3e3660002000033', // Required
                floorPrice: 5.00, // Optional
                placementId: '12345678', // Optional
                testMode: true // Optional
            }
        }]
    }
];
```

### Configuration

Shinez recommends setting UserSync by iframe for monetization.
