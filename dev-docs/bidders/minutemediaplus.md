---
layout: bidder
title: MinuteMediaPlus
description: Prebid Minute Media Plus Bidder Adaptor
biddercode: mmplus
filename: minutemediaplusBidAdapter
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
tcfeu_supported: true
usp_supported: true
coppa_supported: false
schain_supported: true
floors_supported: true
gpp_supported: true
media_types: banner, video
prebid_member: false
safeframes_ok: false
deals_supported: false
pbs_app_supported: false
fpd_supported: false
ortb_blocking_supported: false
multiformat_supported: will-bid-on-one
gvl_id: 918
pbjs: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                                                                      | Example                      | Type     |
|------------|----------|--------------------------------------------------------------------------------------------------|------------------------------|----------|
| `cId`      | required | The connection ID from MinuteMediaPlus.                                                          | `'562524b21b1c1f08117fc7f9'` | `string` |
| `pId`      | required | The publisher ID from MinuteMediaPlus.                                                           | `'59ac17c192832d0011283fe3'` | `string` |
| `bidFloor` | required | The minimum bid value desired. MinuteMediaPlus will not respond with bids lower than this value. | `0.90`                       | `float`  |
| `subDomain`| optional | Sets the server subdomain, default: 'exchange'.                                                  | `'exchange'`                 | `string` |
