---
layout: bidder
title: Viewdeos Server
description: Prebid Server ViewDeos Adapter
pbjs: false
pbs: true
biddercode: viewdeos
media_types: banner,video
gdpr_supported: true
gvl_id: 924
sidebarType: 1
---

### Bid params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                     | Example  | Type      |
|-------|----------|---------------------------------|----------|-----------|
| `aid` | required | The source ID from member zone | `350975` | `integer` |

### Test Parameters
```
    var adUnits = [
      // Banner adUnit
      {
        code: 'div-test-div',
        mediaTypes: {
          banner: {
            sizes:[[300, 250]]
          }
        },
        bids: [{
          bidder: 'viewdeos',
          params: {
            aid: 672854
          }
        }]
      }
    ];
```
