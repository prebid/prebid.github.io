---
layout: bidder
title: VDO.AI
description: Prebid vdo.ai Bidder Adaptor
biddercode: vdoai
pbjs: true
pbs: true
media_types: video, banner
userIds: all
fpd_supported: false
tcfeu_supported: true
usp_supported: true
gvl_id: 1561
coppa_supported: true
schain_supported: true
prebid_member: false
ortb_blocking_supported: true
multiformat_supported: will-bid-on-one
floors_supported: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                      | Example               | Type               |
| :------------ | :------- | :----------------------------------------------- | :-------------------- | :----------------- |
| `host`        | required | Ad network's RTB host                            | `'exchange.ortb.net'` | `string`           |
| `adUnitId`    | required | Ad Unit Id will be generated on VDO.AI Platform. | `123456`              | `integer / string` |
| `publisherId` | required | publisherId will be generated on VDO.AI Platform | `'pub-abc'`           | `string`           |
| `adUnitType`  | required | Type of Ad Unit (`'video'`, `'banner'`)          | `'banner'`            | `string`           |
| `custom1`     | optional | Custom targeting field 1                         | `'custom1'`           | `string`           |
| `custom2`     | optional | Custom targeting field 2                         | `'custom2'`           | `string`           |
| `custom3`     | optional | Custom targeting field 3                         | `'custom3'`           | `string`           |
| `custom4`     | optional | Custom targeting field 4                         | `'custom4'`           | `string`           |
| `custom5`     | optional | Custom targeting field 5                         | `'custom5'`           | `string`           |
| `bidfloor`    | optional | Minimum bid floor price in USD                   | `1.5`                 | `float`            |

VDO.AI client-side Prebid.js adapter requires only `host`, `publisherId`, `adUnitId`, `adUnitType`.

VDO.AI server-side Prebid Server adapter requires `host`, `publisherId`, `adUnitId`, `adUnitType`.

Both VDO.AI client-side Prebid.js and server-side Prebid Server adapters support only `banner` and `video` media types, and do not support `audio` or `native`.
