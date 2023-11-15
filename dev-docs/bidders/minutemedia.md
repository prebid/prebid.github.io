---
layout: bidder
title: MinuteMedia
description: Prebid MinuteMedia Bidder Adapter
pbjs: true
biddercode: minutemedia
media_types: banner, video
multiformat_supported: will-bid-on-any
schain_supported: true
tcfeu_supported: true
usp_supported: true
floors_supported: true
userIds: all
fpd_supported: true
gvl_id: 918
sidebarType: 1
---

### Note

The MinuteMedia adapter requires setup and approval. Please reach out to <hb@minutemedia.com> to setup an MinuteMedia account.

### Bid Parameters

#### Banner ,Video

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description | Example
| ---- | ----- | ---- | ----------- | -------
| `org` | required | String |  MinuteMedia publisher Id provided by your MinuteMedia representative  | "1234567890abcdef12345678"
| `floorPrice` | optional | Number |  Minimum price in USD. <br/><br/> **WARNING:**<br/> Misuse of this parameter can impact revenue | 2.00
| `placementId` | optional | String |  A unique placement identifier  | "12345678"
| `testMode` | optional | Boolean |  This activates the test mode  | false
| `currency` | optional | String | 3 letters currency | "EUR"


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
          bidder: 'minutemedia',
          params: {
              org: '1234567890abcdef12345678', // Required
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
          bidder: 'minutemedia',
          params: {
              org: '1234567890abcdef12345678', // Required
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
