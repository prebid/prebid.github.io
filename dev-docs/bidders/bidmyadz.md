---
layout: bidder
title: BidMyAdz
description: Prebid Bidmyadz Bidder Adapter
biddercode: bidmyadz
usp_supported: true
schain_supported: true
media_types: banner, video, native
gdpr_supported: true
pbjs: false
pbs: true
pbs_app_supported: true
pbjs_version_notes: not in 5.x
---

### Prebid Server Bid Params
Currently adapter doesn't support multiimpression, so only the first impression will be delivered

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                              | Example    | Type      |
|----------------|----------|----------------------------------------------------------|------------|-----------|
| `placementId` | required | Placement Id will be generated on BidMyAdz Platform. | `'1234'`        | `string` |
