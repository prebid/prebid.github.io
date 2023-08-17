---
layout: bidder
title: Relay
description: Prebid Relay Bidder Adapter
biddercode: relay
media_types: banner, video, native
pbjs: true
pbs: false
safeframes_ok: true
floors_supported: true
fpd_supported: true
multiformat_supported: will-bid-any
ortb_blocking_supported: partial
pbs_app_supported: true
gdpr_supported: false
usp_supported: false
coppa_supported: true
deals_supported: true
schain_supported: true
dchain_supported: false
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type       |
|---------------|----------|-----------------------|-----------|------------|
| `accountId`   | required | Relay Account Id      | `9778`    | `'number'` |

### Note

The Relay Bid Adapter makes requests to the Relay Exchange API which supports OpenRTB.

Therefore the only bid param required is the the `accountId`, all Prebid Ad Unit fields will be automatically inferred via Prebid's ORTB Converter. If any field on the request requires customization it is configurable using [First Party Data - Prebid.js](https://docs.prebid.org/features/firstPartyData.html#supplying-adunit-specific-data) via `ortb2` interface.
