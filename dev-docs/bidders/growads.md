---
layout: bidder
title: GrowAdvertising
description: Prebid GrowAdvertising Bidder Adapter
pbjs: true
biddercode: growads
media_types: banner, native
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  |  Example  | Type     |
|----------|----------|-----------|--------------------|----------|
| `zoneId` | required | ZoneId ID | `'unique-zone-id'` | `string` |
| `domain` | optional | Domain | `'example.org'` | `string` |
| `minCPM` | optional | Minimum CPM | `1.5` | `float` |
| `maxCPM` | optional | Maximum CPM | `10.8` | `float` |
