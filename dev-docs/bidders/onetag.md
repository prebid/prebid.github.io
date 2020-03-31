---
layout: bidder
title: OneTag
description: Prebid OneTag Bidder Adaptor
hide: true
biddercode: onetag
media_types: banner
gdpr_supported: true
usp_supported: true
userIds: britepoolId, criteo, digitrust, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
---


### Bid Params

{: .table .table-bordered .table-striped }

| Name    | Scope    | Description                       | Example      | Type     |
|---------|----------|-----------------------------------|--------------|----------|
| `pubId` | required |                                   | `'386276e072'` | `string` |
| `type`  | optional | The media type, default is banner | `'banner'`   | `string` |
