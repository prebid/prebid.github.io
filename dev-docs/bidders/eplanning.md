---
layout: bidder
title: E-Planning
description: Prebid E-Planning Bidder Adapter
pbjs: true
pbs: true
media_types: banner, video
biddercode: eplanning
usp_supported: true
tcfeu_supported: true
schain_supported: true
pbs_app_supported: true
floors_supported: true
userIds: all
gvl_id: 90
sidebarType: 1
prebid_member: true
---



### Note

To use E-Planning bidder, you need to have an existing E-Planning account. To create a new account visit <https://www.e-planning.net/signup.html>. If you are an existing user, contact your account rep for information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                                   | Example                   | Type      |
|-------|----------|-----------------------------------------------|---------------------------|-----------|
| `ci`  | required | Your partner ID (provided by E-Planning)      | `'18f66'`                 | `string`  |
| `sv`  | optional | Indicates a bidder URL different than default | `'pbjs.e-planning.net'`   | `string`  |
| `isv` | optional | Indicates a CDN URL different than default    | `'i.e-planning.net'`      | `string`  |
| `t`   | optional | Indicates bidding for testing purposes        | `1`                       | `integer` |
| `ml`  | optional | Uses placement names as ad unit names instead of sizes | `1`              | `integer` |
| `sn`  | optional | Uses space name instead of sizes              | `adunitName`              | `string`  |
