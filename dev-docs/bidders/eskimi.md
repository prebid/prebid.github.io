---
layout: bidder
title: Eskimi
description: Prebid Eskimi Bidder Adapter
pbjs: true
pbs: false
biddercode: eskimi
media_types: banner, video
schain_supported: true
tcfeu_supported: true
usp_supported: true
coppa_supported: true
gpp_supported: true
deals_supported: false
floors_supported: true
safeframes_ok: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: true
fpd_supported: true
gvl_id: 814
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name              | Scope    | Description                     | Example                | Type      |
|-------------------|----------|---------------------------------|------------------------|-----------|
| `placementId`     | required | The placement ID from Eskimi.   | `612`                  | `integer` |
| `bcat`            | optional | ORTB blocked categories         | `['IAB-1-1']`          | `string[]`|
| `badv`            | optional | ORTB blocked advertiser domains | `['example.com']`      | `string[]`|
| `bapp`            | optional | ORTB blocked applications       | `['com.example.game']` | `string[]`|

Additionally `battr` ORTB blocking param may be set on `BANNER` and `VIDEO` media types to specify blocked creative
attributes.
