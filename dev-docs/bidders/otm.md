---
layout: bidder
title: OTM
description: OTM Bidder Adapter
pbjs: true
biddercode: otm
floors_supported: true
media_types: banner
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                            | Example     | Type     |
|---------------|----------|----------------------------------------|-------------|----------|
| `tid`         | required | A tag id                               | `'99'`      | `string` |
| `bidfloor`    | optional | Floor price                            | `20`        | `integer`|
| `domain`      | optional | Custom domain                          | `domain.tld`| `string` |
