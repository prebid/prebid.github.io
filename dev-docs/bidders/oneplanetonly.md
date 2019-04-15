---
layout: bidder
title: Oneplanetonly
description: Prebid Oneplanetonly Bidder Adaptor
hide: true
biddercode: oneplanetonly
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description    | Example       | Type     |
|------------|----------|----------------|---------------|----------|
| `siteId`   | required | The site id    | `'5'`         | `string` |
| `adUnitId` | required | The ad unit id | `'5-4587544'` | `string` |

Example:

``` bash
{
    bidder: 'oneplanetonly',
    params: {
      siteId: '5',
      adUnitId: '5-4587544'
    }
}
```
