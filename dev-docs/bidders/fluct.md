---
layout: bidder
title: fluct
description: Prebid fluct Bidder Adapter
biddercode: fluct
media_types: banner
gdpr_supported: false
coppa_supported: false
usp_supported: false
schain_supported: true
pbjs: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description             | Example                                    | Type     |
|---------------|----------|-------------------------|--------------------------------------------|----------|
| `tagId`       | required | The tag ID from fluct   | `'25405:1000192893'`                       | `string` |
| `groupId`     | required | The group ID from fluct | `'1000105712'`                             | `string` |
| `dfpUnitCode` | optional | DFP ad unit code        | `'/62532913/s_fluct.test_hb_prebid_11940'` | `string` |
