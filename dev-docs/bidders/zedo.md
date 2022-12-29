---
layout: bidder
title: ZEDO
description: Prebid ZEDO Bidder Adapter
pbjs: true
biddercode: zedo
enable_download: false
pbjs_version_notes: not ported to 5.x
sidebarType: 1
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description                                                                            | Example                     | Type      |
|-----------------|----------|----------------------------------------------------------------------------------------|-----------------------------|-----------|
| `channelCode`   | required | Publisher code associated with ZEDO                                                    | `2264004118`                    | `integer` |
| `dimId`         | required | ZEDO dimension Id associated with the adunit                                                | `9`                         | `integer` |
| `pubId`         | optional | ZEDO Publisher Id associated with the adunit                                                | `0`                         | `integer` |
