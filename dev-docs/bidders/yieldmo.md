---
layout: bidder
title: Yieldmo
description: Prebid Yieldmo Bidder Adaptor
biddercode: yieldmo
media_types: banner
userIds: pubCommonId, unifiedId, criteo
gdpr_supported: true
usp_supported: true
schain_supported: true
tcf2_supported: true
prebid_member: true
pbjs: true
pbs: true
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description          | Example                   | Type     |
|---------------|----------|----------------------|---------------------------|----------|
| `placementId` | required | Yieldmo placement id | `'825209316101005155'` | `string` |
| `bidFloor`    | optional |      Bid Floor       |         `0.1`          |  `float` |
