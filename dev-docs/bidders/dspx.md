---
layout: bidder
title: Dspx
description: Prebid Dspx Bidder Adaptor
hide: true
biddercode: dspx
biddercode_longer_than_12: false
media_types: banner
gdpr_supported: false
---


### bid params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                                                | Example                | Type            |
|---------------|----------|----------------------------------------------------------------------------|------------------------|-----------------|
| `placement`   | required | Placement ID from dspx.                                                    | `'101'`                  | `string`        |
| `pfilter`     | optional | Selection filter. See [here](https://github.com/prebid/Prebid.js/blob/master/modules/dspxBidAdapter.md) for more details.                            | `{"floorprice": 1000000}`| `object`        |
| `bcat`        | optional | List of  Blocked Categories (IAB) - comma separated.                       | `'IAB2,IAB4'`            | `string`        |
| `dvt`         | optional | DeVice Type of `[desktop,smartphone,tv,tablet]` (autodetect if not exists). | `'desktop'`              | `string`        |
