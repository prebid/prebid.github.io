---
layout: bidder
title: sspBC
description: Prebid sspBC Bidder Adaptor
pbjs: true
pbs: true
biddercode: sspBC
media_types: banner, video, native
floors_supported: true
gdpr_supported: true
gvl_id: 676
sidebarType: 1
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                | Example                     | Type      |
|---------------|----------|----------------------------|-----------------------------|-----------|
| `id`          | optional | placement id               | `'006'`                     | `string`  |
| `siteId`      | optional | site id                    | `'235911'`                  | `string`  |
| `publisherId` | optional | publisher id               | `'728'`                     | `string`  |
| `domain`      | optional | site domain                | `'somesite.com'`            | `string`  |
| `page`        | optional | page url                   | `'somesite.com/index.html'` | `string`  |
| `tmax`        | optional | tmax for server connection | `400`                       | `integer` |
