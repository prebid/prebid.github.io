---
layout: bidder
title: Redmob
description: Prebid Redmob Bidder Adapter
biddercode: redmob
tcfeu_supported: true
gvl_id: 1461
usp_supported: true
coppa_supported: true
dsa_supported: false
gpp_sids: tcfeu, tcfca, usnat, usstate_all, usp
schain_supported: true
dchain_supported: false
media_types: banner, video
safeframes_ok: false
deals_supported: false
floors_supported: true
fpd_supported: true
pbjs: false
pbs: true
pbs_app_supported: true
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: true
privacy_sandbox: no
sidebarType: 1
userIds: all
---

## Note

The Redmob bidding adapter requires setup before beginning. Please contact us at [prebid@redmob.io](mailto:prebid@redmob.io) to obtain a supply partner ID.

## Bid Params

{: .table .table-bordered .table-striped }

| Name              | Scope    | Description                                            | Example | Type      |
| ----------------- | -------- | ------------------------------------------------------ | ------- | --------- |
| `supplyPartnerId` | required | Your Redmob supply partner ID, provided at onboarding. | `2101`  | `integer` |
