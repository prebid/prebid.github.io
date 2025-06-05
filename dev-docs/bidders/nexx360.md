---
layout: bidder
title: Nexx360
description: Prebid Nexx360 Bidder Adapter
pbjs: true
biddercode: nexx360
gvl_id: 965
tcfeu_supported: true
usp_supported: true
gpp_supported: true
schain_supported: true
dchain_supported: false
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
| `tagId`       | required | Nexx360 tag ID             | `"testnexx"`                              | `string`  |
| `videoTagId`  | optional | Nexx360 Video tag ID       | `"testnexx"`                              | `string`  |
| `nativeTagId` | optional | Nexx360 Native tag ID      | `"testnexx"`                              | `string`  |
| `allBids`     | optional | Return all bids            | `true`                                    | `boolean` |
| `divId`       | optional | divId linked to adUnit     | `"div-1"`                                 | `string`  |
| `adUnitName`  | optional | A code to identify adUnit  | `"header-ad"`                             | `string`  |
| `adUnitPath`  | optional | A reference to adUnit Path | `"/12345/nexx360/Homepage/HP/Header-Ad"`  | `string`  |

### Bidder Config

You can allow writing in localStorage `pbjs.bidderSettings` for the bidder `nexx360`

{% include dev-docs/storageAllowed.md %}

```javascript
pbjs.bidderSettings = {
    nexx360: {
        storageAllowed : true
    }
}
```

### First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html).

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
         bidder: 'nexx360',
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
            bidder: 'nexx360',
            params: {
               tagId: 'testnexx'
            }
        }]
    },
     // Native adUnit
   {
        code: 'native1',
        mediaTypes: {
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
            bidder: 'nexx360',
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
            },
            native: {

            }
        },
        bids: [{
            bidder: 'nexx360',
            params: {
               tagId: 'testnexx',
               videoTagId: 'testnexx'
            }
        }]
    };
];
```
