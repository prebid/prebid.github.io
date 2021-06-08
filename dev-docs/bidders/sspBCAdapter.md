---
layout: bidder
title: sspBC
description: Prebid sspBC Bidder Adaptor
pbjs: true
biddercode: sspBC
media_types: banner
gdpr_supported: true
tcf2_supported: true
gvl_id: 676
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                | Example                     | Type      |
|-------------|----------|----------------------------|-----------------------------|-----------|
| `id`        | required | placement id               | `'006'`                     | `string`  |
| `siteId`    | required | site id                    | `'235911'`                  | `string`  |
| `domain`    | optional | site domain                | `'somesite.com'`            | `string`  |
| `page`      | optional | page url                   | `'somesite.com/index.html'` | `string`  |
| `tmax`      | optional | tmax for server connection | `400`                       | `integer` |
