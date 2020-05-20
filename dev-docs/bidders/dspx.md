---
layout: bidder
title: DSPx
description: Prebid DSPx Bidder Adapter
hide: true
biddercode: dspx
biddercode_longer_than_12: false
media_types: banner, video 
gdpr_supported: true
---

### Note:
The Dspx Bidder Adapter requires setup and approval from DSPx team. Please reach out to your account team or prebid@dspx.tv for more information.

### bid params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                                                | Example                | Type            |
|---------------|----------|----------------------------------------------------------------------------|------------------------|-----------------|
| `placement`   | required | Placement ID from dspx.                                                    | `'101'`                  | `string`        |
| `pfilter`     | optional | Selection filter. E.g. floorprice (min_cpm_micros)                            | `{"floorprice": 1000000}`| `object`        |
| `bcat`        | optional | List of  Blocked Categories (IAB) - comma separated.                       | `'IAB2,IAB4'`            | `string`        |


**Notice:** The creative type can be checked by the `type` property of `bidResponse` object. E.g.:
```js
bidsBackHandler: function(bids) {
    var contentType = bids[0].type // JS InSkin|JS Interscroller Type A|...;
}
```
