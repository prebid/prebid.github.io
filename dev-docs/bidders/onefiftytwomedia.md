---
layout: bidder
title: 152 Media 3.0
description: Prebid 152 Media RTB Bidder Adapter
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: onefiftytwomedia
aliasCode: adtelligent
biddercode_longer_than_12: true
prebid_1_0_supported : true
media_types: banner, video
---

#### send-all-bids ad server keys

(Truncated to 20 chars due to [DFP limit](https://support.google.com/dfp_premium/answer/1628457?hl=en#Key-values))

`hb_pb_onefiftytwomed`
`hb_adid_onefiftytwom`
`hb_size_onefiftytwom`

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
