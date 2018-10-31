---
layout: bidder
title: AdformOpenRTB
description: Prebid AdformOpenRTB Bidder Adaptor

top_nav_section: dev_docs
nav_section: reference

hide: true

biddercode: adformOpenRTB

biddercode_longer_than_12: true

prebid_1_0_supported : true
media_types: native
gdpr_supported: true
---

### bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description          | Example            | Type      |
|-------------|----------|----------------------|--------------------|-----------|
| `mid`       | required |                      | `12345`            | `integer` |
| `adxDomain` | optional | The Adform domain    | `'adx.adform.net'` | `string`  |
| `site`      | optional | Site id              | `'123123'`         | `string`  |
| `priceType` | optional | Price type           | `'gross'`          | `string`  |
| `publisher` | optional | Info about publisher | `{`                | `object`  |
|             |          |                      | `   id: '2706',`   |           |
|             |          |                      | `   name: 'name',` |           |
|             |          |                      | `   domain: 'dom'` |           |
|             |          |                      | `}`                |           |
