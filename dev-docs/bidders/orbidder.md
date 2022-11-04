---
layout: bidder
title: Orbidder
description: Prebid Orbidder Bidder Adaptor
biddercode: orbidder
pbjs: true
pbs: true
media_types: banner
gdpr_supported: true
floors_supported: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description             | Example            | Type     |
|---------------|----------|-------------------------|--------------------|----------|
| `accountId`   | required | Orbidder Account ID     | "someAccount"      | `string` |
| `placementId` | required | Placement Id            | "somePlacement"    | `string` |
| `bidfloor`    | optional | Placement floor price   | 1.23               | `float`  |
| `keyValues`   | optional | Custom key/value object | { "key": "value" } | `object` |
