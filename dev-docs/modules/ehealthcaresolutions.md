---
layout: bidder
title: eHealthcareSolutions
description: Prebid eHealthcareSolutions Bidder Adaptor
pbjs: true
biddercode: ehealthcaresolutions
media_types: banner, native
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
### Registration

For assistance or setup instructions, please contact us at <info@ehsmail.com>.

### Banner Params

{: .table .table-bordered .table-striped }
| Name           | Scope     | Description           | Example        | Type     |
|----------------|-----------|-----------------------|----------------|----------|
| `placement_id` | mandatory | Placement Id          | `111520`       | `number` |
| `height`       | optional  | Height of the creative| `250`          | `number` |
| `width`        | optional  | Width of the creative | `300`          | `number` |
| `bid_floor`    | optional  | Bid Floor Price       | `0.5`          | `decimal`|

### AdUnit Format for Banner

```javascript
var adUnits = [
            {
                code: 'banner-ad',
                mediaTypes: {
                    banner: {
                        sizes: [[300, 250]]
                    }
                },
                bids: [{
                    bidder: 'ehealthcaresolutions',
                    params: {
                        placement_id: 111520,
                        height: 250,
                        width: 300,
                        bid_floor: 0.5
                    }
                }]
            }
        ];
```

### Native Params

{: .table .table-bordered .table-striped }
| Name           | Scope     | Description           | Example        | Type     |
|----------------|-----------|-----------------------|----------------|----------|
| `placement_id` | mandatory | Placement Id          | `111519`       | `number` |
| `bid_floor`    | optional  | Bid Floor Price       | `1`            | `decimal`|

### AdUnit Format for Native

```javascript
var adUnits = [
            {
                code: 'native-ad-container',
                mediaTypes: {
                    native: {
                        title: { required: true, len: 100 },
                        image: { required: true, sizes: [300, 250] },
                        sponsored: { required: false },
                        clickUrl: { required: true },
                        desc: { required: true },
                        icon: { required: false, sizes: [50, 50] },
                        cta: { required: false }
                    }
                },
                bids: [{
                    bidder: 'ehealthcaresolutions',
                    params: {
                        placement_id: 111519, // Required parameter
                        bid_floor: 1 // Optional parameter
                    }   
                }]
            }
        ];
```
