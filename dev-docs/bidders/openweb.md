---
layout: bidder
title: OpenWeb
description: Prebid OpenWeb Bidder Adapter
pbjs: true
biddercode: openweb
media_types: banner, video
multiformat_supported: will-bid-on-any
schain_supported: true
coppa_supported: true
tcfeu_supported: true
gpp_supported: true
gpp_sids: tcfeu, usstate_all, usp
usp_supported: true
safeframes_ok: false
pbs: true
floors_supported: true
userIds: all
fpd_supported: true
gvl_id: 280
sidebarType: 1
---

### Note

The OpenWeb adapter requires setup and approval. Please reach out to <monetization@openweb.com> to setup an OpenWeb account.

### Bid Parameters

#### Banner, Video

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description | Example
| ---- | ----- | ---- | ----------- | -------
| `org` | required | String |  OpenWeb publisher Id provided by your OpenWeb representative  | "1234567890abcdef12345678"
| `placementId` | required | String |  A unique placement identifier  | "12345678"
| `floorPrice` | optional | Number |  Minimum price in USD. <br/><br/> **WARNING:**<br/> Misuse of this parameter can impact revenue | 2.00
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
          bidder: 'openweb',
          params: {
              org: '1234567890abcdef12345678', // Required
              placementId: '12345678', // Required
              floorPrice: 0.05, // Optional
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
          bidder: 'openweb',
          params: {
              org: '1234567890abcdef12345678', // Required
              placementId: '12345678', // Required
              floorPrice: 5.00, // Optional
              testMode: false // Optional
          }
      }]
  }
];
```

### Configuration

OpenWeb recommends setting UserSync by iframe for monetization.
