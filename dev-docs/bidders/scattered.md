---
layout: bidder
title: Scattered
description: Scattered Prebid Bidder Adaptor
biddercode: scattered
media_types: banner
coppa_supported: false
gdpr_supported: true
usp_supported: false
prebid_member: false
pbjs: true
pbs: false
schain_supported: false
userIds: none
gvl_id: 1179
floors_supported: false
fpd_supported: false
deals_supported: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: false
safeframes_ok: false
sidebarType: 1
---

### Bid params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description   | Example         | Type      |
| -------------- | -------- | ------------- | --------------- | --------- |
| `bidderDomain` | required | Bidder domain | `"Leaderboard"` | `string`  |
| `test`         | optional | Is test bid   | 0               | `integer` |


### OpenRTB request config

OpenRTB bid request `app`, `site`, `device` properties configured using prebid config.

``` javascript
pbjs.setConfig({
  ortb2: {
    site: {
      id: '876',
      publisher: {
        domain: 'publisher1.eu'
      }
    }
  }
});
```
