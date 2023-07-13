---
layout: bidder
title: eRGADX
description: eRGADX Bidder Adaptor
biddercode: ergadx
pbjs: true
pbs: true
media_types: banner, native, video
gvl_id: 14
gdpr_supported: true
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

The eRGADX bidding adapter requires setup and approval before implementation. Please reach out to <prashant.musale@erelego.com> for more details.

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example                   | Type     |
|----------|----------|-----------------------|---------------------------|----------|
| `host`   | required | RTB host | `'cpm.ergadx.com'` | `string` |
| `zoneId` | required | Zone Id           | 30164                 | `integer` |
