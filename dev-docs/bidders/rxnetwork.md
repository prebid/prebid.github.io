---
layout: bidder
title: RxNetwork
description: Prebid RxNetwork Bidder Adaptor
pbjs: true
pbs: false
biddercode: rxnetwork
aliasCode: adkernel
media_types: banner, native, video
tcfeu_supported: true
usp_supported: true
coppa_supported: true
gpp_supported: true
pbs_app_supported: false
gvl_id: 14 (adkernel)
schain_supported: true
userIds: all
fpd_supported: true
prebid_member: false
ortb_blocking_supported: true
multiformat_supported: will-bid-on-one
floors_supported: true
sidebarType: 1
---

### Note

The RxNetwork Bidding adaptor requires setup and approval before beginning. Please reach out to <bhirsch@rxnetwork.net> for more details

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example                   | Type     |
|----------|----------|-----------------------|---------------------------|----------|
| `host`   | required | Ad network's RTB host | `'cpm.rxnetwork.net'` | `string` |
| `zoneId` | required | RTB zone id           | `30164`                 | `integer` |
