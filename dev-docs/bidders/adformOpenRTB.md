---
layout: bidder
title: AdformOpenRTB
description: Prebid AdformOpenRTB Bidder Adaptor
biddercode: adformOpenRTB
media_types: no-display, native
gdpr_supported: true
usp_supported: true
tcf2_supported: true
prebid_member: true
pbjs: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, sharedId, unifiedId
gvl_id: 50
---

### Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description          | Example            | Type      |
|-------------|----------|----------------------|--------------------|-----------|
| `mid`       | required |                      | `12345`            | `integer` |
| `adxDomain` | optional | The Adform domain    | `'adx.adform.net'` | `string`  |
| `site`      | optional | Site id              | `'123123'`         | `string`  |
| `priceType` | optional | Price type           | `'gross'`          | `string`  |
| `publisher` | optional | Info about publisher | `{"id": "2706", "name": "name", "domain": "dom"}`                | `object`  |
