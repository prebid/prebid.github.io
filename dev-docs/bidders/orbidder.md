---
layout: bidder
title: Orbidder
description: Prebid Orbidder Bidder Adaptor
biddercode: orbidder
biddercode_longer_than_12: false
hide: true
media_types: banner
gdpr_supported: true
---

### bid params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description | Example            | Type     |
|---------------|----------|-------------|--------------------|----------|
| `accountId`   | required |             | "someAccount"        | `string` |
| `placementId` | required |             | "somePlacement"      | `string` |
| `keyValues`   | optional |             | { "key": "value" } | `object` |
