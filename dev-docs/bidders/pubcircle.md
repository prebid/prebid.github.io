---
layout: bidder
title: PubCircle
description: Prebid PubCircle Bidder Adaptor
biddercode: pubcircle
filename: pubCircleBidAdapter
tcfeu_supported: false
usp_supported: true
coppa_supported: true
schain_supported: true
userId: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId, lotamePanoramaId, idx, uid2
media_types: banner, video, native
safeframes_ok: true
deals_supported: true
pbjs: true
pbs: false
sidebarType: 1
---

### Note

The Example Bidding adapter requires setup before beginning. Please contact us at <sales@axis-marketplace.com>

### Prebid.JS Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `placementId` | required | Placement ID          | `'123'`     | `string`  |
