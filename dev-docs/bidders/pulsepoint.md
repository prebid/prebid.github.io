---
layout: bidder
title: PulsePoint
description: Prebid PulsePoint Bidder Adaptor
biddercode: pulsepoint
gdpr_supported: true
usp_supported: true
schain_supported: true
media_types: banner, video, native
userIds: all
pbjs: true
pbs: true
gvl_id: 81
sidebarType: 1
---

### Disclosure

This bidder sets `adId` on the bid response and hasn't responded to the Prebid.js team to confirm uniqueness
of this value. See [Issue 6381](https://github.com/prebid/Prebid.js/issues/6381).

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                           | Example                      | Type                |
|------------|----------|-------------------------------------------------------|------------------------------|---------------------|
| `cf`       | required | Ad size identifier                                    | `'300X250'`                  | `string`            |
| `cp`       | required | Publisher Id                                          | `12345`                      | `integer`           |
| `ct`       | required | Ad Tag Id                                             | `12345`                      | `integer`           |
| `bcat`     | optional | Blocked IAB Categories                                | `[ 'IAB1-5', 'IAB1-6' ]`     | `array of strings`  |
| `battr`    | optional | Blocked Creative Attributes                           | `[ 1, 2, 5 ]`                | `array of integers` |
| `badv`     | optional | Blocked Advertisers by their domains                  | `['ford.com', 'pepsi.com']`  | `array of strings`  |
| `bidfloor` | optional | Bid floor price CPM                                   | `1.23`                       | `float`             |
| `video`    | required | Required for video requests. OpenRTB Video object.    | `{ w: 400, h: 300 }`         | `object`            |

### Video parameters
Parameters on the Video object in Bid params for PulsePoint. [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) Video object specification is used. Below are some sample parameters from the OpenRTB Video specs.
Please use `mediaTypes.video` to specify video params in place of this parameter for PBJS 5.0 and later.


{: .table .table-bordered .table-striped }
| Name                   | Scope    | Description                                                | Example                       |
|------------------------|----------|------------------------------------------------------------|-------------------------------|
| `video.mimes`          | required | Content MIME types supported                               | `['video/mp4','video/x-flv']` |
| `video.minduration`    | optional | Minimum video ad duration in seconds                       | `8`                           |
| `video.maxduration`    | optional | Maximum video ad duration in seconds                       | `20`                          |
| `video.protocols`      | optional | Array of supported video protocols                         | `[2, 3]`                      |
| `video.w`              | optional | Width of the video player in device independent pixels     | `400`                         |
| `video.h`              | optional | Height of the video player in device independent pixels    | `300`                         |
| `video.startdelay`     | optional | Start delay in seconds                                     | `5`                           |
| `video.skip`           | optional | Indicates if the player will allow the video to be skipped | `1`                           |
| `video.minbitrate`     | optional | Minumim bit rate in Kbps.                                  | `200`                         |
| `video.maxbitrate`     | optional | Maximum bit rate in Kbps.                                  | `500`                         |
| `video.api`            | optional | List of supported API frameworks for this impression       | `[1, 2]`                      |

