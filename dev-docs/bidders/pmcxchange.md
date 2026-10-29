---
layout: bidder
title: PMC Xchange
description: Prebid PMC Xchange Bidder Adapter
pbjs: true
pbs: false
biddercode: pmcxchange
gvl_id: none
tcfeu_supported: false
usp_supported: true
gpp_sids: none
schain_supported: true
dchain_supported: false
floors_supported: true
userIds: all
media_types: banner, video, native
safeframes_ok: true
deals_supported: true
sidebarType: 1
fpd_supported: true
multiformat_supported: will-bid-on-any

---

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                | Example                                   | Type      |
|---------------|----------|----------------------------|--------------------------------------     |-----------|
| `tagId`       | required*| PMC Xchange tag ID         | `"testnexx"`                              | `string`  |
| `placement`   | required*| PMC Xchange placement      | `"test.com_header_ad"`                    | `string`  |

*You *must* only include one ID field - either `tagId` or `placement`, not both. If you have questions on which parameter to use, please reach out to your Account Manager.
The `tagId` and `placement` are **mutually exclusive** but at least one is required. If you pass both, `tagId` takes precedence.

## Bidder Config

You can allow writing in localStorage `pbjs.bidderSettings` for the bidder `pmcxchange`

{% include dev-docs/storageAllowed.md %}

```javascript
pbjs.bidderSettings = {
    pmcxchange: {
        storageAllowed : true
    }
}
```

## First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](/features/firstPartyData).

## Test Parameters

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
         bidder: 'pmcxchange',
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
            bidder: 'pmcxchange',
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
            bidder: 'pmcxchange',
            params: {
               tagId: 'testnexx'
            }
        }]
    }
];
```
