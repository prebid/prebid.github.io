---
layout: bidder
title: Emoteev
description: Prebid Emoteev Bidder Adaptor
pbjs: true
biddercode: emoteev
gdpr_supported: true
userIds: pubCommonId
pbjs_version_notes: not in 5.x
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                                                              | Example        | Type    |
|--------------|----------|--------------------------------------------------------------------------|----------------|---------|
| `adSpaceId`  | required | Provided by Emoteev team                                                 | `5084`         | Integer |
| `context`    | required | One of `'in-content'`, `'footer'`, `'overlay'`, `'wallpaper'`            | `'in-content'` | String  |
| `externalId` | optional | Use it when you want to link your bids to some specific id on your side. | `12`           | Integer |
