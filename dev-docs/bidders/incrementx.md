---
layout: bidder
title: IncrementX
description: Prebid IncrementX Bidder Adaptor
pbjs: true
biddercode: incrementx
media_types: banner
gdpr_supported: true
multiformat_supported: will-bid-on-one
sidebarType: 1
---

### Note

The IncrementX adapter currently doesn't support multiple sizes per ad placement and will favour the first one if multiple sizes exists.

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description              | Example         | Type     |
|-------------|----------|--------------------------|-----------------|----------|
| placementId | required | incrementx placement id  | `'IX-HB-123'`  | `string` |
