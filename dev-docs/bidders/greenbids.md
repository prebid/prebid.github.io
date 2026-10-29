---
layout: bidder
title: Greenbids
description: Prebid Greenbids Bidder Adapter
biddercode: greenbids
tcfeu_supported: false
dsa_supported: true
gvl_id: none
usp_supported: true
coppa_supported: false
gpp_sids: tcfca, usnat, usstate_all, usp
schain_supported: true
dchain_supported: true
media_types: banner, video
deals_supported: false
floors_supported: true
fpd_supported: true
pbjs: true
pbs: true
prebid_member: false
multiformat_supported: will-not-bid
ortb_blocking_supported: false
sidebarType: 1
---

### Note

The Greenbids Bidding adapter requires setup before beginning. Please contact us at [sales@greenbids.ai](mailto:sales@greenbids.ai).

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `placementId` | required | Placement id          | `'11111'` | `string`  |
