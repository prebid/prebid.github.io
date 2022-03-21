---
layout: bidder
title: Buzzoola
description: Prebid Buzzoola Bidder Adaptor
biddercode: buzzoola
gdpr_supported: false
usp_supported: false
coppa_supported: false
schain_supported: false
dchain_supported: false
userId: all
media_types: banner, video, native
floors_supported: true
pbjs: true
pbs: true
pbs_app_supported: true
prebid_member: false
---

### Note:

* The Buzzoola Header Bidding adapter requires setup and approval before beginning. Please reach out to <support@buzzoola.com> for more details.
* Please note that cookie support is required.
* Floors supported only by Prebid Server adapter.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description   | Example                | Type      |
|---------------|----------|---------------|------------------------|-----------|
| `placementId` | required | Placement ID. | `417846`               | `integer` |
