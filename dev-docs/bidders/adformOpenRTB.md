---
layout: bidder
title: AdformOpenRTB
description: Prebid AdformOpenRTB Bidder Adaptor
hide: true
biddercode: adformOpenRTB
biddercode_longer_than_12: true
media_types: native
gdpr_supported: true
---

#### Send all bids ad server keys

(Truncated to 20 chars due to [DFP limit](https://support.google.com/dfp_premium/answer/1628457?hl=en#Key-values))

`hb_pb_adformOpenRTB`
`hb_adid_adfromOpenRT`
`hb_source_adformOpen`

### Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description          | Example            | Type      |
|-------------|----------|----------------------|--------------------|-----------|
| `mid`       | required |                      | `12345`            | `integer` |
| `adxDomain` | optional | The Adform domain    | `'adx.adform.net'` | `string`  |
| `site`      | optional | Site id              | `'123123'`         | `string`  |
| `priceType` | optional | Price type           | `'gross'`          | `string`  |
| `publisher` | optional | Info about publisher | `{"id": "2706", "name": "name", "domain": "dom"}`                | `object`  |
