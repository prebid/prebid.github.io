---
layout: bidder
title: Sovrn
description: Prebid Sovrn Bidder Adaptor
pbjs: true
pbs: true
biddercode: sovrn
gdpr_supported: true
usp_supported: true
userIds: all
prebid_member: true
schain_supported: true
gvl_id: 13
floors_supported: true
fpd_supported: true
media_types: banner, video
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description          | Example    | Type     |
|------------|----------|----------------------|------------|----------|
| `tagid`    | required | The sovrn Ad Tag ID  | `'315045'` | `string` |
| `bidfloor` | optional | Bid floor in dollars | `'0.04'`   | `string` |

Bid Params for video ads. These params should be added to `mediatype.video`.

{: .table .table-bordered .table-striped }
| Name             | Scope    | Description                                                                                                                    | Example         | Type            |
|------------------|----------|--------------------------------------------------------------------------------------------------------------------------------|-----------------|-----------------|
| `mimes`          | required | Content MIME types supported                                                                                                   | `['video/mp4']` | `string array`  |
| `minduration`    | required | Minimum video ad duration in seconds                                                                                           | `5`             | `integer`       |
| `maxduration`    | required | Maximum video ad duration in seconds                                                                                           | `10`            | `integer`       |
| `protocols`      | optional | The array of supported video protocols                                                                                         | `[1, 2]`        | `integer array` |
| `w`              | optional | Width of the video player in device independent pixels (DIPS)                                                                  | `5`             | `integer`       |
| `h`              | optional | Height of the video player in device independent pixels (DIPS)                                                                 | `5`             | `integer`       |
| `startdelay`     | optional | Indicates the start delay in seconds for pre-roll, mid-roll, or post-roll ad placements                                        | `5`             | `integer`       |
| `placement`      | optional | Placement type for the impression. Refer to List 5.9                                                                           | `5`             | `integer`       |
| `linearity`      | optional | Indicates if the impression must be linear, nonlinear, etc. Allowed by default                                                 | `0`             | `integer`       |
| `skip`           | optional | Indicates if the player will allow the video to be skipped, where 0 = no, 1 = yes                                              | `0`             | `integer`       |
| `skipmin`        | optional | Only if the ad is skippable. Videos of total duration greater than this number of seconds can be skippable                     | `5`             | `integer`       |
| `skipafter`      | optional | Only if the ad is skippable. Number of seconds a video must play before skipping is enabled                                    | `5`             | `integer`       |
| `sequence`       | optional | For multiple ad in the same bid request. This value allow will for the coordinated delivery of multiple ad                     | `5`             | `integer`       |
| `battr`          | optional | Blocked creative attributes                                                                                                    | `[1]`           | `integer array` |
| `maxextended`    | optional | Max extended ad duration beyond the maxduration if extension is allowed. Blank or 0 - blocked. -1 - allowed without time limit | `5`             | `integer`       |
| `minbitrate`     | optional | Minimum bit rate in Kbps                                                                                                       | `5`             | `integer`       |
| `maxbitrate`     | optional | Maximum bit rate in Kbps                                                                                                       | `5`             | `integer`       |
| `boxingallowed`  | optional | Indicates if letter-boxing of 4:3 content into a 16:9 window is allowed, where 0 = no, 1 = yes                                 | `5`             | `integer`       |
| `playbackmethod` | optional | Playback methods that may be in use. See [Video Playback Methods](#video-playback-methods)                                     | `[1]`           | `integer array` |
| `playbackend`    | optional | The event that causes playback to end. Refer to Playback Cessation Modes                                                       | `5`             | `integer`       |
| `delivery`       | optional | Supported delivery methods (1 = streaming, 2 = progressive, 3 = download). If none specified, assume all are supported.        | `[1, 2]`        | `integer array` |
| `pos`            | optional | Ad position on screen. Refer to [Ad Position](#ad-position)                                                                    | `5`             | `integer`       |
| `api`            | optional | List of supported API frameworks for this impression. Refer to [API Frameworks](api-frameworks)                                | `[1, 2, 3]`     | `integer array` |
 

### Note

[Protocols list](https://docs.prebid.org/dev-docs/bidders/conversant.html#protocols)

#### MIME types:

##### With VPAID2:  

video/mp4,
video/3gpp,
application/javascript

##### Without VPAID2:

video/mp4,
video/3gpp

#### Video Playback Methods:

{: .table .table-bordered .table-striped }
| Value | Description                                              |
|-------|----------------------------------------------------------|
| `1`   | Initiates on Page Load with Sound On                     |
| `2`   | Initiates on Page Load with Sound Off by Default         |
| `3`   | Initiates on Click with Sound On                         |
| `4`   | Initiates on Mouse-Over with Sound On                    |
| `5`   | Initiates on Entering Viewport with Sound On             |
| `6`   | Initiates on Entering Viewport with Sound Off by Default |

#### Playback Cessation Modes:

{: .table .table-bordered .table-striped }
| Value | Description                                                                                               |
|-------|-----------------------------------------------------------------------------------------------------------|
| `1`   | On Video Completion or when Terminated by User                                                            |
| `2`   | On Leaving Viewport or when Terminated by User                                                            |
| `3`   | On Leaving Viewport Continues as a Floating/Slider Unit until Video Completion or when Terminated by User |

#### Ad Position:

{: .table .table-bordered .table-striped }
| Value | Description    |
|-------|----------------|
| `0`   | Unknown        |
| `1`   | Above the Fold |
| `2`   | DEPRECATED     |
| `3`   | Below the Fold |
| `4`   | Header         |
| `5`   | Footer         |
| `6`   | Sidebar        |
| `7`   | Full Screen    |

#### API Frameworks:

{: .table .table-bordered .table-striped }
| Value | Description |
|-------|-------------|
| `1`   | VPAID 1.0   |
| `2`   | VPAID 2.0   |
| `3`   | MRAID-1     |
| `4`   | ORMMA       |
| `5`   | MRAID-2     |
| `6`   | MRAID-3     |

Source: [OpenRTB scpecification](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf)

### Example

#### Video instream adUnit

```
    var instreamAdUnit = {
      code: 'instream-div',
      sizes: [[640, 480]],
      mediaTypes: {
        video: {
          mimes: ['video/mp4'],
          minduration: 4,
          maxduration: 6,
          context: 'instream'
        }
      },
      bids: [{
        bidder: 'sovrn',
        params: {
          tagid: '315045'
        }
      }]
    }
```
#### Video outstream adUnit

```
    var outstreamAdUnit = {
      code: 'outstream-div',
      sizes: [[640, 480]],
      mediaTypes: {
        video: {
          mimes: ['video/mp4'],
          minduration: 4,
          maxduration: 6,
          context: 'outstream'
        }
      },
      bids: [{
        bidder: 'sovrn',
        params: {
          tagid: '315045'
        }
      }]
    },
```
#### Banner adUnit

```
    var bannerAdUnit = {
      code: 'banner-div',
      sizes: [[300, 250]],
      bids: [{
        bidder: 'sovrn',
        params: {
          tagid: '315045'
        }
      }]
    }
```
