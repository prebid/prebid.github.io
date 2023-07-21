---
layout: bidder
title: Brid
description: Prebid Brid Bidder Adapter
biddercode: brid
media_types: video
gdpr_supported: true
usp_supported: true
schain_supported: true
pbjs: true
gvl_id: 934
sidebarType: 1
---

#### Bid Params

{: .table .table-bordered .table-striped }
| Name                | Scope    | Description                                                                                                                                                                   | Example                                               | Type             |
|---------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|------------------|
| `placementId`       | required | The placement ID from Brid. The `placementID` parameter can be either a `string` or `integer` for Prebid.js, however `integer` is preferred. Legacy code can retain the `string` value. **Prebid Server requires an integer value.**                                                    | `12345`                                            | `integer`         |
