---
layout: bidder
title: Adquery
description: Prebid Adquery Bidder Adaptor
pbjs: true
biddercode: adquery
gdpr_supported: true
usp_supported: true
schain_supported: true
gvl_id: 902
userIds: adQuery QiD
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description   | Example                                                                  | Type      |
|---------------|----------|---------------|--------------------------------------------------------------------------|-----------|
| `placementId` | required | Placement ID  | `6d93f2a0e5f0fe2cc3a6e9e3ade964b43b07f897`                               | `string`  |
| `type`        | required | Ad Type       | `banner`                                                                 | `string`  |
| `sizes`       | required | Allowed sizes | `320x100,300x250,336x280,300x50,300x100,320x50,320x480,300x150,320x180`  | `string`  |
