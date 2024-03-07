---
layout: bidder
title: felixads
description: Prebid felixads Bidder Adaptor
biddercode: felixads
pbjs: true
pbs: false
media_types: banner, native, video
gvl_id: 14 (adkernel)
tcfeu_supported: true
gpp_supported: true
usp_supported: true
coppa_supported: true
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

The felixads Bidding adaptor requires setup and approval before beginning. Please reach out to <ops@felixads.com> for more details

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example                   | Type     |
|----------|----------|-----------------------|---------------------------|----------|
| `host`   | required | felixads's RTB host   | `'cpm.felixads.com'`      | `string` |
| `zoneId` | required | RTB zone id           | `'30164'`                 | `integer` |
