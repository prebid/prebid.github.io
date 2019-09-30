---
layout: bidder
title: Stv
description: Prebid Stv Bidder Adaptor
hide: true
biddercode: stv
media_types: banner,video
gdpr_supported: false
---


### Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                                                | Example                | Type            |
|---------------|----------|----------------------------------------------------------------------------|------------------------|-----------------|
| `placement`   | required | Placement ID from stv.                                                    | `'prer0-0%3D4137'`                  | `string`        |
| `pfilter`     | optional | Selection filter. See [here](https://github.com/prebid/Prebid.js/blob/master/modules/stvBidAdapter.md) for more details.                            | {`min_duration:1`} | `object` |
| `noskip`      | optional | No skip flag: 0 - false, 1 - true | `1`  | `integer` |
