---
layout: bidder
title: DAN Marketplace
description: Dentsu Aegis Network Marketplace Bidder Adapter
pbjs: true
biddercode: danmarket
tcfeu_supported: false
sidebarType: 1
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                                                                                                           | Example   | Type      |
|-------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|-----------|
| `uid`       | required | Represents the DAN Marketplace bidder system Ad Slot ID associated with the respective div id from the site page.                                                                                                     | `5`       | `integer` |
| `priceType` | optional | Can take the values `gross` or `net`, default value is `net`. Net represents the header bid price with the header bidder margin already extracted. Gross price does contain the DAN Marketplace bidder margin within. | `'gross'` | `string`  |
