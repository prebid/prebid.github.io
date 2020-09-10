---
layout: bidder
title: sspBC
description: Prebid sspBC Bidder Adaptor

biddercode: sspBC
media_types: banner
gdpr_supported: true
tcf2_supported: true
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                | Example                     | Type      |
|-------------|----------|----------------------------|-----------------------------|-----------|
| `id`        | required | placement id               | `'006'`                     | `string`  |
| `siteId`    | required | site id                    | `'235911'`                  | `string`  |
| `domain`    | optional | site domain                | `'somesite.com'`            | `string`  |
| `page`      | optional | page url                   | `'somesite.com/index.html'` | `string`  |
| `tmax`      | optional | tmax for server connection | `250`                       | `integer` |
