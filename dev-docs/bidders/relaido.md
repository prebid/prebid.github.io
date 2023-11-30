---
layout: bidder
title: Relaido
description: Prebid Relaido Bidder Adapter
biddercode: relaido
userIds: imuid
pbjs: true
media_types: banner, video
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `placementId` | required | Relaido placement id  | `1234567` | `string`  |
| `video.playerSize` | optional | Video Player SizeThis field is mandatory if mediaTypes.video.playerSize is undefined. | `[1, 1]` or `[300, 250] over` | `array of number` |
