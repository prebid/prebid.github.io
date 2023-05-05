---
layout: bidder
title: Motorik
description: Prebid Motorik Bidder Adaptor
biddercode: motorik
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

The Example Bidding adapter requires setup before beginning. Please contact us at support@motorik.io.
Motorik will only respond to the first impression. Multiple ad formats in single request are not supported.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `placementId`      | required | placement id | `'a7402708185f6a0c00700fd21c4260d2'`    | `string` |
| `accountId`      | required | account id | `'motorikTest'`    | `string` |
