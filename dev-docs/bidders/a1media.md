---
layout: bidder
title: A1Media
description: Prebid A1Media Bidder Adapter
biddercode: a1media
tcfeu_supported: false
gvl_id: none
usp_supported: false
coppa_supported: false
gpp_supported: false
schain_supported: true
dchain_supported: false
media_types: banner, video, native
safeframes_ok: false
deals_supported: false
floors_supported: true
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: partial
sidebarType: 1
---

### Note

The A1Media Bidding adapter requires setup before beginning. Please contact us at <dev@a1mediagroup.co.kr>.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                | Example                             | Type     |
|---------------|----------|--------------------------------------------|-------------------------------------|----------|
| `bidfloor`    | optional | Bid Floor Price, It is used if the Floor Module is not available | `0.9`                               | `float`  |
| `currency`    | optional | Currency For Bid and Bid Floor, It is used if the Currency Module is not available             | `'JPY'`                             | `string` |
| `bcat`        | optional | Blocked advertiser categories using the IAB content categories   | `['IAB1-1']` | `string array` |
| `battr`       | optional | Blocked creative attributes                                      | `[ 13 ]` | `integer array` |
