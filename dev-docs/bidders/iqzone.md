---
layout: bidder
title: IQzone
description: Prebid IQzone Bidder Adapter
biddercode: iqzone
usp_supported: true
gdpr_supported: true
schain_supported: true
media_types: banner, video, native
pbjs: true
pbs: true
pbs_app_supported: true
---

### Prebid.js Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `placementId`      | required | Placement Id         | `'0'`    | `'string'` |


### Prebid server Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `endpointId`      | required | Endpoint Id         | `'0'`    | `'string'` |