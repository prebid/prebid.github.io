---
layout: bidder
title: adstir
description: Prebid adstir Bidder Adapter
pbjs: true
pbs: false
biddercode: adstir
media_types: banner
tcfeu_supported: false
gvl_id: none
usp_supported: false
coppa_supported: false
schain_supported: true
dchain_supported: false
safeframes_ok: false
deals_supported: true
floors_supported: true
fpd_supported: false
prebid_member: false
ortb_blocking_supported: true
sidebarType: 1
---

### Note

The adstir Bidding adapter is available from Prebid.js version 8.24.0 and above.

It requires setup before beginning. Please contact us at [sales@ad-stir.com](mailto:sales@ad-stir.com)

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope    | Description | Example  | Type     |
|-------|----------|---------------------------|----------|----------|
| `appId` | required | The AppID from adstir | `'TEST-MEDIA'` | `string` |
| `adSpaceNo` | required | The AdSpaceNo from adstir | `1` | `integer` |
