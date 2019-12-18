---
layout: bidder
title: fluct
description: Prebid fluct Bidder Adaptor

top_nav_section: dev_docs
nav_section: reference

hide: true

biddercode: fluct
aliasCode : adingo
media_types: banner, video, native
userIds: none
prebid_member: false
gdpr_supported: true
coppa_supported: false
usp_supported: false
schain_supported: true



---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description             | Example                                    | Type     |
|---------------|----------|-------------------------|--------------------------------------------|----------|
| `dfpUnitCode` | required | DFP ad unit code        | `'/62532913/s_fluct.test_hb_prebid_11940'` | `string` |
| `groupId`     | required | The group ID from fluct | `'25405:1000192893'`                       | `string` |
| `tagId`       | required | The tag ID from fluct   | `'1000105712'`                             | `string` |
