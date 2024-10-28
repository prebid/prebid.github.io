---
layout: bidder
title: AdsYield
description: Prebid AdsYield Bidder Adaptor
biddercode: adsyield
pbjs: true
pbs: true
media_types: video, banner
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

### Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                        | Example               | Type      |
|---------------|----------|----------------------------------------------------|-----------------------|-----------|
| `host`        | required | Ad network's RTB host                              | `'open-adsyield.com'` | `string`  |
| `adUnitId`    | required | Ad Unit Id will be generated on AdsYield Platform. | `42`                  | `integer` |
| `adUnitType`  | required | Type of Ad Unit (`'video'`, `'banner'`)            | `'banner'`            | `string`  |
| `publisherId` | required | Publisher ID                                       | `12345`               | `integer` |
| `custom1`     | optional | Custom targeting field 1                           | `'custom1'`           | `string`  |
| `custom2`     | optional | Custom targeting field 2                           | `'custom2'`           | `string`  |
| `custom3`     | optional | Custom targeting field 3                           | `'custom3'`           | `string`  |
| `custom4`     | optional | Custom targeting field 4                           | `'custom4'`           | `string`  |
| `custom5`     | optional | Custom targeting field 5                           | `'custom5'`           | `string`  |

Adsyield server-side Prebid Server adapter requires only `publisherId` and `host` parameters. But Adsyield client-side Prebid.js adapter requires only `host`, `adUnitId`, `adUnitType`.

Adsyield server-side Prebid Server adapter supports only `banner`, `video`, `audio`, `native` media types. But Adsyield client-side Prebid.js adapter supports only `banner` and `video` media types, doesn't support `audio` and `native`.
