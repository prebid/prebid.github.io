---
layout: bidder
title: E-volution tech
description: Prebid E-volution tech Bidder Adapter
biddercode: e_volution
gpp_sids: usstate_all
tcfeu_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
deals_supported: false
floors_supported: true
fpd_supported: false
ortb_blocking_supported: false
media_types: banner, video, native
gvl_id: 957
multiformat_supported: will-bid-on-one
userIds: all
pbjs: true
pbs: true
pbs_app_supported: true
safeframes_ok: true
sidebarType: 1
---

### Note

The E-volution Bidding adapter requires setup before beginning. Please contact us at <admin@e-volution.ai>

### Prebid.JS Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `placementId`      | required | E-volution tech placement id         | `'1234asdf'`    | `'string'` |

### Prebid Server Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `key`      | required | E-volution integration key         | `'cf64c93f277afdd928d8260653d7413d'`    | `'string'` |
