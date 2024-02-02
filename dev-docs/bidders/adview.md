---
layout: bidder
title: AdView
description: Prebid AdView Bidder Adapter
biddercode: AdView
tcfeu_supported: true
gvl_id: 1022
usp_supported: true
coppa_supported: true
gpp_supported: true
schain_supported: true
dchain_supported: false
media_types: banner, video, native
floors_supported: true
bidder_supports_deals: true
pbjs: false
pbs: true
pbs_app_supported: true
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: true
---

### Note

The Example Bidding adapter requires setup before beginning. Please contact us at <partner@adview.com>

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example   | Type     |
|---------------|----------|--------------|-----------|----------|
| `placementId` | required | Placement ID | `'posid00001'` | `string` |
| `accountId` | required | Account ID | `'accountid01'` | `string` |
