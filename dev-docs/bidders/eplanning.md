---
layout: bidder
title: E-Planning
description: Prebid E-Planning Bidder Adapter
hide: true
biddercode: eplanning
biddercode_longer_than_12: false
---



### Note:
The E-Planning Header Bidding adaptor requires setup and approval from the E-Planning team. Please go to [E-Planning website](http://www.e-planning.net) for more details.

### bid params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                                   | Example                   | Type      |
|-------|----------|-----------------------------------------------|---------------------------|-----------|
| `ci`  | required | Your partner ID (provided by E-Planning)      | `'18f66'`                 | `string`  |
| `sv`  | optional | Indicates a bidder URL different than default | `'ads.us.e-planning.net'` | `string`  |
| `isv` | optional | Indicates a CDN URL different than default    | `'us.img.e-planning.net'` | `string`  |
| `t`   | optional | Indicates bidding for testing purposes        | `1`                       | `integer` |
