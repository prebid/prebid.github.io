---
layout: bidder
title: Adform
description: Prebid Adform Bidder Adaptor
biddercode: adform
media_types: banner, video
gdpr_supported: true
usp_supported: true
tcf2_supported: true
prebid_member: true
pbjs: true
pbs: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, sharedId, unifiedId
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description       | Example            | Type      |
|-------------|----------|-------------------|--------------------|-----------|
| `mid`       | required |                   | `12345`            | `integer` |
| `adxDomain` | optional | The Adform domain | `'adx.adform.net'` | `string`  |
