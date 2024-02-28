---
layout: bidder
title: Opsco
description: Prebid Opsco Bid Adapter
pbjs: true
biddercode: opsco
media_types: banner
tcfeu_supported: false
gvl_id: none
prebid_member: false
deals_supported: false
floors_supported: false
coppa_supported: false
fpd_supported: false
ortb_blocking_supported: false
gpp_sids: check with bidder
safeframes_ok: true
usp_supported: true
schain_supported: true
sidebarType: 1

---

### Integration Note

Opsco header bidding adapter connects with Opsco demand sources. Please reach out to <prebid@ops.co> for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description            | Example | Type     |
|------------|----------|------------------------|---------|----------|
| `placementId` | required | The Placement ID | `'123'` | `string` |
| `publisherId` | required | The Publisher ID | `'123'` | `string` |
| `siteId` | optional | The Site ID | `'123'` | `string` |
| `test` | optional | Whether the request is for testing only. | `true` | `boolean` |


