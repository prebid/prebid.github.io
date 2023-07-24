---
layout: bidder
title: AdPluto DSP
description: AdPluto DSP Bidder Adaptor
biddercode: adpluto_dsp
pbjs: true
pbs: false
media_types: banner, native, video
gdpr_supported: true
gpp_supported: true
usp_supported: true
coppa_supported: true
pbs_app_supported: false
schain_supported: true
userIds: all
fpd_supported: true
prebid_member: false
ortb_blocking_supported: true
multiformat_supported: will-bid-on-one
floors_supported: true
aliasCode: adkernelAdn
sidebarType: 1
---

### Note

The AdPluto DSP bidding adapter requires setup and approval before implementation. Please reach out to <support@adpluto.com> for more details.

### Bid Params

{: .table .table-bordered .table-striped }
| Name    | Scope    | Description     | Example              | Type      |
|---------|----------|-----------------|----------------------|-----------|
| `host`  | optional | Ad network host | `'rtb2-useast.adpluto.com'` | `string`  |
| `pubId` | required | Publisher Id    | `102`                | `integer` |
