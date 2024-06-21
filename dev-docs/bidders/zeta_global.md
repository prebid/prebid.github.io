---
layout: bidder
title: Zeta Global
description: Zeta Global Prebid Bidder Adapter
pbjs: true
biddercode: zeta
deals_supported: false
media_types: banner
tcfeu_supported: true
tcf2_supported: true
gvl_id: 469
sidebarType: 1
---

### Registration

All references to the OpenRTB spec refer to OpenRtb v2.5 (<https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf>)

To use this bidder you will need a valid definerId.  For further information, please contact <jzirbel@disqus.com>.

### Bid Params

{: .table .table-bordered .table-striped }
| Name                 | Scope    | Description                                                                                                                | Example                 | Type           |
|----------------------|----------|----------------------------------------------------------------------------------------------------------------------------|-------------------------|----------------|
| `definerId`          | required | The Definer ID provided by Zeta Global                                                                                     | `"12345"`               | `string`       |
| `user`               | required | The object containing user data (See OpenRTB spec)                                                                         | `user: {}`              | `object`       |
| `user.buyeruid`      | required | Zeta's user id                                                                                                             | `"12345"`               | `string`       |
| `device`             | required | The object containing device data (See OpenRTB spec)                                                                       | `device: {}`            | `object`       |
| `site`               | optional | The object containing site data (See OpenRTB spec)                                                                         | `site: {}`              | `object`       |
| `app`                | optional | The object containing app data (See OpenRTB spec)                                                                          | `app: {}`               | `object`       |
| `test`               | optional | Flag which will induce a sample bid response when true; only set to true for testing purposes (1 = true, 0 = false)        | `1`                     | `integer`      |
| `at`                 | optional | Auction type, where 1 = First Price, 2 = Second Price Plus                                                                 | `1`                     | `integer`      |
| `tmax`               | optional | Maximum time in milliseconds the exchange allows for bids to be received including Internet latency to avoid timeout       | `200`                   | `integer`      |
| `wseat`              | optional | White list of buyer seats (e.g., advertisers, agencies) allowed to bid on this impression                                  | `wseat: ["123"]`        | `string array` |
| `bseat`              | optional | Block list of buyer seats (e.g., advertisers, agencies) restricted from bidding on this impression                         | `bseat: ["123"]`        | `string array` |
| `allimps`            | optional | Flag to indicate that the impressions offered represent all the impressions available in context (1 = true, 0 = false)     | `1`                     | `integer`      |
| `wlang`              | optional | White list of languages for creatives                                                                                      | `wlang: ["ENG"]`        | `string array` |
| `bcat`               | optional | Blocked advertiser categories using the IAB content categories                                                             | `bcat: ["123"]`         | `string array` |
| `badv`               | optional | Block list of advertisers by their domains                                                                                 | `badv: ["blocked.com"]` | `string array` |
| `bapp`               | optional | Block list of applications by their platform-specific exchange independent application identifiers                         | `badv: ["com.blocked"]` | `string array` |
| `source`             | optional | A Source object that provides data about the inventory source and which entity makes the final decision (See OpenRTB spec) | `source: {}`            | `object`       |
| `ext`                | optional | An extension object that allows for custom fields and objects to be sent  (See OpenRTB spec)                               | `ext: {}`               | `object`       |
