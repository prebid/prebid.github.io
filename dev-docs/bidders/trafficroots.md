---
layout: bidder
title: Trafficroots
description: Prebid Trafficroots Bidder Adapter
hide: true
biddercode: trafficroots
biddercode_longer_than_12: false
gdpr_supported: true
---

### bid params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                | Example                                     | Type     |
|---------------|----------|--------------------------------------------|---------------------------------------------|----------|
| `zoneId`      | required | The Trafficroots zone ID                   | `'aa0444af31'`                              | `string` |
| `deliveryUrl` | optional | The bid endpoint (might be used for debug) | `'https://service.trafficroots.com/prebid'` | `string` |
