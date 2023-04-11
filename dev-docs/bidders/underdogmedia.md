---
layout: bidder
title: Underdog Media
description: Prebid Underdog Media Bidder Adapter
pbjs: true
biddercode: underdogmedia
gdpr_supported: true
usp_supported: true
userIds: 33acrossId, pubCommonId, unifiedId
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description | Example | Type     |
|----------|----------|-------------|---------|----------|
| `siteId` | required |             |         | `string` |
| `productId` | optional | UDM Product ID `'standard'` or `'sticky'`, defaults to `'standard'` | `'standard'`   | `string` |