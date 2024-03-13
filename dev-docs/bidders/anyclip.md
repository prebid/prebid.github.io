---
layout: bidder
title: AnyClip
description: AnyClip Bidder Adapter
biddercode: anyclip
tcfeu_supported: false
usp_supported: true
coppa_supported: true
gpp_supported: true
schain_supported: true
userId: pubProvidedId, unifiedId
media_types: banner
floors_supported: true
pbjs: true
pbs: false
prebid_member: false
safeframes_ok: true
sidebarType: 1
---

### Note

For more information about [AnyClip](https://www.anyclip.com), please contact [support@anyclip.com](support@anyclip.com).

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example                  | Type      |
|---------------|----------|-----------------------|--------------------------|-----------|
| `publisherId` | required | Publisher ID          | `'12345'`                | `string`  |
| `supplyTagId` | required | Supply Tag ID         | `'-mptNo0BycUG4oCDgGrU'` | `string`  |
| `floor`       | optional | Floor Price           | `0.5`                    | `float`   |

#### Sample Banner only Ad Unit

```js
var adUnits = [{
    code: 'adunit1', // ad slot HTML element ID  
    mediaTypes: {
        banner: {
            sizes: [
                [300, 250],
                [728, 90]
            ]
        }
    },
    bids: [{
        bidder: 'anyclip',
        params: {
            publisherId: '12345', // required, string
            supplyTagId: '-mptNo0BycUG4oCDgGrU', // required, string
            floor: 0.5 // optional, floor
        }
    }]
}]
```
