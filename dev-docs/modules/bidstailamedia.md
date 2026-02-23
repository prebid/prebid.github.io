---
layout: bidder
title: stailamedia Bidder
description: Prebid bidstailamedia Bidder Adapter
pbjs: true
biddercode: bidstailamedia
gvl_id: 965 (nexx360)
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

| Name          | Scope    | Description                | Example                                   | Type      |
|---------------|----------|----------------------------|--------------------------------------     |-----------|
| `tagId`       | required | tag ID                     | `"hk15z9sy"`                             | `string`  |

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
         bidder: 'bidstailamedia',
         params: {
            tagId: 'hk15z9sy'
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
            bidder: 'bidstailamedia',
            params: {
               tagId: 'hk15z9sy'
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
            bidder: 'bidstailamedia',
            params: {
               tagId: 'hk15z9sy'
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
            bidder: 'bidstailamedia',
            params: {
               tagId: 'hk15z9sy',
               videoTagId: 'hk15z9sy'
            }
        }]
    };
];
```
