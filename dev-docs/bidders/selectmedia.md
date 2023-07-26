---
layout: bidder
title: Select Media Display
description: Prebid Select Media Bidder Adapter
pbjs: true
media_types: banner,video
tcfeu_supported: true
gpp_supported: true
biddercode: selectmedia
aliasCode: adtelligent
sidebarType: 1
gvl_id: 775
---

### Bid params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                     | Example  | Type      |
|-------|----------|---------------------------------|----------|-----------|
| `aid` | required | The traffic source ID | `232131` | `integer` |

### Test Parameters

``` javascript
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
          bidder: 'selectmedia',
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
          bidder: 'selectmedia',
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
          bidder: 'selectmedia',
          params: {
            aid: 350975
          }
        }]
      }
    ];
```
