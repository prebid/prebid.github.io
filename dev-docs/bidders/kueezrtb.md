---
layout: bidder
title: KueezRTB
description: Prebid KueezRTB Bidder Adaptor
biddercode: kueezrtb
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
gdpr_supported: false
usp_supported: true
pbjs: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                                                               | Example                      | Type     |
|------------|----------|-------------------------------------------------------------------------------------------|------------------------------|----------|
| `cId`      | required | The connection ID from KueezRTB.                                                          | `'562524b21b1c1f08117fc7f9'` | `string` |
| `pId`      | required | The publisher ID from KueezRTB.                                                           | `'59ac17c192832d0011283fe3'` | `string` |
| `bidFloor` | required | The minimum bid value desired. KueezRTB will not respond with bids lower than this value. | `0.90`                       | `float`  |
| `subDomain`| optional | Sets the server subdomain, default: 'exchange'.                                           | `'exchange'`                 | `string` |
