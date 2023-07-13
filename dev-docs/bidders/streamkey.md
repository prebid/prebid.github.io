---
layout: bidder
title: Streamkey
description: Prebid Streamkey.tv Bidder Adapter
pbjs: true
pbs: true
media_types: video,banner
gvl_id: 410 (adtelligent)
gdpr_supported: true
gpp_supported: true
biddercode: streamkey
aliasCode: adtelligent
media_types: video
sidebarType: 1
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
          bidder: 'streamkey',
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
          bidder: 'streamkey',
          params: {
            aid: 331133
          }
        }]
      },
    ];
```
