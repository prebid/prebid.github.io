---
layout: bidder
title: Twist Digital
description: Prebid Twist Digital Bidder Adaptor
biddercode: twistdigital
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
media_types: banner, video
gvl_id: 1292
tcfeu_supported: true
gpp_supported: true
usp_supported: true
coppa_supported: false
multiformat_supported: will-bid-on-one
floors_supported: true
schain_supported: true
safeframes_ok: false
deals_supported: false
pbjs: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                                                              | Example                      | Type     |
|------------|----------|------------------------------------------------------------------------------------------|------------------------------|----------|
| `cId`      | required | The connection ID from Twist Digital.                                                          | `'562524b21b1c1f08117fc7f9'` | `string` |
| `pId`      | required | The publisher ID from Twist Digital.                                                           | `'59ac17c192832d0011283fe3'` | `string` |
| `bidFloor` | optional | The minimum bid value desired. Twist Digital will not respond with bids lower than this value. | `0.90`                       | `float`  |
| `subDomain`| optional | Sets the server subdomain, default: 'prebid'.                                            | `'prebid'`                     | `string` |
