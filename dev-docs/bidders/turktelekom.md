---
layout: bidder
title: Türk Telekom
description: Prebid Türk Telekom Bidder Adaptor
pbjs: true
biddercode: turktelekom
media_types: banner, video
gdpr_supported: true
pbjs_version_notes: not in 5.x
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                                                                                                                     | Example   | Type      |
|-------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|-----------|
| `uid`       | required | Represents the Türk Telekom bidder system Ad Slot ID associated with the respective div id from the site page.                                                                                                                  | `42`      | `integer` |
| `priceType` | optional | Can take the values `gross` or `net`, default value is `net`. Net represents the header bid price with the Türk Telekom header bidder margin already extracted. Gross price does contain the Türk Telekom bidder margin within. | `'gross'` | `string`  |
