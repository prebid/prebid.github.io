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

The Chartboost adapter requires setup before beginning. Please contact us at <support@chartboost.com>.

## Prebid Mobile Integration

The adapter is intended for Prebid Mobile apps that have the Chartboost SDK plugin renderer installed. The renderer adds the Chartboost bidding token to the request in `ext.prebid.sdk.renderers`, and winning bids carry `ext.prebid.meta.rendererName` and `rendererVersion` so Prebid Mobile hands rendering to the Chartboost SDK. Requests without the renderer entry are still accepted, but bids are not rendered by Prebid Mobile's default renderers.

## Request Notes

- One impression per request. Additional impressions are ignored.
- Banner sizes are limited to 320x50, 300x250, 728x90 and 300x600. Any other size is reduced to the largest of these that fits, and a banner that fits none returns no bid.
- Video `w` and `h` are backfilled from `device.w` and `device.h` when missing, which is the case for Prebid Mobile interstitial and rewarded ad units. VAST 3 and 4 are always added to `video.protocols`.
- `imp.pmp` deals from the publisher are replaced by deals configured on the Chartboost side.

## Bid Params

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description                                             | Example                      | Type     |
|-----------------|----------|---------------------------------------------------------|------------------------------|----------|
| `app_id`        | required | Chartboost app ID, as shown in the Chartboost dashboard | `"5a4b1c2d3e4f5a6b7c8d9e0f"` | `string` |
| `location_name` | required | Name of the Chartboost ad location                      | `"default-banner"`           | `string` |
