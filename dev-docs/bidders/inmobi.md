---
layout: bidder
title: InMobi
description: InMobi Bidder Adapter
biddercode: inmobi
gdpr_supported: true
usp_supported: false
gvl_id: 333
coppa_supported: true
media_types: banner, video
pbs: true
pbs_app_supported: true
---

### Note:

The InMobi Prebid adapter requires a setup to create placement IDs. Please contact your InMobi partner manager for setup assistance. 
For queries, write to us at prebid-support@inmobi.com

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `plc`         | required | Placement ID          | `'1234'`  | `string`  |
