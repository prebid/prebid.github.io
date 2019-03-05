---
layout: bidder
title: Clickonometrics
<<<<<<< HEAD
description: Prebid Clickonometrics Bidder Adaptor 
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: cxx
biddercode_longer_than_12: false
prebid_1_0_supported : true
=======
description: Prebid Clickonometrics Bidder Adaptor
hide: true
biddercode: cxx
biddercode_longer_than_12: false
>>>>>>> upstream/master
media_types: video
---


### bid params

#### Common params (banner, video)

<<<<<<< HEAD
| Name | Scope | Description | Example |
| :--- | :---- | :---------- | :------ |
| `placementId` | required | Clickonometrics placement ID | `12345` |

#### Video params
| Name | Scope | Description | Example |
| :--- | :---- | :---------- | :------ |
| `video.playbackmethod` | optional | See OpenRTB docs for info | `[1, 2, 3, 4]` |
| `video.protocols` | optional | See OpenRTB docs for info | `[2, 3, 5, 6]` |
| `video.mimes` | optional | See OpenRTB docs for info | `["video/mp4", "video/x-flv"]` |
| `video.skip` | optional | See OpenRTB docs for info | `1` |
| `video.skipafter` | optional | See OpenRTB docs for info | `5` |
=======
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
>>>>>>> upstream/master
