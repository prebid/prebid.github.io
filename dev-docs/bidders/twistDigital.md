---
layout: bidder
title: Twist Digital
description: Prebid Twist Digital Bidder Adaptor
biddercode: twistdigital
filename: twistDigitalBidAdapter
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
media_types: banner, video, native
gvl_id: 1292
tcfeu_supported: true
gpp_sids: tcfeu, tcfca, usnat, usstate_all, usp
usp_supported: true
coppa_supported: false
multiformat_supported: will-bid-on-one
floors_supported: true
schain_supported: true
safeframes_ok: false
deals_supported: false
pbjs: true
sidebarType: 1
---

## Bid Params

{: .table .table-bordered .table-striped }

| Name       | Scope    | Description                                                                                | Example                      | Type     |
|------------|----------|--------------------------------------------------------------------------------------------|------------------------------|----------|
| `cId`      | required | The connection ID from shinezRtb.                                                          | `'562524b21b1c1f08117fc7f9'` | `string` |
| `bidFloor` | optional | The minimum bid value desired. shinezRtb will not respond with bids lower than this value. | `0.90`                       | `float`  |

### Native

```javascript
var adUnits = [{
    code: 'native-div',
    mediaTypes: {
        native: {
            ortb: {
                assets: [
                    {
                        id: 1,
                        required: 1,
                        title: {
                            len: 80
                        }
                    },
                    {
                        id: 2,
                        required: 1,
                        img: {
                            type: 3,
                            w: 1200,
                            h: 627
                        }
                    },
                    {
                        id: 3,
                        required: 1,
                        data: {
                            type: 1
                        }
                    }
                ]
            }
        }
    },
    bids: [{
        bidder: 'twistdigital',
        params: {
            cId: '562524b21b1c1f08117fc7f9', // Required - PROVIDED DURING SETUP...
            pId: '59ac17c192832d0011283fe3', // Required - PROVIDED DURING SETUP...
            bidFloor: 1.23                   // Optional
        }
    }]
}];
```
