---
layout: bidder
title: Trafficroots
description: Prebid Trafficroots Bidder Adapter
pbjs: true
biddercode: trafficroots
gdpr_supported: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                | Example                                     | Type     |
|---------------|----------|--------------------------------------------|---------------------------------------------|----------|
| `zoneId`      | required | The Trafficroots zone ID                   | `'aa0444af31'`                              | `string` |
| `deliveryUrl` | optional | The bid endpoint (might be used for debug) | `'https://service.trafficroots.com/prebid'` | `string` |
