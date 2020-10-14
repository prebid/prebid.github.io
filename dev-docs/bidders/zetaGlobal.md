---
layout: bidder
title: Zeta Global
description: Zeta Global Prebid Bidder Adapter
pbjs: true
biddercode: zeta_global
bidder_supports_deals: false
media_types: banner
gdpr_supported: true
tcf2_supported: true
gvl_id: 469
---

### Registration

To use this bidder you will need a valid definerId.  For further information, please contact jzirbel@disqus.com.

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                         | Example | Type      |
|-------------|----------|---------------------------------------------------------------------------------------------------------------------|---------|-----------|
| `definerId` | required | The Definer ID from Zeta Global                                                                                     | `12345` | `string`  |
| `test`      | optional | Flag which will induce a sample bid response when true; only set to true for testing purposes (1 = true, 0 = false) | `1`     | `integer` |
