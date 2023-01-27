---
layout: bidder
title: SA Lunamedia
description: SA Lunamedia Bidder Adapter
biddercode: sa_lunamedia
usp_supported: true
schain_supported: true
media_types: banner, video, native
gdpr_supported: true
pbjs: false
pbs: true
pbs_app_supported: true
gvl_id: 998
enable_download: false
sidebarType: 1
---

### Prebid Server Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                              | Example    | Type      |
|----------------|----------|----------------------------------------------------------|------------|-----------|
| `key` | required | Placement integration key | `'1234'`        | `string` |
| `type` | optional | Supported values are `publisher` and `network`.  | `'publisher'`        | `string` |
