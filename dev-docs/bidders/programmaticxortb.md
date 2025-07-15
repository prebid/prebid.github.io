---
layout: bidder
title: Px
description: Prebid PX Bidder Adaptor
biddercode: px
filename: pxBidAdapter
userIds: criteo, id5Id, liveIntentId, netId
tcfeu_supported: true
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
pbjs: true
pbs: true
sidebarType: 1
gvl_id: 1344
---

### Bid Params ###

{: .table .table-bordered .table-striped }

| Name       | Scope    | Description                                                                         | Example                      | Type     |
|------------|----------|-------------------------------------------------------------------------------------|------------------------------|----------|
| `cId`      | required | The connection ID from PX.                                                          | `'562524b21b1c1f08117fc7f9'` | `string` |
| `pId`      | required | The publisher ID from PX.                                                           | `'59ac17c192832d0011283fe3'` | `string` |
| `bidFloor` | optional | The minimum bid value desired. PX will not respond with bids lower than this value. | `0.90`                       | `float`  |

### Example ###

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
    }
}]
```
