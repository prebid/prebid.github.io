---
layout: bidder
title: Colossus
description: Prebid Colossus Bidder Adaptor
biddercode: colossus
usp_supported: true
schain_supported: true
media_types: banner, video, native
userIds: britepoolid, identityLink, unifiedId, id5Id, uid2
gdpr: true
pbjs: false
pbs: true
pbs_app_supported: true
sidebarType: 1
---

### Disclosure

This adapter is known to use an HTTP 1 endpoint. Header bidding often generates multiple requests to the same host and bidders are encouraged to change to HTTP 2 or above to help improve publisher page performance via multiplexing.

### Prebid.Server Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                              | Example    | Type      |
|----------------|----------|----------------------------------------------------------|------------|-----------|
| `TagID` | optional | Placement Id will be generated on Colossus SSP Platform. | `'0'`        | `string` |
| `groupId` | optional | Group Id will be generated on Colossus SSP Platform. | `'0'`        | `string` |

You only need to use one parameter: either TagID or groupId

*For prebidJS parametres, look into colossusssp.md*
