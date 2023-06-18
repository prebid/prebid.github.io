---
layout: bidder
title: Adtarget
description: Adtarget Bidder Adapter
biddercode: adtarget
media_types: banner, video
gdpr_supported: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
schain_supported: true
coppa_supported: true
usp_supported: true
pbjs: true
pbs: true
sidebarType: 1
---

### Registration

To use the Adtarget bidder you will need an aid from an exchange account on [https://adtarget.com.tr](https://adtarget.com.tr). For further information, please contact <kamil@adtarget.com.tr>.

### Bid params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                     | Example  | Type      |
|-------|----------|---------------------------------|----------|-----------|
| `aid` | required | The source ID from Adtarget platform. | `529814` | `integer` |

### Description

Provides a solution for accessing Video demand and display demand from Adtarget

### Test Parameters

```
    var adUnits = [

      // Video adUnit
      {
        code: 'videoPlayer',
        mediaTypes: {
          video: {
            playerSize:[640,480]
            context: 'instream'
          }
        },
        bids: [{
          bidder: 'adtarget',
          params: {
            aid: 331133
          }
        }]
      },

      // Banner adUnit
      {
        code: 'bannerAd',
        mediaTypes: {
          banner: {
            sizes: [[300, 250]]
          }
        },
        bids: [{
          bidder: 'adtarget',
          params: {
            aid: 529814
          }
        }]
      }
    ];
```

### Additional Configuration

It is possible to configure requests to be splitted in chunks to have less bid requests in single http request
(default value is 10)

```
    pbjs.setBidderConfig({
        config: {              
            adtarget: {
                chunkSize: 1   // makes 1 http request per 1 adunit configured
            }
        }
    });
```
