---
layout: bidder
title: Clickonometrics
description: Prebid Clickonometrics Bidder Adapter
pbjs: true
pbs: true
biddercode: ccx
media_types: banner, video
gvl_id: 773
gdpr_supported: true
sidebarType: 1
---


### Bid Params

#### Common params (banner, video)

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                  | Example | Type      |
|---------------|----------|------------------------------|---------|-----------|
| `placementId` | required | Clickonometrics placement ID | `12345` | `integer` |

#### Video params

{: .table .table-bordered .table-striped }
| Name                   | Scope    | Description               | Example                        | Type             |
|------------------------|----------|---------------------------|--------------------------------|------------------|
| `video.playbackmethod` | optional | See OpenRTB docs for info | `[1, 2, 3, 4]`                 | `Array<integer>` |
| `video.protocols`      | optional | See OpenRTB docs for info | `[2, 3, 5, 6]`                 | `Array<integer>` |
| `video.mimes`          | optional | See OpenRTB docs for info | `['video/mp4', 'video/x-flv']` | `Array<string>`  |
| `video.skip`           | optional | See OpenRTB docs for info | `1`                            | `integer`        |
| `video.skipafter`      | optional | See OpenRTB docs for info | `5`                            | `integer`        |
