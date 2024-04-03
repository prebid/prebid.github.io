---
layout: bidder
title: TheMediaGridNM
description: Prebid TheMediaGridNM Bidder Adapter
pbjs: true
biddercode: gridNM
media_types: video
tcfeu_supported: false
usp_supported: true
fpd_supported: true
sidebarType: 1
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name                   | Scope    | Description                                                                                                            | Example                           | Type            |
|------------------------|----------|------------------------------------------------------------------------------------------------------------------------|-----------------------------------|-----------------|
| `secid`                | required | section id, will be used by JW Player to pass their info                                                               | `'11'`                            | `string`        |
| `pubid`                | required | publisher id, will be used by JW Player to pass their info                                                             | `'22'`                            | `string`        |
| `source`               | required | source of traffic, in JW Player case should be 'jwp'                                                                   | `'jw_player'`                     | `string`        |
| `pubdata`              | optional | publisher data, will be used by JW Player to pass their info                                                           | `{"jwpseg" : ["1111", "2222"]})`  | `object`        |
| `floorcpm`             | optional | floor cpm                                                                                                              | `0.56`                            | `float`         |
| `video`                | optional | video parameters which should be passed for no-mapping approach                                                        |                                   | `object`        |
| `video.mimes`             | optional | Content MIME types supported                                                                                             | `['video/mp4', 'video/x-ms-wmv']` | `string array`  |
| `video.mind`              | optional | Minimum video ad duration in seconds.                                                                                  | `1`                               | `integer`       |
| `video.maxd`           | optional | Maximum video ad duration in seconds                                                                                   | `60`                              | `int`           |
| `video.protocols`      | optional | Array of supported video protocols                                                                                     | `[1,2,3,4,5,6]`                   | `integer array` |
| `video.size`           | optional | player size wxh                                                                                                        | `'300x250'`                       | `string`        |
| `video.linearity`      | optional | Indicates if the impression must be linear, nonlinear, etc.                                                            | `1`                               | `int`           |
| `video.skip`           | optional | Indicates if the player will allow the video to be skipped, where 0 = no, 1 = yes.                                     | `0`                               | `int`           |
| `video.skipmin`        | optional | Videos of total duration greater than this number of seconds can be skippable; only applicable if the ad is skippable. | `0`                               | `int`           |
| `video.skipafter`      | optional | Number of seconds a video must play before skipping is enabled; only applicable if the ad is skippable.                | `0`                               | `int`           |
| `video.api`            | optional | List of supported API frameworks for this impression                                                                   | `[1,2,3,4,5,6]`                   | `integer array` |
| `video.startdelay`     | optional | Indicates the start delay in seconds                                                                                   | `0`                               | `int`           |
| `video.placement`      | optional | Placement type for the impression.                                                                                     | `1`                               | `int`           |
| `video.playbackmethod` | optional | Playback methods that may be in use                                                                                    | `[1]`                             | `integer array` |

### First Party Data

AdUnit-specific data using `AdUnit.ortb2Imp` supports following fields:

- `ortb2.imp[].ext.data.*`
