---
layout: bidder
title: Bidstack
description: Prebid Bidstack Bidder Adapter
biddercode: bidstack
gdpr_supported: true
gvl_id: 462
usp_supported: false
coppa_supported: false
schain_supported: true
dchain_supported: false
media_types: video
safeframes_ok: false
deals_supported: false
floors_supported: true
fpd_supported: false
pbjs: false
pbs: true
pbs_app_supported: true
prebid_member: false
sidebarType: 1
---

### Registration

The Bidstack Bidding adapter requires setup before beginning. Please contact us at <tech@bidstack.com>

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example   | Type     |
|---------------|----------|--------------|-----------|----------|
| `publisherId` | required | Publisher ID | `'be224bf2-fd3f-4afb-b6fc-4a97718be2f5'` | `string` |
| `placementId` | optional | Placement ID | `'some_placement_id'` | `string` |
| `consent` | optional | User EULA consent | `true` | `boolean` |
