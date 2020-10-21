---
layout: bidder
title: OneTag
description: Prebid OneTag Bidder Adaptor

biddercode: onetag
media_types: banner, video
gdpr_supported: true
tcf2_supported: true
gvl_id: 241
usp_supported: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
---


### Bid Params

{: .table .table-bordered .table-striped }

| Name    | Scope    | Description                       | Example      | Type     |
|---------|----------|-----------------------------------|--------------|----------|
| `pubId` | required |                                   | `'386276e072'` | `string` |

### Video Additional Information

Note that right now video support is only provided when the context is "instream" or "outstream".
