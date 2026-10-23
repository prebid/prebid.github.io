---
layout: bidder
title: Chartboost
description: Prebid Chartboost Bidder Adapter
biddercode: chartboost
tcfeu_supported: true
gvl_id: 1601
usp_supported: true
coppa_supported: true
gpp_sids: tcfeu, usp
schain_supported: true
dchain_supported: false
media_types: banner, video
deals_supported: false
floors_supported: true
fpd_supported: false
pbjs: false
pbs: true
pbs_app_supported: true
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: partial
sidebarType: 1
---

## Prebid Server Note

The Chartboost adapter requires setup before beginning. Please contact us at <in-app-bidding@chartboost.com>.

Bids are rendered by the Chartboost SDK through its Prebid Mobile plugin renderer.

## Bid Params

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description                                             | Example                      | Type     |
|-----------------|----------|---------------------------------------------------------|------------------------------|----------|
| `app_id`        | required | Chartboost app ID, as shown in the Chartboost dashboard | `"5a4b1c2d3e4f5a6b7c8d9e0f"` | `string` |
| `location_name` | required | Name of the Chartboost ad location                      | `"default-banner"`           | `string` |
