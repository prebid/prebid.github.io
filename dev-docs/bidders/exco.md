---
layout: bidder
title: Exco
description: Prebid Exco Bidder Adaptor
biddercode: exco
filename: excoBidAdapter
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
tcfeu_supported: true
gvl_id: 444
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
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope      | Description                                                                           | Example                      | Type     |
|---------------|------------|---------------------------------------------------------------------------------------|------------------------------|----------|
| `cId`         | deprecated | The connection ID from Exco.                                                          | `'562524b21b1c1f08117fc7f9'` | `string` |
| `pId`         | deprecated | The publisher ID from Exco.                                                           | `'59ac17c192832d0011283fe3'` | `string` |
| `bidFloor`    | deprecated | The minimum bid value desired. Exco will not respond with bids lower than this value. | `0.90`                       | `float`  |
| `accountID`   | required   | A unique account identifier provided by EX.CO.                                        | `'1234567890'`               | `string` |
| `publisherId` | required   | Publisher ID provided by EX.CO.                                                       | `'1234567890'`               | `string` |
| `tagId`       | required   | A unique Tag ID (supply id) identifier provided by EX.CO.                             | `'1234567890'`               | `string` |

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
            bidder: 'exco',
            params: {
                accountID: '1234567890',   // Required - PROVIDED DURING SETUP...
                publisherId: '1234567890', // Required - PROVIDED DURING SETUP...
                tagId: '1234567890'        // Required - PROVIDED DURING SETUP...
            }
        }]
    }
];

// configure pbjs to enable user syncing
pbjs.setConfig({
    userSync: {
      filterSettings: {
        iframe: {
          bidders: 'exco',
          filter: 'include'
        }
      }
    }
});
```
