---
layout: bidder
title: Teads
description: Prebid Teads Bidder Adapter
pbjs: true
biddercode: teads
gdpr_supported: true
usp_supported: true
schain_supported: true
userIds: uid2Id, identityLinkId, lotamePanoramaId, id5Id, criteoId, connectId, quantcastId, publinkId, sharedId, merkleId, kinessoId
media_types: banner, video
gvl_id: 132
deals_supported: true
---

### Note:

The Teads Bidding adapter requires setup before beginning. Please contact us on https://teads.tv/teads-contact/

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `pageId`      | required | Teads page id         | `2453`    | `integer` |
| `placementId` | required | Teads placement id    | `113244`  | `integer` |
