---
layout: bidder
title: DataBlocks
pbs: true
pbjs: true
description: Prebid Datablocks Bidder Adaptor
media_types: banner,native
biddercode: datablocks
prebid_member: true
gdpr_supported: true
pbs_app_supported: true
schain_supported: true
usp_supported: true
userIds: criteo,unifiedId,netId,pubcid
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description            | Example | Type     |
|------------|----------|------------------------|---------|----------|
| sourceId | required | Website Source Id | 111 | integer |
| host | optional | Network Host to request from | 'prebid.datablocks.bet' | string |
| tagid | optional | Placement ID | 'leaderboard_1' | string |
| vis_optout | optional | Opt out of visibility metric | true | boolean |
