---
layout: bidder
title: TheMediaGrid
description: Prebid TheMediaGrid Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: grid
biddercode_longer_than_12: false
prebid_1_0_supported : true
media_types: banner, video
gdpr_supported: true
---


### bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                    | Example   | Type      |
|-------------|----------|----------------------------------------------------------------------------------------------------------------|-----------|-----------|
| `uid`       | required | Represents the MediaGrid bidder system Ad Slot ID associated with the respective div id from the site page. | `1`       | `integer` |