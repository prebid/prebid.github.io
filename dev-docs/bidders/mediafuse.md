---
layout: bidder
title: MediaFuse
description: Prebid MediaFuse Bidder Adapter
pbjs: true
pbs: true
biddercode: mediafuse
aliasCode: adtelligent
media_types: banner, video
---

### Bid params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                     | Example  | Type      |
|-------|----------|---------------------------------|----------|-----------|
| `aid` | required | The traffic source ID | `529814` | `integer` |


### Test Parameters
```
    var adUnits = [

      // Video instream adUnit
      {
        code: 'div-test-div',
        sizes: [[640, 480]],
        mediaTypes: {
          video: {
            context: 'instream'
          }
        },
        bids: [{
          bidder: 'mediafuse',
          params: {
            aid: 331133
          }
        }]
      },

      // Video outstream adUnit
      {
        code: 'outstream-test-div',
        sizes: [[640, 480]],
        mediaTypes: {
          video: {
            context: 'outstream'
          }
        },
        bids: [{
          bidder: 'mediafuse',
          params: {
            aid: 331133
          }
        }]
      },

      // Banner adUnit
      {
        code: 'div-test-div',
        sizes: [[300, 250]],
        bids: [{
          bidder: 'mediafuse',
          params: {
            aid: 529814
          }
        }]
      }
    ];
```
