---
layout: bidder
title: Dexerto
description: Prebid dexerto Bidder Adaptor
pbjs: true
biddercode: dexerto
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

### Bid Params

| Name          | Scope     | Description           | Example        | Type     |
|---------------|-----------|-----------------------|----------------|----------|
| `placement_id`| mandatory | Placement Id          | `110003`       | `number` |
| `height`      | optional  | Height of the creative| `250`          | `number` |
| `width`       | optional  | Width of the creative | `300`          | `number` |
| `domain`      | optional  | Domain                | `'domain.com'` | `string` |
| `bid_floor`   | optional  | Bid Floor Price       | `0.5`          | `decimal`|

### AdUnit Format for Banner

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
                    bidder: 'dexerto',
                    params: {
                        placement_id: 110003,
                        height: 250,
                        width: 300,
                        domain: '',
                        bid_floor: 0.5
                    }
                }]
            }
        ];
```
