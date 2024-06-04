---
layout: bidder
title: RelevateHealth
description: Prebid RelevateHealth Bidder Adaptor
pbjs: true
biddercode: relevatehealth
media_types: banner
usp_supported: true
coppa_supported: true
gpp_sids: usstate_all
deals_supported: true
floors_supported: true
sidebarType: 1
---

### Bid Params

| Name          | Scope     | Description           | Example        | Type     |
|---------------|-----------|-----------------------|----------------|----------|
| `placement_id` | mandatory | Placement Id          | `110011`       | `number` |
| `user_id`     | mandatory | Unique id for HCP     | `'1111111'`    | `string` |
| `height`      | optional  | Height of the creative| `600`          | `number` |
| `width`       | optional  | Width of the creative | `160`          | `number` |
| `domain`      | optional  | Domain                | `'domain.com'` | `string` |
| `bid_floor`   | optional  | Bid Floor Price       | `0.5`          | `decimal`|

### AdUnit Format for Banner

```javascript
var adUnits = [
            {
                code: 'banner-ad',
                mediaTypes: {
                    banner: {
                        sizes: [[160, 600]]
                    }
                },
                bids: [{
                    bidder: 'relevatehealth',
                    params: {
                        placement_id: 110011,
                        user_id: '',
                        height: 600,
                        width: 160,
                        domain: '',
                        bid_floor: 0.5
                    }
                }]
            }
        ];
```
