---
layout: bidder
title: Easybid
description: Prebid Easybid Bidder Adapter
pbjs: true
pbs: true
biddercode: easybid
gvl_id: 1068
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
| `tagId`       | required | tag ID                     | `"testeasy"`                              | `string`  |
| `placement`   | required*| Placement                  | `"test.com_header_ad"`                    | `string`  |

*You*must* only include one ID field - either `tagId` or `placement`, not both. If you have questions on which parameter to use, please reach out to your Account Manager.
The `tagId` and `placement` are **mutually exclusive** but at least one is required. If you pass both, `tagId` takes precedence.

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
         bidder: 'easybid',
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
            bidder: 'easybid',
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
            bidder: 'easybid',
            params: {
               tagId: 'testeasy'
            }
        }]
    }
];
```
