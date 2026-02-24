---
layout: bidder
title: FairTrade
description: FairTrade Bidder Adapter
pbjs: true
biddercode: fairtrade
sidebarType: 1
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                                                                                                     | Example   | Type      |
|-------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|-----------|
| `uid`       | required | Represents the FairTrade bidder system Ad Slot ID associated with the respective div id from the site page.                                                                                                     | `5`       | `integer` |
| `priceType` | optional | Can take the values `gross` or `net`, default value is `net`. Net represents the header bid price with the header bidder margin already extracted. Gross price does contain the FairTrade bidder margin within. | `'gross'` | `string`  |
