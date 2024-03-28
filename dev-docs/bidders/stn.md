---
layout: bidder
title: STN
description: Prebid STN Bidder Adapter
pbjs: true
biddercode: stn
media_types: banner, video
multiformat_supported: will-bid-on-any
schain_supported: true
tcfeu_supported: false
usp_supported: true
gpp_supported: true
gpp_sids: tcfeu, usstate_all, usp
pbs: false
floors_supported: true
userIds: all
fpd_supported: true
sidebarType: 1
---

### Note

The STN adapter requires setup and approval. Please reach out to <hb@stnvideo.com> to setup an STN account.

### Bid Parameters

#### Banner ,Video

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description | Example
| ---- | ----- | ---- | ----------- | -------
| `org` | required | String |  STN publisher Id provided by your STN representative  | "0987654321abcdef87654321"
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
          bidder: 'stn',
          params: {
              org: '0987654321abcdef87654321', // Required
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
          bidder: 'stn',
          params: {
              org: '0987654321abcdef87654321', // Required
              floorPrice: 5.00, // Optional
              placementId: '12345678', // Optional
              testMode: false // Optional
          }
      }]
  }
];
```

### Configuration

STN recommends setting UserSync by iframe for monetization.
