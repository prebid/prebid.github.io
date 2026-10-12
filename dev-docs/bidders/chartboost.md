---
layout: bidder
title: Chartboost
description: Prebid Chartboost Bidder Adapter
biddercode: chartboost
tcfeu_supported: true
gvl_id: 1601
usp_supported: true
coppa_supported: true
gpp_sids: tcfeu, tcfca, usnat, usstate_all, usp
schain_supported: true
dchain_supported: false
media_types: banner, video, native
deals_supported: true
floors_supported: true
fpd_supported: true
pbjs: false
pbs: true
pbs_app_supported: true
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: false
sidebarType: 1
---

## Prebid Server Note

The Chartboost adapter requires setup before beginning. Please contact us at <support@chartboost.com>.

The adapter forwards the OpenRTB 2.6 request to Chartboost unchanged, so standard OpenRTB fields such as `imp.bidfloor`, `regs`, `source.schain` and first-party data are passed through as-is.

## Bid Params

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description                                             | Example                      | Type     |
|-----------------|----------|---------------------------------------------------------|------------------------------|----------|
| `app_id`        | required | Chartboost app ID, as shown in the Chartboost dashboard | `"5a4b1c2d3e4f5a6b7c8d9e0f"` | `string` |
| `location_name` | required | Name of the Chartboost ad location                      | `"default-banner"`           | `string` |
