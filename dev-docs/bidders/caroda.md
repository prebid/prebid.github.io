---
layout: bidder
title: Caroda
description: Prebid Caroda Bidder Adaptor
biddercode: caroda
media_types: banner, video
coppa_supported: true
tcfeu_supported: true
usp_supported: true
prebid_member: false
pbjs: true
pbs: false
schain_supported: true
userIds: all
gvl_id: 954
floors_supported: true
fpd_supported: true
safeframes_ok: true
ortb_blocking_supported: false
deals_supported: false
sidebarType: 1
---

### Bid params

The Caroda Bidding adapter requires setup before beginning. Please contact us on <https://caroda.io/>

{: .table .table-bordered .table-striped }

| Name          | Scope                      | Description                                                     | Example           | Type      |
|---------------|----------------------------|-----------------------------------------------------------------|-------------------|-----------|
| `ctok`        | required                   | id unique to a customer                                         | `"abcdef"`        | `string` |
| `placementId` | optional                   | used when there are multiple placements configured per domain   | `"opzabc123"`     | `string` |
| `priceType`   | optional                   | price type                                                      | `"gross"`         | `string`  |

### OpenRTB request config

OpenRTB bid request `app`, `site`, `device` properties configured using prebid config.

``` javascript
pbjs.setConfig({
  ortb2: {
    app: {
      name: 'My APP'
    }
  }
});
```
