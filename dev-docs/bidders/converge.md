---
layout: bidder
title: Converge
description: Prebid Converge Bidder Adaptor
pbjs: true
biddercode: converge
media_types: banner, video
gdpr_supported: true
usp_supported: true
pbjs_version_notes: not in 5.x
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                                                                                                             | Example                                   | Type      |
|-------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------|-----------|
| `uid`       | required | Represents the Converge bidder system Ad Slot ID associated with the respective div id from the site page.                                                                                                              | `59`                                      | `integer` |
| `priceType` | optional | Can take the values `gross` or `net`, default value is `net`. Net represents the header bid price with the Converge header bidder margin already extracted. Gross price does contain the Converge bidder margin within. | `'gross'`                                 | `string`  |
| `keywords`  | optional | A set of key-value pairs applied to all ad slots on the page. Values can be empty.                                                                                                                                      | `keywords: { topic: ['stress', 'fear'] }` | `object`  |
