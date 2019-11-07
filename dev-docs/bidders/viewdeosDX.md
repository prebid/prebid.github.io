---
layout: bidder
title: ViewDeos DX
description: Prebid ViewDeos Bidder Adaptor
hide: true
biddercode: viewdeosDX
media_types: video
---

### Bid params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                     | Example  | Type      |
|-------|----------|---------------------------------|----------|-----------|
| `aid` | required | The source ID from | `350975` | `integer` |



### Test Parameters
```
    var adUnits = [

      // Video instream adUnit
      {
        code: 'div-test-div',
        mediaTypes: {
          video: {
            playerSize:[640, 480],
            context: 'instream'
          }
        },
        bids: [{
          bidder: 'viewdeosDX',
          params: {
            aid: 331133
          }
        }]
      },

      // Video outstream adUnit
      {
        code: 'outstream-test-div',
        mediaTypes: {
          video: {
            playerSize:[640, 480],
            context: 'outstream'
          }
        },
        bids: [{
          bidder: 'viewdeosDX',
          params: {
            aid: 331133
          }
        }]
      },

      // Banner adUnit
      {
        code: 'div-test-div',
        mediaTypes: {
          banner: {
            sizes:[[300, 250]]
          }
        },
        bids: [{
          bidder: 'viewdeosDX',
          params: {
            aid: 350975
          }
        }]
      }
    ];
```
