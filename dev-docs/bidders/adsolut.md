---
layout: bidder
title: adsolut
description: Prebid adsolut Bidder Adaptor
biddercode: adsolut
pbjs: true
pbs: false
media_types: banner, native, video
gvl_id: 14 (adkernel)
tcfeu_supported: true
usp_supported: true
coppa_supported: true
gpp_supported: true
pbs_app_supported: true
schain_supported: true
userIds: all
fpd_supported: true
prebid_member: false
ortb_blocking_supported: true
multiformat_supported: will-bid-on-one
floors_supported: true
aliasCode: adkernel
sidebarType: 1
---

### Note

The adsolut Bidding adaptor requires setup and approval before beginning. Please reach out to <kush@adsolut.in> for more details

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example                   | Type     |
|----------|----------|-----------------------|---------------------------|----------|
| `host`   | required | Ad network's RTB host | `'cpm.adsolut.in'` | `string` |
| `zoneId` | required | RTB zone id           | `30164`                 | `integer` |
