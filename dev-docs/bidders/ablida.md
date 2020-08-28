---
layout: bidder
title: ablida
description: Prebid ablida Bidder Adaptor
pbjs: true
media_types: banner
biddercode: ablida
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description              | Example      | Type     |
|-----------------|----------|--------------------------|--------------|----------|
| `placementId`   | required | The placement ID provided by ablida | `'1234567'` | `string` |
| `categories`    | optional | IAB 2.0 category names of page | `['automotive', 'news-and-politics']` | `Array<string>` |
