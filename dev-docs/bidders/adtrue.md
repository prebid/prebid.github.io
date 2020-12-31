---
layout: bidder
title: AdTrue
description: AdTrue Exchange Bidder Adapter
pbjs: true
biddercode: adtrue
media_types: banner, video
gdpr_supported: true
tcf2_supported: true
schain_supported: true
usp_supported: true
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                    | Example    | Type     |
|-------------|----------|--------------------------------------------------------------------------------------------------------------------------------|------------|----------|
| `zoneId`    | required | ZoneId provided by AdTrue                                                                                         | `'6677028'` | `string` |
| `publisherId`    | required | PublisherID provided by AdTrue                                                                                         | `'10888'` | `string` |
| `reserve`    | optional | Bid Floor                                                                                         | `'0.5'` | `string` |
