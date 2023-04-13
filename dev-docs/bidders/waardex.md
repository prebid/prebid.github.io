---
layout: bidder
title: waardex
description: Prebid Waardex Bidder Adaptor
hide: true
biddercode: waardex
media_types: banner, video
pbjs: true
sidebarType: 1
---

### Bid Params
#### Banner
{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                      | Example            | Type     |
|---------------|----------|------------------------------------------------------------------|--------------------|----------|
| `zoneId`      | required | publisher identifier                                             | 1                  | `number` |
| `bidId`       | required | bid request id                                                   | `'22c4871113f461'` | `string` |
| `bidfloor`    | required | bid request price                                                | 0.5                | `float`  |
| `position`    | optional | ad position on the page                                          | 1                  | `number` |
| `instl`       | optional | 1 when ad is interstitial or full screen, 0 when not interstitial| 0                  | `number` |

#### Video
{: .table .table-bordered .table-striped }
| Name            | Scope    | Description                                                                                             | Example                         | Type            |
|-----------------|----------|---------------------------------------------------------------------------------------------------------|---------------------------------|-----------------|
| `zoneId`        | required | publisher identifier                                                                                    | 1                               | `number`        |
| `bidId`         | required | bid request id                                                                                          | `'22c4871113f461'`              | `string`        |
| `bidfloor`      | required | bid request price                                                                                       | 0.5                             | `float`         |
| `position`      | optional | ad position on the page                                                                                 | 1                               | `number`        |
| `instl`         | optional | 1 when ad is interstitial or full screen, 0 when not interstitial                                       | 1                               | `number`        |
| `mimes`         | optional | Content MIME types supported                                                                            | ['video/x-ms-wmv', 'video/mp4'] | `array<string>` |
| `minduration`   | optional | Minimum video ad duration in seconds                                                                    | 2                               | `number`        |
| `maxduration`   | optional | Maximum video ad duration in seconds                                                                    | 10                              | `number`        |
| `protocols`     | optional | Array of supported video protocols                                                                      | ['VAST 1.0', 'VAST 2.0']        | `array<string>` |
| `startdelay`    | optional | Indicates the start delay in seconds for pre-roll, mid-roll, or post-roll ad placements                 | -1                              | `number`        |
| `placement`     | optional | Placement type for the impression                                                                       | 1                               | `number`        |
| `skip`          | optional | Indicates if the player will allow the video to be skipped, where 0 = no, 1 = yes                       | 1                               | `number`        |
| `skipafter`     | optional | Number of seconds a video must play before skipping is enabled; only applicable if the ad is skippable  | 2                               | `number`        |
| `minbitrate`    | optional | Minimum bit rate in Kbps                                                                                | 0                               | `number`        |
| `maxbitrate`    | optional | Maximum bit rate in Kbps                                                                                | 0                               | `number`        |
| `delivery`      | optional | Supported delivery methods (e.g., streaming, progressive)                                               | [1,2,3]                         | `array<number>` |
| `playbackmethod`| optional | Playback methods that may be in use                                                                     | [1,2]                           | `array<number>` |
| `api`           | optional | List of supported API frameworks for this impression                                                    | [1,2,3,4,5,6]                   | `array<number>` |
| `linearity`     | optional | Indicates if the impression must be linear, nonlinear, etc                                              | 1                               | `number`        |
