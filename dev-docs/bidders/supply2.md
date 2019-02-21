---
layout: bidder
title: Supply2
description: Prebid Media Donuts Bidder Adaptor
hide: true
biddercode: supply2
biddercode_longer_than_12: false
gdpr_supported: true
---


### bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                                                                                                                     | Example   | Type      |
|-------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|-----------|
| `uid`       | required | Represents the Media Donuts bidder system Ad Slot ID associated with the respective div id from the site page.                                                                                                                  | `24`      | `integer` |
| `priceType` | optional | Can take the values `gross` or `net`, default value is `net`. Net represents the header bid price with the Media Donuts header bidder margin already extracted. Gross price does contain the Media Donuts bidder margin within. | `'gross'` | `string`  |
