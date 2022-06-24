---
layout: bidder
title: PixFuture
description: Prebid PixFuture Bidder Adapter
biddercode: pixfuture
media_types: banner
gdpr_supported: true
prebid_member: false
coppa_supported: true
usp_supported: true
userIds: flocId, criteoId, unifiedId, id5Id, sharedId, identityLink, liveIntentId, fabrickId
pbs: false
pbjs: true
---
#### Bid Params

| Name                | Scope    | Description                                                                                                                                                                   | Example                                               | Type             |
|---------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|------------------|
| `pix_id`       | required | The pix_id is an ID from PixFuture.  The `pix_id` parameter should be a `string`                                                  | `"Abc123"`                                            | `string`         |
