---
layout: bidder
title: Vertoz
description: Prebid Vertoz Bidder Adaptor
pbjs: true
biddercode: vertoz
---

### Note:

The Vertoz adapter currently doesn't support multiple sizes per ad placement and will favour the first one if multiple sizes exists.

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description         | Example       | Type     |
|-------------|----------|---------------------|---------------|----------|
| placementId | required | vertoz placement id | `'VH-HB-123'` | `string` |
| cpmFloor    | optional | cpm floor price     | `0.1`         | `float`  |
