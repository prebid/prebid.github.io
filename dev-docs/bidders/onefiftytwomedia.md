---
layout: bidder
title: 152 Media 3.0
description: Prebid 152 Media RTB Bidder Adapter
pbjs: true
biddercode: onefiftytwomedia
aliasCode: adtelligent
media_types: banner, video
---

### Bid params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                     | Example  | Type      |
|-------|----------|---------------------------------|----------|-----------|
| `aid` | required | The source ID | `350975` | `integer` |


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
          bidder: 'onefiftytwomedia',
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
          bidder: 'onefiftytwomedia',
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
          bidder: 'onefiftytwomedia',
          params: {
            aid: 350975
          }
        }]
      }
    ];
```
