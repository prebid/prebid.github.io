---
layout: bidder
title: SARA
description: SARA Bidder Adapter
pbjs: true
biddercode: sara
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                                                                                                | Example   | Type      |
|-------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|-----------|
| `uid`       | required | Represents the SARA bidder system Ad Slot ID associated with the respective div id from the site page.                                                                                                     | `5`       | `integer` |
| `priceType` | optional | Can take the values `gross` or `net`, default value is `net`. Net represents the header bid price with the header bidder margin already extracted. Gross price does contain the SARA bidder margin within. | `'gross'` | `string`  |
