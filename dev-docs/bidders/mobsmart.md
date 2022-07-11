---
layout: bidder
title: Mobsmart
description: Prebid Mobsmart SSP Bidder Adaptor
pbjs: true
biddercode: mobsmart
media_types: banner
userIds: pubCommonId
enable_download: false
pbjs_version_notes: not ported to 5.x
---

### Note:
The Mobsmart Bidding adapter requires setup and approval beforehand.
For more information, visit [Mobsmart website](https://kpis.jp/en/product_mobsmart).

### Bid Params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                             | Example  | Type      |
|--------------|----------|-----------------------------------------|----------|-----------|
| `floorPrice` | optional | Floor price                             | `10`     | `Integer` |
| `currency`   | optional | Currency of request and response        | `'JPY'`  | `string`  |
