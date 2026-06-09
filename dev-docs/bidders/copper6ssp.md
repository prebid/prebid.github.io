---
layout: bidder
title: Copper6
description: Prebid Copper6 Bidder Adaptor
biddercode: copper6ssp
userIds: criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
tcfeu_supported: false
usp_supported: true
gvl_id: 1356
coppa_supported: false
schain_supported: true
gpp_sids: tcfeu, tcfca, usnat, usstate_all, usp
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
pbs: false
sidebarType: 1
---

## Bid Params for Prebid.js

{: .table .table-bordered .table-striped }

| Name       | Scope    | Description                                                                              | Example                      | Type     |
|------------|----------|------------------------------------------------------------------------------------------|------------------------------|----------|
| `cId`      | required | The connection ID from Copper6.                                                          | `'562524b21b1c1f08117fc7f9'` | `string` |
| `pId`      | required | The publisher ID from Copper6 (pbjs only).                                               | `'59ac17c192832d0011283fe3'` | `string` |
| `bidFloor` | optional | The minimum bid value desired. Copper6 will not respond with bids lower than this value. | `0.90`                       | `float`  |

## Bid Params for Prebid Server

{: .table .table-bordered .table-striped }

| Name       | Scope    | Description                                                                              | Example                      | Type     |
|------------|----------|------------------------------------------------------------------------------------------|------------------------------|----------|
| `cId`      | required | The connection ID from Copper6.                                                          | `'562524b21b1c1f08117fc7f9'` | `string` |

### Example

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
        bidder: 'copper6ssp',
        params: {
            cId: '562524b21b1c1f08117fc7f9', // Required - PROVIDED DURING SETUP...
            pId: '59ac17c192832d0011283fe3', // Required - PROVIDED DURING SETUP...
            bidFloor: 1.23                   // Optional
        }
    }]
}
];

// configure pbjs to enable user syncing
pbjs.setConfig({
    userSync: {
        filterSettings: {
            iframe: {
                bidders: 'copper6ssp',
                filter: 'include'
            }
        }
    }
});
```
