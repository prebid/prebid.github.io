---
layout: bidder
title: Feature Forward
description: Prebid Feature Forward Bidder Adapter
top_nav_section: dev_docs
nav_section: reference
pbjs: true
biddercode: featureforward
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                         | Example | Type      |
|---------------|----------|---------------------------------------------------------------------|---------|-----------|
| `pubId`       | required | unique identifier per publisher, number range 1-999                 | `32`    | `integer` |
| `siteId`      | required | unique identifier per publisher site, number range 1-999            | `01`    | `integer` |
| `placementId` | required | unique identifier per placement per publisher site, ranges from 0-9 | `3`     | `integer` |
