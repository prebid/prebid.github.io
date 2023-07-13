---
layout: bidder
title: Pubtech
description: Prebid Pubtech Bidder Adapter
pbjs: true
biddercode: pubtech
aliasCode : nexx360
gvl_id: 965
gdpr_supported: true
usp_supported: true
schain_supported: true
floors_supported: true
userIds: all
tcf2_supported: true
media_types: banner, video, native
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                | Example                                   | Type      |
|---------------|----------|----------------------------|--------------------------------------     |-----------|
| `tagId`       | required | tag ID                     | `"luvxjvgn"`                              | `string`  |
| `videoTagId`  | optional | Video tag ID               | `"luvxjvgn"`                              | `string`  |
| `nativeTagId` | optional | Native tag ID              | `"luvxjvgn"`                              | `string`  |
| `allBids`     | optional | Return all bids            | `true`                                    | `boolean` |
| `divId`       | optional | divId linked to adUnit     | `"div-1"`                                 | `string`  |
| `adUnitName`  | optional | A code to identify adUnit  | `"header-ad"`                             | `string`  |
| `adUnitPath`  | optional | A reference to adUnit Path | `"/12345/pubtech/Homepage/HP/Header-Ad"`  | `string`  |

### First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html).

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
         bidder: 'pubtech',
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
            bidder: 'pubtech',
            params: {
               tagId: 'luvxjvgn'
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
            bidder: 'pubtech',
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
            bidder: 'pubtech',
            params: {
               tagId: 'luvxjvgn',
               videoTagId: 'luvxjvgn'
            }
        }]
    };
];
```
