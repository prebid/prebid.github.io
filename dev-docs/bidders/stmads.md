---
layout: bidder
title: StreamAds
description: Prebid StreamAds Bidder Adapter
biddercode: stmads
gpp_sids: usstate_all
tcfeu_supported: false
usp_supported: true
coppa_supported: true
schain_supported: true
deals_supported: false
floors_supported: true
fpd_supported: false
ortb_blocking_supported: false
media_types: banner, video, native
multiformat_supported: will-bid-on-one
userIds: all
pbjs: true
pbs: false
pbs_app_supported: false
safeframes_ok: true
sidebarType: 1
---

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example                         | Type       |
|---------------|----------|--------------|---------------------------------|------------|
| `placementId` | optional | Placement Id | `'0'`                           | `'string'` |
| `endpointId`  | optional | Endpoint Id  | `'0'`                           | `'string'` |
| `mediaType` | required for multiformat in Prebid.js | Format to request: `banner`, `video`, or `native` | `'video'` | `'string'` |

## Media Type Selection

For Prebid.js, set `params.mediaType` to `banner`, `video`, or `native` when the
ad unit offers multiple supported formats. Only the selected format is requested.
The parameter is optional for single-format ad units. Bids are rejected if a
multiformat ad unit has no selection or the selected format is absent from `mediaTypes`.

Example: `{ placementId: 'testVideo', mediaType: 'video' }`.
This parameter applies only to Prebid.js.

## Note

For the prebid server and prebid.js you only need to use one parameter: either placementId or endpointId
