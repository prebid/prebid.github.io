---
layout: bidder
title: Programmaticx
description: Prebid Programmaticx Ortb Bidder Adaptor
biddercode: programmaticx
filename: programmaticxOrtbBidAdapter
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
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

| Name       | Scope    | Description                                                                               | Example                      | Type     |
|------------|----------|-------------------------------------------------------------------------------------------|------------------------------|----------|
| `cId`      | required | The connection ID from Programmaticx.                                                          | `'562524b21b1c1f08117fc7f9'` | `string` |
| `pId`      | required | The publisher ID from Programmaticx.                                                           | `'59ac17c192832d0011283fe3'` | `string` |
| `bidFloor` | optional | The minimum bid value desired. Programmaticx will not respond with bids lower than this value. | `0.90`                       | `float`  |

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
