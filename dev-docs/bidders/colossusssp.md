---
layout: bidder
title: Colossus
description: Prebid Colossus Bidder Adaptor
pbjs: true
biddercode: colossusssp
usp_supported: true
schain_supported: true
media_types: banner, video, native
userIds: britepoolid, identityLink, unifiedId, id5Id
gdpr: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                              | Example    | Type      |
|----------------|----------|----------------------------------------------------------|------------|-----------|
| `placement_id` | required | Placement Id will be generated on Colossus SSP Platform. | `0`        | `integer` |
| `traffic`      | optional | Type traffic                                             | `'banner'` | `string`  |
