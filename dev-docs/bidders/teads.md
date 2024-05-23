---
layout: bidder
title: Teads
description: Prebid Teads Bidder Adapter
prebid_member: true
pbs: true
pbs_app_supported: true
pbjs: true
pbjs_version_notes: please avoid using v7.20.0 and v7.21.0
biddercode: teads
tcfeu_supported: true
dsa_supported: true
usp_supported: true
schain_supported: true
userIds: uid2Id, identityLinkId, lotamePanoramaId, id5Id, criteoId, connectId, quantcastId, publinkId, sharedId, merkleId, kinessoId
media_types: banner, video
gvl_id: 132
deals_supported: true
multiformat_supported: will-not-bid
ortb_blocking_supported: true
floors_supported: true
coppa_supported: true
gpp_sids: tcfeu, usp
fpd_supported: false
sidebarType: 1
---

### Note

The Teads Bidding adapter requires setup before beginning. Please contact us on <https://teads.tv/teads-contact/>

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope              | Description           | Example   | Type      |
|---------------|--------------------|-----------------------|-----------|-----------|
| `pageId`      | required(pbjs)     | Teads page id         | `2453`    | `integer` |
| `placementId` | required(pbs,pbjs) | Teads placement id    | `113244`  | `integer` |
