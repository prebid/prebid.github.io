---
layout: bidder
title: E-Planning
description: Prebid E-Planning Bidder Adapter
pbjs: true
pbs: true
biddercode: eplanning
usp_supported: true
gdpr_supported: true
tcf2_supported: true
---



### Note:
The E-Planning Header Bidding adaptor requires setup and approval from the E-Planning team. Please go to [E-Planning website](http://www.e-planning.net) for more details.

### Bid Params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                                   | Example                   | Type      |
|-------|----------|-----------------------------------------------|---------------------------|-----------|
| `ci`  | required | Your partner ID (provided by E-Planning)      | `'18f66'`                 | `string`  |
| `sv`  | optional | Indicates a bidder URL different than default | `'ads.us.e-planning.net'` | `string`  |
| `isv` | optional | Indicates a CDN URL different than default    | `'us.img.e-planning.net'` | `string`  |
| `t`   | optional | Indicates bidding for testing purposes        | `1`                       | `integer` |
| `ml`  | optional | Uses placement names as ad unit names instead of sizes | `1`              | `integer` |
| `sn`  | optional | Uses space name instead of sizes              | `adunitName`              | `string`  |
