---
layout: bidder
title: Mile
description: Prebid Mile Bidder Adapter
biddercode: mile
tcfeu_supported: true
gvl_id: 1464
usp_supported: true
coppa_supported: true
gpp_supported: true
schain_supported: true
media_types: banner
safeframes_ok: true
deals_supported: false
floors_supported: true
fpd_supported: true
pbjs: true
pbs: false
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                     | Example              | Type     |
|---------------|----------|---------------------------------|----------------------|----------|
| `publisherId` | required | The publisher ID from Mile      | `'1234'`             | `string` |
| `placementId` | required | The placement ID from Mile      | `'1234'`             | `string` |
| `siteId`      | required | The site ID from Mile           | `'1234'`             | `string` |

### Configuration

The Mile adapter requires `publisherId`, `placementId`, and `siteId` parameters to be provided. Contact your Mile account representative to obtain these values.

### Example Ad Unit: Banner

```javascript
var adUnits = [{
    code: 'banner-div',
    mediaTypes: {
        banner: {
            sizes: [[300, 250], [728, 90]]
        }
    },
    bids: [{
        bidder: 'mile',
        params: {
            publisherId: 'publisherId',
            placementId: 'placementId',
            siteId: 'siteId'
        }
    }]
}];
```
