---
layout: bidder
title: Qortex
description: Qortex Bidder Adaptor
biddercode: qortex
pbjs: true
pbs: false
media_types: banner, native, video
gdpr_supported: true
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

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example                   | Type     |
|----------|----------|-----------------------|---------------------------|----------|
| `host`   | required | RTB host              | `'cpm.qortex.ai'`         | `string` |
| `zoneId` | required | Zone Id               | 76156                     | `integer`|
