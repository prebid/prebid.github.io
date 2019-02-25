---
layout: bidder
title: PubNX 
description: Prebid PubNX Bidder Adaptor
hide: true
biddercode: pubnx
biddercode_longer_than_12: false
---


### bid params

{: .table .table-bordered .table-striped }
| Name              | Scope    | Description                                                                                                          | Example                                       | Type |
| :---              | :----    | :----------                                                                                                          | :------                                       | :---- |
| `siteId`      | required | The site ID from PubNX.                                                               | `12345`                                       |  Integer |
| `zoneIds`      | optional | An array of integer zone IDs from PubNX.                                                                | `[12345, 4567]`                                       |  Array of integers |
| `networkId`       | required | The network ID from PubNX. | `9969`                                       | Integer |
