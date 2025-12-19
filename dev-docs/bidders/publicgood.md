---
layout: bidder
title: Public Good
description: Public Gppd Bid Adapter
biddercode: publicgood
tcfeu_supported: false
dsa_supported: false
gvl_id: none
usp_supported: false
coppa_supported: false
gpp_sids: none
schain_supported: false
dchain_supported: false
userId: none
media_types: banner
safeframes_ok: true
deals_supported: false
floors_supported: false
fpd_supported: false
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: false
privacy_sandbox: no
sidebarType: 1
---

### Bid params

{: .table .table-bordered .table-striped }

| Name        | Scope    | Description                                                                                                  | Example                       | Type          |
|-------------|----------|--------------------------------------------------------------------------------------------------------------|-------------------------------|---------------|
| `partnerId` | required | Publisher ID                                                                                                 | `'prebid-test'`               | `string`      |
| `slotId`    | required | Slot ID = 'all' unless negotiated otherwise                                                                  | `'all'`                       | `string`      |
