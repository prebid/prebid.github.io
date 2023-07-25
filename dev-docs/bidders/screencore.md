---
layout: bidder
title: Screencore
description: Prebid Screencore Bidder Adaptor
biddercode: screencore
gdpr_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
media_types: banner, video, native
safeframes_ok: true
deals_supported: true
pbs: true
sidebarType: 1
floors_supported: true
prebid_member: false
fpd_supported: false
gvl_id: none
multiformat_supported: will-bid-on-one
ortb_blocking_supported: true
userIds: all
---

### Note:

The Example Bidding adapter requires setup before beginning. Please contact us at connect@screencore.io.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|---------------|----------|-----------------------|-----------|-----------|
| `placementId` | required | placement id | `'hash'` | `string` |
| `accountId` | required | account id | `'id'` | `string` |
