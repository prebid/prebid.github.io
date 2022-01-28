---
layout: bidder
title: EngageBDR
description: Prebid EngageBDR Bidder Adaptor
biddercode: ebdr
pbjs: true
media_types: video
---

### Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description           | Example         | Type     |
|-------------|----------|-----------------------|-----------------|----------|
| `zoneid`    | required | The EngageBDR Zone ID | `'99999'`       | `string` |
| `bidfloor`  | optional | Bid Floor Price       | `'1.00'`        | `string` |
| `IDFA`      | optional | IDFA ID               | `'xxx-xxxx'`    | `string` |
| `ADID`      | optional | ADID ID               | `'xxx-xxxx'`    | `string` |
| `latitude`  | optional | latitude              | `'34.089811'`   | `string` |
| `longitude` | optional | longitude             | `'-118.392805'` | `string` |
