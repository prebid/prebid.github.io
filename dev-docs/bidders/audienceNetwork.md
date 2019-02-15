---
layout: bidder
title: Audience Network
description: Prebid Audience Network Bidder Adaptor
hide: true
biddercode: audienceNetwork
biddercode_longer_than_12: true
media_types: native, video
---

#### send all bids ad server keys

(Truncated to 20 chars due to [DFP limit](https://support.google.com/dfp_premium/answer/1628457?hl=en#Key-values))

`hb_pb_audienceNetwor`
`hb_adid_audienceNetw`
`hb_size_audienceNetw`

### bid params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                     | Example                              | Type     |
|---------------|----------|-------------------------------------------------|--------------------------------------|----------|
| `placementId` | required | The Placement ID from Audience Network          | `'555555555555555\_555555555555555'` | `string` |
| `format`      | optional | Format, one of "native", "fullwidth" or "video" | `'native'`                           | `string` |
