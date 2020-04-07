---
layout: bidder
title: Yieldmo
description: Prebid Yieldmo Bidder Adaptor
hide: true
biddercode: yieldmo
media_types: native
userIds: pubCommonId, unifiedId
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description          | Example                   | Type     |
|---------------|----------|----------------------|---------------------------|----------|
| `placementId` | required | Yieldmo placement id | `'825209316101005155'` | `string` |
| `bidFloor`    | optional |      Bid Floor       |         `0.1`          |  `float` |
