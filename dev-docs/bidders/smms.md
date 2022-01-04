---
layout: bidder
title: SMMS
description: Prebid SMMS Bidder Adaptor
pbjs: true
biddercode: smms
media_types: banner, native
enable_download: false
pbjs_version_notes: not in 5.x
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description | Example | Type     |
|---------------|----------|-------------|---------|----------|
| `placementId` | required |  This is placement Id          | `1440837`   | `integer` |
| `currency`         | optional | 3-letter ISO 4217 code defining the currency of the bid (currently support USD and JPY), default is JPY            |   `'USD'`      | `string`  |
