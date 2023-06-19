---
layout: bidder
title: AdView
description: Prebid AdView Bidder Adapter
biddercode: AdView
gdpr_supported: true
gvl_id: 1022
usp_supported: true
coppa_supported: true
schain_supported: true
dchain_supported: false
userId: 
media_types: banner, video, native
safeframes_ok: true
bidder_supports_deals: true
pbjs: false
pbs: true
pbs_app_supported: true
prebid_member: false
sidebarType: 1
---

### Note

Currently adapter doesn’t support multi impression and can not perform impression splitting, so only the first impression will be delivered.

The Example Bidding adapter requires setup before beginning. Please contact us at <partner@adview.com>

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example   | Type     |
|---------------|----------|--------------|-----------|----------|
| `placementId` | required | Placement ID | `'posid00001'` | `string` |
| `accountId` | required | Account ID | `'accountid01'` | `string` |
