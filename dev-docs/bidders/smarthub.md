---
layout: bidder
title: SmartHub
description: SmartHub Bidder Adapter
biddercode: smarthub
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
{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                              | Example    | Type      |
|----------------|----------|----------------------------------------------------------|------------|-----------|
| `partnerName` | required | Unique partner name | `'partnertest'`        | `string` |
| `seat` | required | Seat value  | `'9Q20EdGxzgWdfPYShScl'`        | `string` |
| `token` | required | Token  | `'eKmw6alpP3zWQhRCe3flOpz0wpuwRFjW'`        | `string` |