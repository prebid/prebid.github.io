---
layout: bidder
title: Yandex
description: Prebid Yandex Bidder Adapter
pbjs: true
biddercode: yandex
media_types: banner
---


### Bid params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description             | Example   | Type      |
|---------------|----------|-------------------------|-----------|-----------|
| `pageId`      | required | Page ID                 | `123`     | `Integer` |
| `impId`       | required | Block ID                | `1`       | `Integer` |

### Test Parameters

```
var adUnits = [{
  code: 'banner-1',
  mediaTypes: {
    banner: {
      sizes: [[240, 400]],
    }
  },
  bids: [{
    {
      bidder: 'yandex',
      params: {
        pageId: 346580,
        impId: 143,
      },
    }
  }]
}];
```
