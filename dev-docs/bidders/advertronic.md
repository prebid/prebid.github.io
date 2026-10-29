---
layout: bidder
title: Advertronic
description: Prebid Advertronic Bidder Adapter
biddercode: advertronic
media_types: banner, video
multiformat_supported: will-bid-on-any
tcfeu_supported: false
usp_supported: false
coppa_supported: false
schain_supported: false
deals_supported: false
floors_supported: true
safeframes_ok: true
pbjs: true
pbs: false
sidebarType: 1
---

## Note

The Advertronic bid adapter connects to Advertronic SSP (Russian supply-side
platform). Both `publisherId` and `placementId` are issued during onboarding —
reach out to <info@advertronic.io>.

Bids are returned **net to the publisher** in **RUB**: enable the currency
module (or set `adServerCurrency: "RUB"`) if your ad server currency differs.

Video is supported for both contexts. For `outstream` the adapter supplies its
own renderer (loaded from Advertronic servers) unless the ad unit defines one.

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                              | Example          | Type     |
|---------------|----------|------------------------------------------|------------------|----------|
| `publisherId` | required | Publisher ID issued during onboarding    | `'42'`           | `string` |
| `placementId` | required | Placement token issued during onboarding | `'a1b2c3d4e5f6'` | `string` |
