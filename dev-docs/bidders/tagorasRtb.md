---
layout: bidder
title: TagorasRTB
description: Prebid TagorasRTB Adaptor
biddercode: tagorasrtb
pbjs: false
pbs: true
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

The TagorasRTB adapter requires setup before beginning.

## Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description           | Example               | Type      |
|:--------------|:---------|:----------------------|:----------------------|:----------|
| `host`        | required | Ad network's RTB host | `'rtb-tagoras.io'`    | `string`  |
| `publisherId` | required | Publisher ID          | `12345`               | `integer` |

Prebid TagorasRTB server-side Prebid Server adapter requires only `publisherId` and `host` parameters.

Prebid TagorasRTB server-side Prebid Server adapter supports only `banner`, `video`, `audio`, `native` media types. 
