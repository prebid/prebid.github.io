---
layout: bidder
title: ZEDO
description: Prebid ZEDO Bidder Adapter
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: zedo
biddercode_longer_than_12: false
prebid_1_0_supported : true
---


### bid params

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description                                                                            | Example                     | Type      |
|-----------------|----------|----------------------------------------------------------------------------------------|-----------------------------|-----------|
| `channelCode`   | required | Publisher code associated with ZEDO                                                    | `2264004118`                    | `integer` |
| `dimId`         | required | ZEDO dimension Id associated with the adunit                                                | `9`                         | `integer` |
| `pubId`         | optional | ZEDO Publisher Id associated with the adunit                                                | `0`                         | `integer` |
