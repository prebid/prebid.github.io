---
layout: bidder
title: EMX Digital
description: Prebid EMX Digital Bidder Adaptor

top_nav_section: dev_docs
nav_section: reference

hide: true
biddercode: emx_digital
biddercode_longer_than_12: false
bidder_supports_deals: false
media_types: native
prebid_1_0_supported : true
gdpr_supported: true
---


### bid params

{: .table .table-bordered .table-striped }
| Name              | Scope    | Description                                                                                                          | Example                                       | Type       |
|-------------------|----------|----------------------------------------------------------------------------------------------------------------------|-----------------------------------------------|------------|
| `tagid`           | required | The Tag ID from EMX Digital.                                                                                         | `test1`                                       | `string`   |
| `bidfloor`        | optional | The CPM bid floor                                                                                                    | `0.25`                                        | `string`   |