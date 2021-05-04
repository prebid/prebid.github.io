---
layout: bidder
title: DataBlocks
pbs: true
pbjs: true
description: Prebid Datablocks Bidder Adaptor
media_types: banner,native,video
biddercode: datablocks
prebid_member: true
gdpr_supported: true
pbs_app_supported: true
schain_supported: true
userIds: criteo,unifiedId,netId,pubcid
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description            | Example | Type     |
|------------|----------|------------------------|---------|----------|
| sourceId | required | Website Source Id | 111 | integer |
| host | required | Network Host to request from | 'host1' | string |
| tagid | optional | Placement ID | 'leaderboard_1' | string |
