---
layout: bidder
title: Mobfox_PB
description: Prebid Mobfox Bidder Adapter
biddercode: mobfoxpb
usp_supported: true
schain_supported: true
media_types: banner, video, native
tcfeu_supported: true
pbjs: true
pbs: true
pbs_app_supported: true
gpp_supported: true
gvl_id: 311
enable_download: true
sidebarType: 1
---

### Prebid.JS Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                              | Example    | Type      |
|----------------|----------|----------------------------------------------------------|------------|-----------|
| `placementId` | required | Placement Id will be generated on Mobfox Platform. | `'0'`        | `string` |

### Prebid Server Bid Params

Currently adapter doesn't support multiimpression, so only the first impression will be delivered

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                              | Example    | Type      |
|----------------|----------|----------------------------------------------------------|------------|-----------|
| `TagID` | optional | Placement Id will be generated on Mobfox Platform. For direct integration | `'0'`        | `string` |
| `key` | optional | Endpoint id will be generated on Mobfox Platform. For s2s integration | `'0'`        | `string` |

### Note

For the prebid server you only need to use one parameter: either TagID or key
