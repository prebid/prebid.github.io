---
layout: bidder
title: LunamediaHB
description: LunamediaHB Bidder Adapter
biddercode: lunamediahb
usp_supported: true
schain_supported: true
gvl_id: 998
tcfeu_supported: true
coppa_supported: true
media_types: banner, video, native
floors_supported: true
fpd_supported: true
userIds: all
pbjs: true
pbs: false
multiformat_supported: will-bid-on-any
sidebarType: 1
---

## Note

The LunamediaHB bidder adapter is maintained by Ferio and requires setup before beginning. Please contact <prebid@ferio.cloud> for more information.

### Prebid.js Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| --------------- | ---------- | ------------------------------------ | ----------------------------------- | ---------- |
| `publisherId` | required | Publisher ID on the LunamediaHB platform. | `'publisher-123'` | `string` |
| `adUnitId` | required | Ad unit ID on the LunamediaHB platform. | `'ad-unit-456'` | `string` |
| `tenantId` | required | Tenant ID on the LunamediaHB platform. | `'tenant-789'` | `string` |
