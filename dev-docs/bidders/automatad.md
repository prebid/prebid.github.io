---
layout: bidder
title: Automatad OpenRTB Bid Adapter
description: Automatad OpenRTB Bid Adapter
biddercode: automatad 
pbjs: true
enable_download: false
pbjs_version_notes: removed in 12.0
pbs: true
media_types: banner
fpd_supported: false
sidebarType: 1
---

## Prebid.js Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `siteId` | required | The site ID from automatad. | `"12adf45c"` | `string` |
| `placementId` | optional | The placement ID from automatad. | `"a34gh6d"` | `string` |

## Prebid-Server Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `position` | optional | Position field from automatad | `22390678` | `string` |
| `placementId` | optional | The placement ID from automatad. | `"a34gh6d"` | `string` |
