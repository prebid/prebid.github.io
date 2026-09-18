---
layout: bidder
title: intenze
description: Prebid Intenze Bidder Adaptor
biddercode: intenze
tcfeu_supported: false
usp_supported: true
coppa_supported: true
ccpa_supported: true
schain_supported: true
media_types: banner, video, native
safeframes_ok: true
deals_supported: true
pbjs: true
pbs: true
sidebarType: 1
floors_supported: true
prebid_member: false
fpd_supported: false
gvl_id: none
multiformat_supported: will-bid-on-one
ortb_blocking_supported: true
userIds: all
---

### Note

Intenze will bid only on first impresion in bid request.
The Example Bidding adapter requires setup before beginning. Please contact us at <connect@intenze.co>

### Prebid.js Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|---------------|----------|-----------------------|-----------|-----------|
| `accountId` | optional | account id, only for exchange integration | `'hash'` | `string` |
| `placementId` | optional | ssp placement id, only for ssp integration | `'hash'` | `string` |

### Prebid Server Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|---------------|----------|-----------------------|-----------|-----------|
| `accountId` | optional | account id, only for exchange integration | `'hash'` | `string` |
| `placementId` | optional | ssp placement id, only for ssp integration | `'hash'` | `string` |
| `region` | optional | optional target region, for ssp and exchnage integrations | `'us-east'`(default), `'eu'`, `'apac'`| `string` |
