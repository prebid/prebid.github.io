---
layout: bidder
title: Datafusion
description: Prebid Datafusion Adaptor
biddercode: datafusion
pbjs: true
pbs: false
media_types: banner, video, audio, native
userIds: all
fpd_supported: false
tcfeu_supported: false
usp_supported: true
coppa_supported: true
schain_supported: true
prebid_member: false
ortb_blocking_supported: true
multiformat_supported: will-bid-on-one
floors_supported: false
aliasCode: limelightDigital
sidebarType: 1
---

## Note

The Datafusion adapter requires setup before beginning.

## Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description           | Example                  | Type      |
|:--------------|:---------|:----------------------|:-------------------------|:----------|
| `host`        | required | Ad network's RTB host | `'ssp-data-fusion.bid'`  | `string`  |
| `publisherId` | required | Publisher ID          | `12345`                  | `integer` |

Prebid Datafusion server-side Prebid Server adapter requires only `publisherId` and `host` parameters. But Prebid Datafusion client-side Prebid.js adapter requires only `host`, `adUnitId`, `adUnitType`.

Prebid Datafusion server-side Prebid Server adapter supports only `banner`, `video`, `audio`, `native` media types. But Prebid Datafusion client-side Prebid.js adapter supports only `banner` and `video` media types, doesn't support `audio` and `native`.
