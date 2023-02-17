---
layout: bidder
title: DisplayioAds
description: DisplayioAds Bidder Adaptor
biddercode: displayioads
pbjs: true
pbs: false
media_types: banner, native, video
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

### Note:

The DisplayioAds bidding adapter requires setup and approval before implementation. Please reach out to <elena@display.io> for more details.

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example                   | Type     |
|----------|----------|-----------------------|---------------------------|----------|
| `host`   | required | RTB host | `'cpm.displayio.cloud'` | `string` |
| `zoneId` | required | Zone Id           | 30164                 | `integer` |
