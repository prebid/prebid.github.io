---
layout: bidder
title: AdformOpenRTB
description: Prebid AdformOpenRTB Bidder Adaptor
hide: true
biddercode: adformOpenRTB
media_types: native
gdpr_supported: true
---

### Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description          | Example            | Type      |
|-------------|----------|----------------------|--------------------|-----------|
| `mid`       | required |                      | `12345`            | `integer` |
| `adxDomain` | optional | The Adform domain    | `'adx.adform.net'` | `string`  |
| `site`      | optional | Site id              | `'123123'`         | `string`  |
| `priceType` | optional | Price type           | `'gross'`          | `string`  |
| `publisher` | optional | Info about publisher | `{"id": "2706", "name": "name", "domain": "dom"}`                | `object`  |
