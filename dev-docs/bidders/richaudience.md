---
layout: bidder
title: Rich Audience Bidder Adapter
description: Prebid Rich Audience Bidder Adapter

top_nav_section: dev_docs
nav_section: reference

hide: true

biddercode: richaudience

biddercode_longer_than_12: false

prebid_1_0_supported: true
media_types: banner, video
gdpr_supported: true
---

### bid params

#### Rich Audience

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                          | Example                                                   | Type      |
|-------------|----------|--------------------------------------|-----------------------------------------------------------|-----------|
| `pid`       | required | The placement ID from Rich Audience. | `'ADb1f40rmi'`                                            | `string`  |
| `supplyType`| required | Define if site or app.               | `'site / app'`                                            | `string`  |
| `ifa`       | optional | Identifier For Advertisers           | `'AAAAAAAAA-BBBB-CCCC-1111-222222220000234234234234234'`  | `string`  |
| `bidfloor`  | optional | Bid Floor                            | `0.80`                                                    | `float`   |
