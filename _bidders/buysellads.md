---
layout: bidder
title: BuySellAds
description: Prebid Serverbid Bidder Adaptor

top_nav_section: dev_docs
nav_section: reference

hide: true

biddercode: buysellads

aliasCode: serverbid

biddercode_longer_than_12: false
prebid_1_0_supported: true

---


### bid params

{: .table .table-bordered .table-striped }
| Name              | Scope    | Description                                                                                                          | Example                                       |
| :---              | :----    | :----------                                                                                                          | :------                                       |
| `siteId`      | required | The site ID from BuySellAds.                                                                           | `12345`                                       |
| `zoneIds`      | optional | An array of integer zone IDs from BuySellAds.                                                                            | `[12345, 4567]`                                       |
| `networkId`       | required | The network ID from BuySellAds.           | `9969`                                       |
