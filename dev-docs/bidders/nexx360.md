---
layout: bidder
title: Nexx360
description: Prebid Nexx360 Bidder Adapter
pbjs: true
biddercode: nexx360
gdpr_supported: true
usp_supported: true
schain_supported: true
userIds: id5Id
media_types: banner, video
glv_id: 965
pbs: false
sidebarType: 1

---


### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example                              | Type      |
|---------------|----------|-----------------------|--------------------------------------|-----------|
| `tagId`       | required | Nexx360 tag ID        | `"luvxjvgn"`                         | `string`  |
| `videoTagId`  | optional | Nexx360 Video tag ID        | `"luvxjvgn"`                         | `string`  |
| `allBids`  | optional | Return all bids       | `true`                         | `boolean`  |

### Test Parameters

```
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
         bidder: 'nexx360',
         params: {
            tagId: 'luvxjvgn'
         }
       }]
   },
   // Video adUnit
   {
        code: 'video1',
        mediaTypes: {
            video: {
                playerSize: [640, 480],
                context: 'instream'
            }
        },
        bids: [{
            bidder: 'nexx360',
            params: {
               tagId: 'luvxjvgn'
            }
        }]
    },
    // Multiformat Ad
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
            bidder: 'nexx360',
            params: {
               tagId: 'luvxjvgn',
               videoTagId: 'luvxjvgn'
            }
        }]
    };
];
```
