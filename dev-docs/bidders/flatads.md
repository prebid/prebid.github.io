---
layout: bidder
title: flatads
description: Prebid Flatads Bidder Adapter
biddercode: flatads
tcfeu_supported: true
usp_supported: true
coppa_supported: true
gpp_sids: tcfeu, tcfca, usnat, usstate_all, usp
userIds: all
schain_supported: true
dchain_supported: true
media_types: banner, video, native
safeframes_ok: false
deals_supported: true
floors_supported: true
pbjs: false
pbs: true
pbs_app_supported: true
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: true
sidebarType: 1
---

### Registration

Flatads header bidding adapter connects with Flatads demand sources to fetch bids for banner publisher ID. Please reach
out to your account manager or <adxbusiness@flat-ads.com> for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|---------------|----------|--------------|-----------|----------|
| `publisherId` | required | The publisher ID from Flatads | "1111" | string |
| `token` | required | Token of the publisher | "66668888" | string |
