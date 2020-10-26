---
layout: bidder
title: Colossus
description: Prebid Colossus Bidder Adaptor
biddercode: colossus
usp_supported: true
schain_supported: true
media_types: banner, video, native
userIds: britepoolid, identityLink, unifiedId, id5Id
gdpr: true
pbjs: false
pbs: true
---

### Prebid.Server Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                              | Example    | Type      |
|----------------|----------|----------------------------------------------------------|------------|-----------|
| `TagID` | required | Placement Id will be generated on Colossus SSP Platform. | `'0'`        | `string` |

*For prebidJS parametres, look into colossusssp.md*
