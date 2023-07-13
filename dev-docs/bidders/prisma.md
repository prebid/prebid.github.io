---
layout: bidder
title: Prisma
description: Prebid Prisma Bidder Adapter
pbjs: true
biddercode: prisma
gdpr_supported: true
usp_supported: true
schain_supported: true
userIds: id5Id
media_types: banner, video
gvl_id: 965
pbs: false
sidebarType: 1

---


### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example                              | Type      |
|---------------|----------|-----------------------|--------------------------------------|-----------|
| `account`     | required | Prisma account ID    | `'1067'`                             | `string`  |
| `tagId`       | required | Prisma tag ID        | `'luvxjvgn'`                         | `string`  |

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
         bidder: 'prisma',
         params: {
            account: '1067',
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
            bidder: 'prisma',
            params: {
               account: '1067',
               tagId: 'luvxjvgn'
            }
        }]
    };

];
```
