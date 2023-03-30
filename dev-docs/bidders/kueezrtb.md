---
layout: bidder
title: KueezRTB
description: Prebid KueezRTB Bidder Adaptor
biddercode: kueezrtb
filename: kueezRtbBidAdapter
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
gdpr_supported: true
usp_supported: true
coppa_supported: false
schain_supported: true
gpp_supported: true
floors_supported: true
media_types: banner, video
prebid_member: false
safeframes_ok: false
deals_supported: false
pbs_app_supported: false
fpd_supported: false
ortb_blocking_supported: false
multiformat_supported: will-bid-on-one
gvl_id: 1165
pbjs: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                                                               | Example                      | Type     |
|------------|----------|-------------------------------------------------------------------------------------------|------------------------------|----------|
| `cId`      | required | The connection ID from KueezRTB.                                                          | `'562524b21b1c1f08117fc7f9'` | `string` |
| `pId`      | required | The publisher ID from KueezRTB.                                                           | `'59ac17c192832d0011283fe3'` | `string` |
| `bidFloor` | optional | The minimum bid value desired. KueezRTB will not respond with bids lower than this value. | `0.90`                       | `float`  |


## Example
  ```javascript
var adUnits = [{
        code: 'banner-div',
        mediaTypes: {
            banner: {
                sizes: [
                    [300, 250],
                    [728, 90]
                ]
            }
        },
        bids: [{
            bidder: 'kueezrtb',
            params: {
                cId: '562524b21b1c1f08117fc7f9', // Required - PROVIDED DURING SETUP...
                pId: '59ac17c192832d0011283fe3', // Required - PROVIDED DURING SETUP...
                bidFloor: 1.23                   // Optional
            }
        }]
    }
];
```