---
layout: bidder
title: Vidazoo
description: Prebid Vidazoo Bidder Adaptor
biddercode: vidazoo
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
media_types: banner, video, native
gvl_id: 744
tcfeu_supported: true
gpp_sids: tcfeu, tcfca, usnat, usstate_all, usp
usp_supported: true
pbs_app_supported: true
pbjs: true
pbs: true
sidebarType: 1
---

## Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                                                              | Example                      | Type     |
|------------|----------|------------------------------------------------------------------------------------------|------------------------------|----------|
| `cId`      | required | The connection ID from Vidazoo.                                                          | `'562524b21b1c1f08117fc7f9'` | `string` |
| `pId`      | required | The publisher ID from Vidazoo (pbjs only).                                               | `'59ac17c192832d0011283fe3'` | `string` |
| `bidFloor` | optional | The minimum bid value desired. Vidazoo will not respond with bids lower than this value. | `0.90`                       | `float`  |
| `subDomain`| optional | Sets the server subdomain, default: 'prebid'.                                            | `'prebid'`                   | `string` |

## Native

### Prebid.js

```javascript
var adUnits = [{
    code: 'div-native-1',
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
                    },
                    {
                        id: 4,
                        required: 0,
                        data: {
                            type: 2
                        }
                    }
                ]
            }
        }
    },
    bids: [{
        bidder: 'vidazoo',
        params: {
            cId: '562524b21b1c1f08117fc7f9',
            pId: '59ac17c192832d0011283fe3',
            bidFloor: 0.90
        }
    }]
}];
```

### Prebid Server

```json
{
    "id": "some-request-id",
    "site": {
        "page": "https://example.com"
    },
    "imp": [{
        "id": "some-impression-id",
        "native": {
            "request": "{\"ver\":\"1.2\",\"assets\":[{\"id\":1,\"required\":1,\"title\":{\"len\":80}},{\"id\":2,\"required\":1,\"img\":{\"type\":3,\"w\":1200,\"h\":627}},{\"id\":3,\"required\":1,\"data\":{\"type\":1}}]}",
            "ver": "1.2"
        },
        "ext": {
            "bidder": {
                "cId": "562524b21b1c1f08117fc7f9"
            }
        }
    }],
    "tmax": 5000
}
```
