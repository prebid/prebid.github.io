---
layout: bidder
title: Nexx360
description: Prebid Nexx360 Bidder Adapter
pbjs: true
biddercode: nexx360
gdpr_supported: true
usp_supported: true
schain_supported: true
userIds: id5Id
media_types: banner, video
glv_id: 965
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example                              | Type      |
|---------------|----------|-----------------------|--------------------------------------|-----------|
| `account`     | required | Nexx360 account ID    | `'1067'`                             | `string`  |
| `tagId`       | required | Nexx360 tag ID        | `'luvxjvgn'`                         | `string`  |
| `bidfloor`       | optional | Bidfloor applied to auction (default: 0)        | `0.8`                         | `float`  |
| `bidfloorCurrency`       | optional | Bidfloor currency (default: `USD`) - Can be `USD` or `EUR`       | `USD`                         | `string`  |
| `keywords`       | optional | Keywords used for targeting       | `{ 'interest': ['cars', 'sports']}`                         | `object`  |
