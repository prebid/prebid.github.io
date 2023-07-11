---
layout: bidder
title: Denakop
description: Denakop Bidder Adaptor
biddercode: denakop
pbjs: true
pbs: false
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

The Denakop bidding adapter requires setup and approval before implementation. Please reach out to <opec@denakop.com> for more details.

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example                   | Type     |
|----------|----------|-----------------------|---------------------------|----------|
| `host`   | required | Host Name | `'cpm.denakop.com'` | `string` |
| `zoneId` | required | Zone Id           | 30164                 | `integer` |
