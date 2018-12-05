---
layout: bidder
title: OTM
description: OTM Bidder Adapter
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: otm
biddercode_longer_than_12: false
prebid_1_0_supported : true
---

### bid params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                            | Example     | Type     |
|---------------|----------|----------------------------------------|-------------|----------|
| `pid`         | required | Publisher id                           | `'1'`       | `string` |
| `tid`         | required | A tag id (should have low cardinality) | `'demo'`    | `string` |
| `bidfloor`    | optional | Floor price                            | `20`        | `integer`|
