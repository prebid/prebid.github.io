---
layout: bidder
title: InteractiveOffers
description: Prebid InteractiveOffers.com Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: interactiveOffers
biddercode_longer_than_12: false
prebid_1_0_supported : true
---


### bid params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description                                                          | Example                           | Type      |
|----------|----------|----------------------------------------------------------------------|-----------------------------------|-----------|
| `pubId`  | required | The placement ID (site channel ID)                                   | `4`                               | `integer` |
| `tmax`   | optional | Max timeout for response                                             | `150`                             | `integer` |

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
