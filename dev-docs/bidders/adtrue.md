---
layout: bidder
title: AdTrue
description: AdTrue Exchange Bidder Adapter
pbjs: true
biddercode: adtrue
media_types: banner
gdpr_supported: true
schain_supported: true
usp_supported: true
sidebarType: 1
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                    | Example    | Type     |
|-------------|----------|--------------------------------------------------------------------------------------------------------------------------------|------------|----------|
| `zoneId`    | required | ZoneId provided by AdTrue                                                                                         | `'21423'` | `string` |
| `publisherId`    | required | PublisherID provided by AdTrue                                                                                         | `'1491'` | `string` |
| `reserve`    | optional | Bid Floor                                                                                         | `0.5` | `float` |
