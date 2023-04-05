---
layout: bidder
title: TargetVideo
description: Prebid TargetVideo Bidder Adaptor
biddercode: targetVideo
media_types: banner
gdpr_supported: true
schain_supported: true
pbjs: true
sidebarType: 1
---

#### Bid Params

{: .table .table-bordered .table-striped }
| Name                | Scope    | Description                                                                                                                                                                   | Example                                               | Type             |
|---------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|------------------|
| `placementId`       | required | The placement ID from TargetVideo.  You may identify a placement using the `invCode` and `member` instead of a placement ID. The `placementID` parameter can be either a `string` or `integer` for Prebid.js, however `integer` is preferred. Legacy code can retain the `string` value. **Prebid Server requires an integer value.**                                                    | `234234`                                            | `integer`         |
