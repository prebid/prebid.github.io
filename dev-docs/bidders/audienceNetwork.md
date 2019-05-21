---
layout: bidder
title: Audience Network
description: Prebid Audience Network Bidder Adaptor
hide: true
biddercode: audienceNetwork
media_types: native, video
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                     | Example                              | Type     |
|---------------|----------|-------------------------------------------------|--------------------------------------|----------|
| `placementId` | required | The Placement ID from Audience Network          | `'555555555555555\_555555555555555'` | `string` |
| `format`      | optional | Format, one of "native", "fullwidth" or "video" | `'native'`                           | `string` |
