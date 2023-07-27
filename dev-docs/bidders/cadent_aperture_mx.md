---
layout: bidder
title: Cadent Aperture MX
description: Prebid Cadent Aperture MX Bidder Adaptor
pbjs: true
pbs: true
biddercode: cadent_aperture_mx
media_types: banner, video
gdpr_supported: true
gvl_id: 183
usp_supported: true
schain_supported: true
floors_supported: true
userIds: identityLink, uid2
sidebarType: 1
---

### Registration

To use this bidder you will need an account and a valid tagid from our exchange.  For further information, please contact your Account Manager or <contactaperturemx@cadent.tv>.

### Bid Params

{: .table .table-bordered .table-striped }
| Name              | Scope    | Description                                                                                                          | Example                                       | Type       |
|-------------------|----------|----------------------------------------------------------------------------------------------------------------------|-----------------------------------------------|------------|
| `tagid`           | required | The Tag ID from Cadent Aperture MX.                                                                                  | `test1`                                       | `string`   |
| `bidfloor`        | optional | The CPM bid floor                                                                                                    | `0.25`                                        | `string`   |
