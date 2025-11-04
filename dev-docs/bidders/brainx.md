---
layout: bidder
title: brainx
description: Prebid brainx Bidder Adapter
biddercode: brainx
tcfeu_supported: false
dsa_supported: false
gvl_id: none
usp_supported: false
coppa_supported: false
gpp_sids: none
schain_supported: true
dchain_supported: false
media_types: banner
safeframes_ok: false
deals_supported: true
floors_supported: true
fpd_supported: false
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: true
sidebarType: 1
---

### Registration

If you have any questions regarding set up, please reach out to your account manager or <brainx.official@tec-do.com>.

### Bid Parameters

{: .table .table-bordered .table-striped }
| Name       | Scope        | Description                          | Example                                | Type     |
| ---------- | ------------ | ------------------------------------ | -------------------------------------- | -------- |
| `pubId`    | required     | Placement Id                         | `F7B53DBC-85C1-4685-9A06-9CF4B6261FA3` | `string` |
| `endpoint` | Not required | The endpoint provided by Brainx Url. | `https://dsp.brainx.tech/bid`          | `string` |
