---
layout: bidder
title: RTBHouse
description: Prebid RTB House Bidder Adapter
gdpr_supported: true
pbjs: true
pbs: true
biddercode: rtbhouse
prebid_member: true
floors_supported: true
safeframes_ok: true
media_types: banner, native
schain_supported: true
userIds: id5Id, identityLink, pubProvidedId
pbs_app_supported: true
sidebarType: 1
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description         | Example       | Type     |
|---------------|----------|---------------------|---------------|----------|
| `publisherId` | required | Unique publisher ID | `'ABCDEF'`    | `string` |
| `region`      | required | Assigned region     | `'prebid-eu'` | `string` |
| `bidfloor`    | optional | Minimal CPM value   | `0.01`        | `float`  |
| `channel`     | optional | Inventory channel identifier, limited to 50 characters  | `Partner 1 - News`        | `string`  |


### Please note:

* Since 4.43 the bidfloor param will be ignored if a value is specified via floor module.

* The channel param is available starting from Prebid 6.6.0. Please reach your RTBHouse representative for details on how to enable and use the channel param.
