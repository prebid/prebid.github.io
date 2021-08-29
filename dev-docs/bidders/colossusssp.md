---
layout: bidder
title: Colossus
description: Prebid Colossus Bidder Adaptor
biddercode: colossusssp
usp_supported: true
schain_supported: true
media_types: banner, video, native
userIds: britepoolid, identityLink, unifiedId, id5Id, uid2
gdpr: true
pbjs: true
pbs: true
---

### Prebid.JS Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                              | Example    | Type      |
|----------------|----------|----------------------------------------------------------|------------|-----------|
| `placement_id` | required | Placement Id will be generated on Colossus SSP Platform. | `0`        | `integer` |
| `traffic`      | optional | Type traffic                                             | `'banner'` | `string`  |
| `bidfloor`     | optional | Will be used instead of configured on platform           | `0.2`      | `integer` |

*For colossus prebid server parametres, look into colossus.md*
