---
layout: bidder
title: BCM
description: BCM Bid Adapter
biddercode: bcm
pbjs: true
pbs: false
media_types: banner, native, video
gdpr_supported: true
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

The BCM adapter requires approval and setup. Please reach out to <contact@bcm.ltd> or visit us at bcm.ltd for more details.

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example                   | Type     |
|----------|----------|-----------------------|---------------------------|----------|
| `host`   | required | Our Host  - Do Not Change   | `'serve.datacygnal.io'`   | `string` |
| `zoneId` | required | Example RTB zone id   |         `12345`         | `integer` |
