---
layout: bidder
title: admedia
description: Prebid admedia Bidder Adaptor
pbjs: true
biddercode: admedia
media_types: banner
sidebarType: 1
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description              | Example      | Type     |
|-----------------|----------|--------------------------|--------------|----------|
| `placementId`   | required | The placement ID provided by admedia | `'1234567'` | `string` |
| `aid`    | required | The aid provided by admedia | `'1234'` | `string` |
| `referrrInfo`    | required | The referring page url to be sent by the publisher | `'https://test.com/abc'` | `string` |
