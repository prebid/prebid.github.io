---
layout: bidder
title: AdformOpenRTB
description: Prebid Adf Bidder Adaptor
biddercode: adf
media_types: banner, native, video
gdpr_supported: true
usp_supported: true
prebid_member: true
pbjs: true
pbs: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, sharedId, unifiedId
gvl_id: 50
prevBiddercode: adformOpenRTB
---

### Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description          | Example            | Type      |
|-------------|----------|----------------------|--------------------|-----------|
| `mid`       | required |                      | `12345`            | `integer` |
| `adxDomain` | optional | The Adform domain    | `'adx.adform.net'` | `string`  |
| `priceType` | optional | Price type           | `'gross'`          | `string`  |

Note: prebid-server adapter supports only `mid` parameter - other params could be set by adjusting prebid-server openRTB request.

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
