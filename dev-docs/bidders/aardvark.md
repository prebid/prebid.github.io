---
layout: bidder
title: Aardvark
description: Prebid Aardvark Bidder Adaptor
hide: true
biddercode: aardvark
gdpr_supported: true
usp_supported: true
schain_supported: true
userIds: unifiedId/tradedesk
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope    | Description        | Example  | Type     |
|------|----------|--------------------|----------|----------|
| `ai` | required | The rtk auction ID | `'XBC1'` | `string` |
| `sc` | required | The rtk shortcode  | `'AF2g'` | `string` |
| `categories` | optional | Deal ID Categories  | `['news','sports']` | `array` |
