---
layout: bidder
title: pinelake
description: Prebid pinelake Bidder Adaptor
pbjs: true
biddercode: pinelake
media_types: banner
tcfeu_supported: false
usp_supported: true
coppa_supported: true
gpp_sids: usstate_all
schain_supported: false
safeframes_ok: false
ortb_blocking_supported: false
dsa_supported: false
deals_supported: true
floors_supported: true
sidebarType: 1
---

# Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope     | Description           | Example        | Type     |
|---------------|-----------|-----------------------|----------------|----------|
| `placement_id`| mandatory | Placement Id          | `110002`       | `number` |
| `height`      | optional  | Height of the creative| `250`          | `number` |
| `width`       | optional  | Width of the creative | `300`          | `number` |
| `bid_floor`   | optional  | Bid Floor Price       | `0.5`          | `decimal`|

## AdUnit Format for Banner

```javascript
var adUnits = [
            {
                code: 'display-ad',
                mediaTypes: {
                    banner: {
                        sizes: [[300, 250]]
                    }
                },
                bids: [{
                    bidder: 'pinelake',
                    params: {
                        placement_id: 110002,
                        height: 250,
                        width: 300,
                        bid_floor: 0.5
                    }
                }]
            }
        ];
```
