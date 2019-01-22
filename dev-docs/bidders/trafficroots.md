---
layout: bidder
title: Trafficroots
description: Prebid Trafficroots Bidder Adapter
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: trafficroots
biddercode_longer_than_12: false
prebid_1_0_supported : true
gdpr_supported: true
---

### bid params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                | Example                                     | Type     |
|---------------|----------|--------------------------------------------|---------------------------------------------|----------|
| `zoneId`      | required | The Trafficroots zone ID                   | `'aa0444af31'`                              | `string` |
| `deliveryUrl` | optional | The bid endpoint (might be used for debug) | `'https://service.trafficroots.com/prebid'` | `string` |
