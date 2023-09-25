---
layout: bidder
title: IQzone
description: Prebid IQzone Bidder Adapter
biddercode: iqzone
usp_supported: true
tcfeu_supported: false
schain_supported: true
media_types: banner, video, native
pbjs: true
pbs: true
pbs_app_supported: true
sidebarType: 1
---

### Prebid.js Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `placementId`      | optional | Placement Id         | `'0'`    | `'string'` |
| `endpointId`      | optional | Endpoint Id         | `'0'`    | `'string'` |

### Note

For the prebid server and prebid.js you only need to use one parameter: either placementId or endpointId
