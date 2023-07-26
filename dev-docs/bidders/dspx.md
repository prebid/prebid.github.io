---
layout: bidder
title: DSPx
description: Prebid DSPx Bidder Adapter
pbjs: true
biddercode: dspx
media_types: banner, video 
gdpr_supported: true
schain_supported: true
userIds: uid2, netId, id5Id, sharedId
multiformat_supported: will-bid-on-one
gvl_id: 602
sidebarType: 1
---

### Note

The DSPx bidder adapter requires setup and approval from the DSPx team. Please reach out to <prebid@dspx.tv> for more information and start using it.

### Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                                                | Example                | Type            |
|---------------|----------|----------------------------------------------------------------------------|------------------------|-----------------|
| `placement`   | required | Placement ID from dspx.                                                    | `'101'`                  | `string`        |
| `pfilter`     | optional | Custom filter parameters.                            | `{"customxy": 1000000}`| `object`        |
| `bcat`        | optional | List of  Blocked Categories (IAB) - comma separated.                       | `'IAB2,IAB4'`            | `string`        |

**Notice:** The creative type can be checked by the `type` property of `bidResponse` object. E.g.:

```js
bidsBackHandler: function(bids) {
    var contentType = bids[0].type
}
```
