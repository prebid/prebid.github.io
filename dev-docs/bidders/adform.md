---
layout: bidder
title: Adform
description: Prebid Adform Bidder Adaptor
hide: true
biddercode: adform
media_types: banner, video
gdpr_supported: true
usp_supported: true
tcf2_supported: true
prebid_member: true
userIds: pubCommonId, unifiedId, id5Id, parrableId, identityLink, liveIntentId, britepoolId, digitrust, criteo, netId, sharedId
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description       | Example            | Type      |
|-------------|----------|-------------------|--------------------|-----------|
| `mid`       | required |                   | `12345`            | `integer` |
| `adxDomain` | optional | The Adform domain | `'adx.adform.net'` | `string`  |
