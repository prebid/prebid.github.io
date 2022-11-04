---
layout: bidder
title: OneTag
description: Prebid OneTag Bidder Adaptor
pbjs: true
pbs: true
biddercode: onetag
media_types: banner, video
gdpr_supported: true
gvl_id: 241
usp_supported: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
schain_supported: true
getFloor: true
---


### Bid Params

{: .table .table-bordered .table-striped }

| Name    | Scope    | Description                       | Example      | Type     |
|---------|----------|-----------------------------------|--------------|----------|
| `pubId` | required | The publisher's ID provided by OneTag | `'386276e072'` | `string` |
| `ext`   | optional | A set of custom key-value pairs | `{ customKey: customValue }` | `object` |

### Video Additional Information

Note that right now video support is only provided when the context is "instream" or "outstream".
