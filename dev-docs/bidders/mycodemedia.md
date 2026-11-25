---
layout: bidder
title: MyCodeMedia
description: Prebid MyCodeMedia Bidder Adapter
pbjs: true
pbs: false
biddercode: mycodemedia
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
| Name        | Scope     | Description           | Example            | Type     |
|-------------|-----------|-----------------------|--------------------|----------|
| `tagId`     | required* | MyCodeMedia tag ID    | `"testnexx"`       | `string` |
| `placement` | required* | MyCodeMedia placement | `"TEST_PLACEMENT"` | `string` |

\* Exactly one of `tagId` or `placement` is required; if both are passed, `tagId` takes precedence. Ask your account manager which one to use.

## Bidder Config

You can allow writing in localStorage `pbjs.bidderSettings` for the bidder `mycodemedia`

{% include dev-docs/storageAllowed.md %}

```javascript
pbjs.bidderSettings = {
    mycodemedia: {
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
         bidder: 'mycodemedia',
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
            bidder: 'mycodemedia',
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
            bidder: 'mycodemedia',
            params: {
               tagId: 'testnexx'
            }
        }]
    }
];
```
