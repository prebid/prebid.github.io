---
layout: bidder
title: Caroda
description: Prebid Caroda Bidder Adaptor
biddercode: caroda
media_types: banner, video
coppa_supported: true
gdpr_supported: true
usp_supported: true
prebid_member: false
pbjs: true
pbs: false
schain_supported: true
userIds: all
gvl_id: 954
floors_supported: true
multiformat_supported: will-bid-on-any, will-bid-on-one
---

### Bid params

{: .table .table-bordered .table-striped }
| Name          | Scope                      | Description                                                     | Example           | Type      |
|---------------|----------------------------|-----------------------------------------------------------------|-------------------|-----------|
| `ctok`        | required                   | id unique to a customer                                         | `"abcdef"`        | `string` |
| `placementId` | optional                   | used when there are multiple placements configured per domain   | `"opzabc123"`     | `string` |
| `priceType`   | optional                   | Price type                                                      | `"gross"`         | `string`  |



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
