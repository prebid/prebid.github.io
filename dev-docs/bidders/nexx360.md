---
layout: bidder
title: Nexx360
description: Prebid Nexx360 Bidder Adapter
pbjs: true
biddercode: nexx360
tcfeu_supported: true
usp_supported: true
schain_supported: true
floors_supported: true
userIds: all
tcf2_supported: true
media_types: banner, video, native
gvl_id: 965
pbs: false
sidebarType: 1

---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                | Example                                   | Type      |
|---------------|----------|----------------------------|--------------------------------------     |-----------|
| `tagId`       | required | Nexx360 tag ID             | `"luvxjvgn"`                              | `string`  |
| `videoTagId`  | optional | Nexx360 Video tag ID       | `"luvxjvgn"`                              | `string`  |
| `nativeTagId` | optional | Nexx360 Native tag ID      | `"luvxjvgn"`                              | `string`  |
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
            },
            native: {

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
