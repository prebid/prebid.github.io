---
layout: bidder
title: RTBHouse
description: Prebid RTB House Bidder Adapter
gdpr_supported: true
pbjs: true
pbs: true
biddercode: rtbhouse
safeframes_ok: true
media_types: banner, native
schain_supported: true
userIds: id5Id, identityLink
pbs_app_supported: true
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description         | Example       | Type     |
|---------------|----------|---------------------|---------------|----------|
| `publisherId` | required | Unique publisher ID | `'ABCDEF'`    | `string` |
| `region`      | required | Assigned region     | `'prebid-eu'` | `string` |
| `bidfloor`    | optional | Minimal CPM value   | `0.01`        | `float`  |
