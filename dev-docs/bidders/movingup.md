---
layout: bidder
title: Moving Up
description: Prebid Moving Up Bidder Adapter
pbjs: true
pbs: true
biddercode: movingup
gvl_id: 1416
tcfeu_supported: true
usp_supported: true
gpp_supported: true
schain_supported: true
dchain_supported: true
floors_supported: true
userIds: all
tcfeu_supported: true
media_types: banner, video, native
safeframes_ok: true
deals_supported: true
sidebarType: 1
fpd_supported: true
multiformat_supported: will-bid-on-any

---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                | Example                                   | Type      |
|---------------|----------|----------------------------|--------------------------------------     |-----------|
| `tagId`       | optional | tag ID                     | `"testnexx"`                              | `string`  |
| `placement`   | optional | Placement                  | `"test"`                                  | `string`  |

For the prebid.js you only need to use one parameter: either tagId or placement

### First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](/features/firstPartyData.html).
The following fields are supported:

* ortb2.site.ext.data.*
* ortb2.site.content.data[]
* ortb2.user.ext.data.*
* ortb2.user.data[]

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
         bidder: 'movingup',
         params: {
            tagId: 'testeasy'
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
            bidder: 'movingup',
            params: {
               tagId: 'testeasy'
            }
        }]
    },
     // Native adUnit
   {
        code: 'native1',
        mediaTypes:
            native: {
                title: {
                    required: true
                },
                image: {
                    required: true
                },
                sponsoredBy: {
                    required: true
                }
            }
        },
        bids: [{
            bidder: 'movingup',
            params: {
               tagId: 'testeasy'
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
            bidder: 'movingup',
            params: {
               tagId: 'testeasy',
               videoTagId: 'testeasy'
            }
        }]
    };
];
```
