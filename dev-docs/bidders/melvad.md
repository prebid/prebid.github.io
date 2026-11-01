---
layout: bidder
title: Melvad
description: Prebid Melvad Bidder Adapter
biddercode: melvad
tcfeu_supported: false
usp_supported: false
coppa_supported: false
gpp_supported: false
schain_supported: false
dchain_supported: false
userId:
media_types: banner, video, native
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: true
pbjs: false
pbs: true
pbs_app_supported: true
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: true
sidebarType: 1
---

## Registration

The Melvad bidding adapter requires setup before beginning. Please contact us at <support@melvad.com> to get your `sspId`.

## Bid Params

{: .table .table-bordered .table-striped }
| Name    | Scope    | Description                      | Example    | Type     |
|---------|----------|----------------------------------|------------|----------|
| `sspId` | required | SSP identifier issued by Melvad  | `'prebid'` | `string` |
