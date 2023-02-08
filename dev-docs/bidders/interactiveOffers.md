---
layout: bidder
title: InteractiveOffers
description: Prebid InteractiveOffers.com Bidder Adapter
pbs: true
pbjs: true
biddercode: interactiveOffers
gdpr_supported: false
media_types: banner
sidebarType: 1
---

### Note:
Module that connects to interactiveOffers demand sources. Param partnerId is required.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description | Example | Type     |
|---------------|----------|-------------|---------|----------|
| `partnerId` | required |  Partner id          | 'abc123'   | `string` |

Example:

``` bash
{
    bidder: "interactiveOffers",
    params: {
        partnerId: "abc123"
    }
}
```
