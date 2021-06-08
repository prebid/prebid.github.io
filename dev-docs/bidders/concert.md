---
layout: bidder
title: Concert
description: Prebid Concert Bidder Adaptor
hide: true
pbjs: true
biddercode: concert
media_types: banner
gdpr_supported: true
usp_supported: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                         | Example          | Type     |
| ----------- | -------- | ----------------------------------- | ---------------- | -------- |
| `partnerId` | required | The partner id assigned by concert. | `'partner_name'` | `string` |
| `placementId` | optional | The placement id. | `1234567` | `integer` |
| `site` | optional | The site name. | `'site_name'` | `string` |
| `slot` | optional | The slot name. | `slot_name'` | `string` |
| `sizes` | optional | All sizes this ad unit accepts. | `[[1030, 590]]` | `array` |
