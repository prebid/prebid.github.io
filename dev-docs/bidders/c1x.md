---
layout: bidder
title: C1X
description: Prebid C1X Bidder Adaptor
pbjs: true
biddercode: c1x
gdpr_supported: true
enable_download: false
pbjs_version_notes: not in 5.x
---

### Note:

The C1X Header Bidding adaptor requires approval from the C1X team. Please reach out to  <header-bidding@c1exchange.com> for more information.

### Bid params

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description                                                     | Example                             | Type     |
|-----------------|----------|-----------------------------------------------------------------|-------------------------------------|----------|
| `siteId`        | required | Site ID from which the request is originating                   | `'999'`                             | `string` |
| `pixelId`       | optional | Publisher's pixel ID                                            | `'12345'`                           | `string` |
| `floorPriceMap` | optional | Minimum floor prices needed from the DSP's to enter the auction | `{"300x250": 4.00,"300x600": 3.00}` | `object` |
| `dspid`         | optional | DSP ID                                                          | `'4321'`                            | `string` |
| `pageurl`       | optional | Url of the webpage where the request is originating from        | `'4321'`                            | `string` |
