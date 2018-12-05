---
layout: bidder
title: InteractiveOffers
description: Prebid InteractiveOffers.com Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: interactiveOffers
biddercode_longer_than_12: true
prebid_1_0_supported : true
gdpr_supported: false
media_types: banner
---

### Note:
Module that connects to interactiveOffers demand sources. Param pubId is required.

### bid params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description                                                          | Example                           | Type      |
|----------|----------|----------------------------------------------------------------------|-----------------------------------|-----------|
| `pubId`  | required | The placement ID (site channel ID)                                   | `4`                               | `integer` |
| `tmax`   | optional | Max timeout for response                                             | `150`                             | `integet` |

Example:
```javascript
{
    bidder: "interactiveOffers",
    params: {
        pubId: 4,
        tmax: 150
    }
}
```
