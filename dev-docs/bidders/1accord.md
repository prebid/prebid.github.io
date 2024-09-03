---
layout: bidder
title: 1Accord
description: Prebid 1Accord Bidder Adapter
pbjs: true
biddercode: 1accord
aliasCode : nexx360
gvl_id: 965 (nexx360)
tcfeu_supported: true
usp_supported: true
gpp_supported: true
schain_supported: true
dchain_supported: false
floors_supported: true
userIds: all
tcf2_supported: true
media_types: banner, video, native
safeframes_ok: true
deals_supported: true
sidebarType: 1
fpd_supported: true

---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                | Example                                   | Type      |
|---------------|----------|----------------------------|--------------------------------------     |-----------|
| `tagId`       | required | tag ID                     | `"testnexx"`                              | `string`  |

### First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html).
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
         bidder: '1accord',
         params: {
            tagId: 'testnexx'
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
            bidder: '1accord',
            params: {
               tagId: 'testnexx'
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
            bidder: '1accord',
            params: {
               tagId: 'testnexx'
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
            bidder: '1accord',
            params: {
               tagId: 'testnexx',
               videoTagId: 'testnexx'
            }
        }]
    };
];
```
