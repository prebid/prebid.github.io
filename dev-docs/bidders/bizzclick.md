---
layout: bidder
title: BizzClick
description: Prebid BizzClick Bidder Adaptor
biddercode: bizzclick
gdpr_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
media_types: banner, video, native
safeframes_ok: true
deals_supported: true
pbjs: true
pbs: true
sidebarType: 1
---

### Note:

The Example Bidding adapter requires setup before beginning. Please contact us at support@bizzclick.com .BizzClick will only respond to the first impression and that multiple ad formats of that single impression are not supported.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `placementId`      | required | placement id | `'hash'`    | `string` |
| `accountId`      | required | account id | `'bizzclickTest'`    | `string` |
