---
layout: bidder
title: MobileFuse
pbs: true
pbjs: false
media_types: banner, video
schain_supported: true
usp_supported: true
coppa_supported: true
biddercode: mobilefuse
ccpa_supported: true
prebid_member: true
pbs_app_supported: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description            | Example | Type     |
|------------|----------|------------------------|---------|----------|
| placement_id | required | An ID which identifies this specific inventory placement | 1111 | integer |
| pub_id | required | An ID which identifies the publisher selling the inventory| 2222 | integer |
| tagid_src | optional | ext if passing publisher's ids, empty if passing MobileFuse IDs in placement_id field. Defaults to empty | '' | string |
