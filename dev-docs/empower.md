---
layout: bidder
title: Empower
description: Prebid Empower Bidder Adapter
pbjs: true
biddercode: empower
gvl_id: 1248
tcfeu_supported: true
schain_supported: true
userIds: all
tcf2_supported: true
media_types: banner, video
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                | Example                                   | Type      |
|---------------|----------|----------------------------|--------------------------------------     |-----------|
| `zone`        | required | provided zone ID from Empower                    | `12456`                              | `int`  |
| `site`  | optional | provided Site Code from Empower    | `"empower_net"`                              | `string`  |

### Test Parameters

```javascript
var adUnits = [
   // Banner adUnit
   {
      code: 'banner-div',
      mediaTypes: {
        banner: {
          sizes: [[300, 250], [300,600]]
        }
      },
      bids: [{
         bidder: 'empower',
         params: {
            tagId: 123456
         }
       }]
   },
   {
        code: 'video1',
        mediaTypes: {
            video: {
                playerSize: [640, 480],
                context: 'instream'
            }
        },
        bids: [{
            bidder: 'empower',
            params: {
               tagId: 123456
            }
        }]
    },
   {
        code: 'multi1',
        mediaTypes: {
            video: {
                playerSize: [640, 480],
                context: 'instream'
            },
            banner: {
              sizes: [[300, 250], [300,600]]
            }
        },
        bids: [{
            bidder: 'empower',
            params: {
               tagId: 123456
            }
        }]
    };
];
```
