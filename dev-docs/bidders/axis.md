---
layout: bidder
title: Axis
description: Prebid Axis Bidder Adapter
biddercode: axis
media_types: banner, video, native
pbjs: true
pbs: true
safeframes_ok: true
fpd_supported: false
multiformat_supported: will-not-bid
ortb_blocking_supported: partial
usp_supported: true
tcfeu_supported: true
coppa_supported: true
schain_supported: true
floors_supported: true
gvl_id: 1197
sidebarType: 1
---

### Overview

For more information go to [platform.axis-marketplace.com](https://platform.axis-marketplace.com]

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description        | Example    | Type       |
|---------------|----------|--------------------|------------|------------|
| `integration` | required | Integration        | `'000000'` | `'string'` |
| `token`       | required | Token              | `'000000'` | `'string'` |
| `iabCat`      | optional | (Prebid.js only) Array of IAB content categories that describe the content producer | `['IAB1-1', 'IAB3-1', 'IAB4-3']` | `Array(string)` |
