---
layout: bidder
title: Somo Audience
description: Somo Audience Bidder Adapter
pbjs: true
biddercode: somo
prevBiddercode: somoAudience
enable_download: false
pbjs_version_notes: not ported to 5.x
---

### Disclosure

This bidder sets `adId` on the bid response and hasn't responded to the Prebid.js team to confirm uniqueness
of this value. See [Issue 6381](https://github.com/prebid/Prebid.js/issues/6381).

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                            | Example                              | Type     |
|---------------|----------|----------------------------------------|--------------------------------------|----------|
| `placementId` | required | Placement ID provided by Somo Audience | `'22a58cfb0c9b656bff713d1236e930e8'` | `string` |
