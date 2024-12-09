---
layout: bidder
title: Audience Media
description: Prebid Audience Media Bidder Adaptor
biddercode: audiencemedia
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

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example                   | Type     |
|----------|----------|-----------------------|---------------------------|----------|
| `host`   | required | Ad network's RTB host | `'cpm.audience.media'` | `string` |
| `zoneId` | required | Zone ID           | `76156`                 | `integer` |
