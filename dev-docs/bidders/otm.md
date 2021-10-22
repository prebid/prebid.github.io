---
layout: bidder
title: OTM
description: OTM Bidder Adapter
pbjs: true
biddercode: otm
floors_supported: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                            | Example     | Type     |
|---------------|----------|----------------------------------------|-------------|----------|
| `tid`         | required | A tag id                               | `'99'`      | `string` |
| `bidfloor`    | optional | Floor price                            | `20`        | `integer`|
| `domain`      | optional | Custom domain                          | `domain.tld`| `string` |
