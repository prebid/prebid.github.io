---
layout: bidder
title: MobileFuse
description: Prebid MobileFuse Bidder Adapter
biddercode: mobilefuse
tcfeu_supported: false
dsa_supported: false
gvl_id: 909
usp_supported: true
coppa_supported: true
gpp_sids: tcfca, usnat, usstate_all, usp
schain_supported: true
dchain_supported: false
userIds: all
media_types: banner, video, native
deals_supported: true
floors_supported: true
fpd_supported: false
pbjs: false
pbs: true
pbs_app_supported: true
prebid_member: true
multiformat_supported: will-bid-on-any
ortb_blocking_supported: true
privacy_sandbox: no
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                                                | Example | Type    |
| ------------ | -------- | ---------------------------------------------------------- | ------- | ------- |
| placement_id | required | An ID which identifies this specific inventory placement   | 1111    | integer |
| pub_id       | required | An ID which identifies the publisher selling the inventory | 2222    | integer |
