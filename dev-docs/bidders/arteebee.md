---
layout: bidder
title: Arteebee
description: Prebid Arteebee Bidder Adaptor
pbjs: true
enable_download: false
pbjs_version_notes: "Not available in current Prebid.js builds; specific reason unknown."
biddercode: arteebee
tcfeu_supported: false
coppa_supported: true
sidebarType: 1
---

## Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `pub` | required | RTB publisher id | `'prebidtest'` | `string` |
| `source` | required | RTB traffic source id | `'prebidtest'` | `string` |
| `coppa` | optional | flag this request subject to COPPA | `1` | `integer` |
