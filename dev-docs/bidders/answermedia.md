---
layout: bidder
title: Answer Media
description: Prebid Serverbid Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: answermedia
aliasCode: serverbid
biddercode_longer_than_12: false
prebid_1_0_supported: true

---


### bid params

{: .table .table-bordered .table-striped }
| Name              | Scope    | Description                                                                                                          | Example                                       | Type |
| :---              | :----    | :----------                                                                                                          | :------                                       | :---- |
| `siteId`      | required | The site ID from Answer Media.                                                               | `12345`                                       |  Integer |
| `zoneIds`      | optional | An array of integer zone IDs from Answer Media.                                                                | `[12345, 4567]`                                       |  Array of integers |
| `networkId`       | required | The network ID from Answer Media. | `9969`                                       | Integer |
