---
layout: bidder
title: Arteebee
description: Prebid Arteebee Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: arteebee
biddercode_longer_than_12: false
prebid_1_0_supported : true
gdpr_supported: true
---

### bid params

{: .table .table-bordered .table-striped }
| Name   | Scope    | Description                        | Example        | Type      |
|--------|----------|------------------------------------|----------------|-----------|
| pub    | required | RTB publisher id                   | `'prebidtest'` | `string`  |
| source | required | RTB traffic source id              | `'prebidtest'` | `string`  |
| coppa  | optional | flag this request subject to COPPA | `1`            | `integer` |
