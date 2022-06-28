---
layout: bidder
title: Kueez
description: Prebid Kueez Bidder Adapter
multiformat_supported: will-bid-on-any
pbjs: true
biddercode: kueez
media_types: banner, video
schain_supported: true
gdpr_supported: true
usp_supported: true
floors_supported: true
userIds: all
fpd_supported: true
---

### Note

The Kueez adapter requires setup and approval. Please reach out to prebid@kueez.com.

### Bid Parameters

#### Banner, Video

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description | Example
| ---- | ----- | ---- | ----------- | -------
| `org` | required | String |  the organization Id provided by your Kueez representative    | "test-org-id"
| `floorPrice` | optional | Number |  Minimum price in USD. Misuse of this parameter can impact revenue | 1.5
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
            bidder: 'kueez',
            params: {
                org: 'test-org-id', // Required
                floorPrice: 1.2, // Optional
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
            bidder: 'kueez',
            params: {
                org: 'test-org-id', // Required
                floorPrice: 1.50, // Optional
                placementId: '12345678', // Optional
                testMode: true // Optional
            }
        }]
    }
];
```

### Configuration
Kueez recommends setting UserSync by iframe for monetization.
