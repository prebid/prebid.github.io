---
layout: bidder
title: Colossus
description: Prebid Colossus Bidder Adaptor
biddercode: colossusssp
usp_supported: true
schain_supported: true
media_types: banner, video, native
userIds: all
gdpr: true
pbjs: true
pbs: true
sidebarType: 1
coppa_supported: true
floors_supported: true

---

### Prebid.JS Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                              | Example    | Type      |
|----------------|----------|----------------------------------------------------------|------------|-----------|
| `placement_id` | optional | Placement Id will be generated on Colossus SSP Platform. Use instead of group_id | `0`        | `integer` |
| `group_id`     | optional | Group Id will be generated on Colossus SSP Platform. Use instead of placement_id  | `0`        | `integer` |
| `traffic`      | optional | Type traffic                                             | `'banner'` | `string`  |

*For colossus prebid server parameters, look into colossus.md*
