---
layout: bidder
title: AdformOpenRTB
description: Prebid Adform Bidder Adaptor
biddercode: adf
media_types: banner, native, video
coppa_supported: true
gdpr_supported: true
usp_supported: true
prebid_member: true
pbjs: true
pbs: true
schain_supported: true
userIds: all
gvl_id: 50
prevBiddercode: adformOpenRTB
floors_supported: true
multiformat_supported: will-bid-on-one
---

### Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope                      | Description          | Example            | Type      |
|-------------|----------------------------|----------------------|--------------------|-----------|
| `mid`       | required, if `inv` and `nmane` not set | Placement ID | `12345`        | `integer` |
| `inv`       | required, if `mid` not set | Inventory source ID  | `1234`             | `integer` |
| `mname`     | required, if `mid` not set | Placement name       | `"Leaderboard"`    | `string`  |
| `adxDomain` | optional, Prebid.js only   | The Adform domain    | `"adx.adform.net"` | `string`  |
| `priceType` | optional                   | Price type           | `"gross"`          | `string`  |

Note: Bid placement should be defined using the `mid` parameter or `inv` and `mname` parameters (dynamic master tag) but not both.

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
