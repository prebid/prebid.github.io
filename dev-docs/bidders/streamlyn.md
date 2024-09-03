---
layout: bidder
title: Streamlyn
description: Streamlyn Bidder Adaptor
biddercode: streamlyn
pbjs: false
pbs: true
media_types: video, banner, audio, native
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

| Name          | Scope    | Description                                       | Example         | Type      |
|:--------------|:---------|:--------------------------------------------------|:----------------|:----------|
| `host`        | required | Ad network's RTB host                             | `'rtba.bidsxchange.com'` | `string`  |
| `publisherId` | required | Publisher ID                                      | `'12345'`       | `string`  |
| `custom1`     | optional | Custom targeting field 1                          | `'custom1'`     | `string`  |
| `custom2`     | optional | Custom targeting field 2                          | `'custom2'`     | `string`  |
| `custom3`     | optional | Custom targeting field 3                          | `'custom3'`     | `string`  |
| `custom4`     | optional | Custom targeting field 4                          | `'custom4'`     | `string`  |
| `custom5`     | optional | Custom targeting field 5                          | `'custom5'`     | `string`  |

Streamlyn server-side Prebid Server adapter requires only `publisherId` and `host` parameters.

Streamlyn server-side Prebid Server adapter supports only `banner`, `video`, `audio`, `native` media types.
