---
layout: bidder
title: RTBHouse
description: Prebid RTB House Bidder Adapter
gdpr_supported: true

top_nav_section: dev_docs
nav_section: reference

hide: true
biddercode: rtbhouse
biddercode_longer_than_12: false

media_types: banner, native
prebid_1_0_supported : true
---


### bid params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description         | Example       | Type     |
|---------------|----------|---------------------|---------------|----------|
| `publisherId` | required | Unique publisher ID | `'ABCDEF'`    | `string` |
| `region`      | required | Assigned region     | `'prebid-eu'` | `string` |
