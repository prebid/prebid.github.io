---
layout: bidder
title: BuySellAds
description: Prebid Serverbid Bidder Adaptor
hide: true
biddercode: buysellads
aliasCode: serverbid
biddercode_longer_than_12: false
---


### bid params

{: .table .table-bordered .table-striped }
| Name              | Scope    | Description                                                                                                          | Example                                       |
| :---              | :----    | :----------                                                                                                          | :------                                       |
| `siteId`      | required | The site ID from BuySellAds.                                                                           | `12345`                                       |
| `zoneIds`      | optional | An array of integer zone IDs from BuySellAds.                                                                            | `[12345, 4567]`                                       |
| `networkId`       | required | The network ID from BuySellAds.           | `9969`                                       |
