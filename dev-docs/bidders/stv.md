---
layout: bidder
title: Stv
description: Prebid Stv Bidder Adaptor
hide: true
biddercode: stv
biddercode_longer_than_12: false
media_types: banner,video
gdpr_supported: false
---


### bid params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                                                | Example                | Type            |
|---------------|----------|----------------------------------------------------------------------------|------------------------|-----------------|
| `placement`   | required | Placement ID from stv.                                                    | `'prer0-0%3D4137'`                  | `string`        |
| `pfilter`     | optional | Selection filter. See [here](https://github.com/prebid/Prebid.js/blob/master/modules/stvBidAdapter.md) for more details.                            | {`min_duration:1`} | `object`
| `noskip`      | optional | Noklip flag: 0 - false, 1 - true | `1`  | `int`
