---
layout: bidder
title: MANTIS Ad Network
description: Prebid Mantis Bidder Adaptor
pbjs: true
biddercode: mantis
media_types: native, video
usp_supported: true
gdpr_supported: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                                   | Example                      | Type     |
|------------|----------|---------------------------------------------------------------|------------------------------|----------|
| `property` | required | The unique identifier provided for your entire account.       | `'5a5840d00000000000000000'` | `string` |
| `zone`     | required | The unique identifier for the placement defined in our admin. | `'sidebar-top-1'`            | `string` |
