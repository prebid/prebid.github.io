---
layout: bidder
title: InteractiveOffers
description: Prebid InteractiveOffers.com Bidder Adaptor
pbjs: true
biddercode: interactiveOffers
gdpr_supported: false
media_types: banner
---

### Note:
Module that connects to interactiveOffers demand sources. Param pubId is required.

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description                                                          | Example                           | Type      |
|----------|----------|----------------------------------------------------------------------|-----------------------------------|-----------|
| `pubId`  | required | The placement ID (site channel ID)                                   | `4`                               | `integer` |
| `tmax`   | optional | Max timeout for response                                             | `150`                             | `integer` |

Example:

``` bash
{
    bidder: "interactiveOffers",
    params: {
        pubId: 4,
        tmax: 150
    }
}
```
