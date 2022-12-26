---
layout: bidder
title: Aardvark
description: Prebid Aardvark Bidder Adaptor
pbjs: true
biddercode: aardvark
gdpr_supported: true
usp_supported: true
schain_supported: true
userIds: unifiedId
gvl_id: 52
enable_download: false
pbjs_version_notes: not ported to 5.x
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope    | Description        | Example  | Type     |
|------|----------|--------------------|----------|----------|
| `ai` | required | The rtk auction ID | `'XBC1'` | `string` |
| `sc` | required | The rtk shortcode  | `'AF2g'` | `string` |
| `categories` | optional | Deal ID Categories  | `['news','sports']` | `array` |
