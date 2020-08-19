---
layout: bidder
title: H12 Media
description: Prebid H12 Media Bidder Adaptor
pbjs: true
biddercode: h12media
media_types: banner
gdpr_supported: true
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description            | Example                     | Type     |
|---------------|----------|------------------------|-----------------------------|----------|
| `pubid`       | required | Publisher ID           | `123`                       | `string` |
| `placementid` | optional | Publisher placement ID | `321`                       | `string` |
| `size`        | optional | Creative size          | `'300x250'`                 | `string` |
| `endpointdom` | optional | Custom Endpoint URL    | `https://h12-media.com/bid` | `string` |

Example:

``` bash
{
    bidder: "h12media",
    params: {
        pubid: 123,
        placementid: 321,
        size: '300x250'
    }
}
```
