---
layout: bidder
title: InteractiveOffers
description: Prebid InteractiveOffers.com Bidder Adapter
pbs: true
pbjs: true
biddercode: interactiveOffers
gdpr_supported: false
media_types: banner
---

### Note:
Module that connects to interactiveOffers demand sources. Param pubid is required.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description | Example | Type     |
|---------------|----------|-------------|---------|----------|
| `pubid` | required |  Publisher id          | 35   | `integer` |

Example:

``` bash
{
    bidder: "interactiveOffers",
    params: {
        pubid: 35
    }
}
```
