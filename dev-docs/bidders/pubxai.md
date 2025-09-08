---
layout: bidder
title: PubxAi
description: Prebid PubxAi Bidder Adapter
pbjs: true
pbs: true
biddercode: pubxai
gvl_id: 965
usp_supported: true
gpp_sids: tcfeu
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
| `tagId`       | required | PubxAi tag ID              | `"testnexx"`                              | `string`  |
| `placement`   | required*| PubxAi placement           | `"test.com_header_ad"`                    | `string`  |

*You*must* only include one ID field - either `tagId` or `placement`, not both. If you have questions on which parameter to use, please reach out to your Account Manager.
The `tagId` and `placement` are **mutually exclusive** but at least one is required. If you pass both, `tagId` takes precedence.

### Bidder Config

You can allow writing in localStorage `pbjs.bidderSettings` for the bidder `pubxai`

{% include dev-docs/storageAllowed.md %}

```javascript
pbjs.bidderSettings = {
    pubxai: {
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
         bidder: 'pubxai',
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
            bidder: 'pubxai',
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
            bidder: 'pubxai',
            params: {
               tagId: 'testnexx'
            }
        }]
    }
];
```
