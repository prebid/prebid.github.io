---
layout: bidder
title: Zeta Global
description: Zeta Global Prebid Bidder Adapter
pbjs: true
biddercode: zeta_global
bidder_supports_deals: false
media_types: banner
gdpr_supported: true
gvl_id: 469
---

### Registration

All references to the OpenRTB spec refer to OpenRtb v2.5 (https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf)

To use this bidder you will need a valid definerId.  For further information, please contact jzirbel@disqus.com.

### Bid Params

{: .table .table-bordered .table-striped }
| Name                 | Scope    | Description                                                                                                         | Example      | Type      |
|----------------------|----------|---------------------------------------------------------------------------------------------------------------------|--------------|-----------|
| `user`               | required | The object containing user data (See OpenRTB spec)                                                                  | `user: {}`   | `object`  |
| `user.buyeruid`      | required | Zeta's user id                                                                                                      | `"12345"`    | `string`  |
| `device`             | required | The object containing device data (See OpenRTB spec)                                                                | `device: {}` | `object`  |
| `device.ip`          | required | The client IP                                                                                                       | `"0.0.0.0"`  | `string`  |
| `device.geo`         | required | The object containing geo data (See OpenRTB spec)                                                                   | `geo: {}`    | `object`  |
| `device.geo.country` | required | The country code pertinent to the request data                                                                      | `"USA"`      | `string`  |
| `definerId`          | required | The Definer ID from Zeta Global                                                                                     | `"12345"`    | `string`  |
| `site`               | optional | The object containing site data (See OpenRTB spec)                                                                  | `site: {}`   | `object`  |
| `app`                | optional | The object containing app data (See OpenRTB spec)                                                                   | `app: {}`    | `object`  |
| `test`               | optional | Flag which will induce a sample bid response when true; only set to true for testing purposes (1 = true, 0 = false) | `1`          | `integer` |
