---
layout: bidder
title: C1X
description: Prebid C1X Bidder Adaptor
pbs: false
pbjs: true
biddercode: c1x
media_types: banner
gdpr_supported: true
pbs_app_supported: false
enable_download: true
---

### Note

The C1X Header Bidding adaptor requires approval from the C1X team. Please reach out to  <header-bidding@c1exchange.com> for more information.

### Bid params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                     |  Example                            | Type     |
|----------------|----------|-----------------------------------------------------------------|-------------------------------------|----------|
| `placementId`  | required | Placement ID                                                    | `'12345'`                           | `string` |
| `siteId`       | required | Site ID from which the request is originating                   | `'999'`                             | `string` |
| `dealId`       | optional | Deal ID to get the specific deal from our DSP                   | `'123456'`                          | `string` |
| `floorPriceMap`| optional | Minimum floor prices needed from the DSP's to enter the auction | `{"300x250": 4.00,"300x600": 3.00}` | `object` |
| `pageurl`      | optional | Url of the webpage where the request is originating from        | `'www.example.com'`                 | `string` |
