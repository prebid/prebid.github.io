---
layout: bidder
title: GXOne
description: GXOne Bidder Adapter
hide: true
biddercode: gxone
biddercode_longer_than_12: false
---


### bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                                                                                                 | Example   | Type      |
|-------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|-----------|
| `uid`       | required | Represents the GXOne bidder system Ad Slot ID associated with the respective div id from the site page.                                                                                                     | `2`       | `integer` |
| `priceType` | optional | Can take the values `gross` or `net`, default value is `net`. Net represents the header bid price with the header bidder margin already extracted. Gross price does contain the GXOne bidder margin within. | `'gross'` | `string`  |
