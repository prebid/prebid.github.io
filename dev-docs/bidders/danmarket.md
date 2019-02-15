---
layout: bidder
title: DAN Marketplace
description: Dentsu Aegis Network Marketplace Bidder Adapter
hide: true
biddercode: danmarket
biddercode_longer_than_12: false
gdpr_supported: true
---


### bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                                                                                                           | Example   | Type      |
|-------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|-----------|
| `uid`       | required | Represents the DAN Marketplace bidder system Ad Slot ID associated with the respective div id from the site page.                                                                                                     | `5`       | `integer` |
| `priceType` | optional | Can take the values `gross` or `net`, default value is `net`. Net represents the header bid price with the header bidder margin already extracted. Gross price does contain the DAN Marketplace bidder margin within. | `'gross'` | `string`  |
