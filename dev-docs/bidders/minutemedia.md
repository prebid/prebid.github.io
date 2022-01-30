---
layout: bidder
title: MinuteMedia
description: Prebid Bidder Adaptor
pbjs: true
biddercode: minutemedia
media_types: video
schain_supported: true
gdpr_supported: true
usp_supported: true
floors_supported: true
userIds: all
fpd_supported: true
gvl_id: 918
---

### Note

The MinuteMedia adapter requires setup and approval. Please reach out to hb@minutemedia.com to setup an MinuteMedia account.

### Bid Parameters

#### Video

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description | Example
| ---- | ----- | ---- | ----------- | -------
| `org` | required | String |  MinuteMedia publisher Id provided by your MinuteMedia representative  | "56f91cd4d3e3660002000033"
| `floorPrice` | optional | Number |  Minimum price in USD. <br/><br/> **WARNING:**<br/> Misuse of this parameter can impact revenue | 2.00
| `placementId` | optional | String |  A unique placement identifier  | "12345678"
| `testMode` | optional | Boolean |  This activates the test mode  | false

## Example
```javascript
var adUnits = [
       {
        code: 'dfp-video-div',
        sizes: [[640, 480]],
        mediaTypes: {
          video: {
            playerSize: [[640, 480]],
            context: 'instream'
          }
        },
        bids: [{
          bidder: 'minutemedia',
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
MinuteMedia recommends setting UserSync by iframe for monetization.
