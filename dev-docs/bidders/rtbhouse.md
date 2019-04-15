---
layout: bidder
title: RTBHouse
description: Prebid RTB House Bidder Adapter
gdpr_supported: true
hide: true
biddercode: rtbhouse
media_types: banner, native
---


### bid params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description         | Example       | Type     |
|---------------|----------|---------------------|---------------|----------|
| `publisherId` | required | Unique publisher ID | `'ABCDEF'`    | `string` |
| `region`      | required | Assigned region     | `'prebid-eu'` | `string` |
| `bidfloor`    | optional | Minimal CPM value   | `0.01`        | `float`  |
