---
layout: bidder
title: Insticator
description: Prebid Insticator Bidder Adapter
biddercode: insticator
tcfeu_supported: true
usp_supported: true
schain_supported: true
media_types: banner, video
multiformat_supported: will-bid-on-any
pbjs: true
gvl_id: 910
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description               | Example              | Type     |
|---------------|----------|---------------------------|----------------------|----------|
| `adUnitId`    | Required | The ad unit ID provided by Insticator | `'test'` | `string` |
| `yob`         | optional | Year of Birth             | `'1982'`             | `string` |
| `gender`      | optional | Gender                    | `'M'`                | `string` |
| `instl`       | optional | 1 = the ad is interstitial or full screen, 0 = not interstitial.    | `1`    | `number` |
| `pos`         | optional | ad position as per IAB standards       | `1`                | `number` |

### Banner Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description               | Example              | Type     |
|---------------|----------|---------------------------|----------------------|----------|
| `sizes`       | Required | The ad sizes provided by Insticator | `[[300, 250], [300, 600]]` | `array` |
| `pos`         | optional | ad position as per IAB standards       | `1`                | `number` |

### Example

```javascript
var adUnitsBannerOnly = [
  {
    code: 'insticator-banner-ad-1',
    mediaTypes: {
      banner: {
        sizes: [
          [336, 280],
          [300, 250],
          [320, 100],
        ],
      },
    },
    bids: [
      {
        bidder: 'insticator',
        params: {
          adUnitId: 'example_adunit_id',
        },
      },
    ],
  },
];
```

### video parameters

{: .table .table-bordered .table-striped }
| Name                   | Scope       | Description                                                     | Example                       |
|------------------------|-------------|-----------------------------------------------------------------|-------------------------------|
| `video.mimes`          | required    | Video MIME types                                                | `['application/javascript',`<br/>`'video/mp4',`<br/>`'video/ogg',`<br/>`'video/webm',`<br/>`'video/mpeg']` |
| `video.w`              | recommended | Width of the video player in device independent pixels (DIPS).  | `640`                         |
| `video.h`              | recommended | Height of the video player in device independent pixels (DIPS). | `480`                         |
| `video.placement`      | recommended | Video placement type. See [Video Placement Types](#video-placement-types)  | `3` |
| `video.plcmt`          | recommended | Placement type for the impression. See [Video Plcmt Subtypes](#video-plcmt-subtypes)            | `5`                           |
| `video.playerSize`     | optional    | Array of supported sizes of the player.                         | `[[300, 250], [300, 600]]`    |
| `video.playbackmethod` | optional    | Playback methods that may be in use.See [Video Playback Methods](#video-playback-methods)  | `[1, 2, 3, 4]`                           |
| `video.protocols`      | optional    | Supported video bid response protocol values. See [Video Protocols](#video-protocols) | `[2, 3, 5, 6, 7, 8]`                       |
| `video.maxduration`    | optional    | Maximum video ad duration in seconds                            | `30`                          |
| `video.minduration`    | optional    | Minimum video ad duration in seconds                            | `1`                          |
| `video.skip`           | optional    | Indicates if the player will allow the video to be skipped, where 0 = no, 1 = yes | `0` |
| `video.skipafter`      | optional    | Number of seconds a video must play before skipping is enabled  | `5`                           |
| `video.startdelay`     | optional    | Indicates the start delay in seconds for pre-roll, mid-roll, or post-roll ad placements. See [Video StartDelay](#video-startdelay)    | `0` |
| `video.linearity`      | optional    | Indicates if the impression must be linear, nonlinear, etc. [Video Linearity](#video-linearity)    | `1` |
| `video.skipmin`        | optional    | Only if the ad is skippable. Videos of total duration greater than this number of seconds can be skippable | `5` |
| `video.sequence`       | optional    | For multiple ad in the same bid request. This value allow will for the coordinated delivery of multiple ad | `1` |
| `video.battr`          | optional    | Blocked creative attributes. See [Creative Attributes](#creative-attributes)                                   | `[1]`                         |
| `video.maxextended`    | optional    | Max extended ad duration beyond the maxduration if extension is allowed. Blank or 0 - blocked. -1 - allowed without time limit | `30` |
| `video.minbitrate`     | optional    | Minimum bit rate in Kbps                                        | `5`                           |
| `video.maxbitrate`     | optional    | Maximum bit rate in Kbps                                        | `10000`                           |
| `video.playbackend`    | optional    | The event that causes playback to end. See [Playback Cessation Modes](#playback-cessation-modes)  | `1` |
| `video.delivery`       | optional    | Supported delivery methods (1 = streaming, 2 = progressive, 3 = download). If none specified, assume all are supported. | `[1, 2]`                      |
| `video.pos`            | optional    | Ad position on screen. Refer to [Ad Position](#ad-position)      | `1`                           |
| `video.api`            | optional    | List of supported API frameworks for this impression. Refer to [API Frameworks](#api-frameworks) | `[2, 7]`                   |

### Example

```javascript
var adUnits = [
    {
        code: 'insticator-video-ad-2',
        mediaTypes: {
            video: {
                playerSize: [640, 480],
                w: 640,
                h: 480,
                mimes: ['video/mp4', 'video/x-flv'],
                protocols: [2, 3, 5, 6, 7, 8],
                placement: 3,
                startdelay: 0,
                api: [2, 7],
                skip: 0,
                minduration: 1,
                maxduration: 30,
                playbackmethod: [1, 3],
                battr: [13, 14],
                linearity: 1,
                minbitrate: 10,
                maxbitrate: 10000
            }
        },
        bids: [{
            bidder: 'insticator',
            params: {
                adUnitId: 'example_adunit_id'
            }
        }],
        ...
    }];
```

### Video Protocols

{: .table .table-bordered .table-striped }
| Value | Description                                              |
|-------|----------------------------------------------------------|
| `2`   | VAST 2.0                                                 |
| `3`   | VAST 3.0                                                 |
| `5`   | VAST 2.0 Wrapper                                         |
| `6`   | VAST 3.0 Wrapper                                         |
| `7`   | VAST 4.0                                                 |
| `8`   | VAST 4.0 Wrapper                                         |

#### Video Playback Methods

{: .table .table-bordered .table-striped }
| Value | Description                                              |
|-------|----------------------------------------------------------|
| `1`   | Initiates on Page Load with Sound On                     |
| `2`   | Initiates on Page Load with Sound Off by Default         |
| `3`   | Initiates on Click with Sound On                         |
| `4`   | Initiates on Mouse-Over with Sound On                    |

#### Playback Cessation Modes

{: .table .table-bordered .table-striped }
| Value | Description                                                                                               |
|-------|-----------------------------------------------------------------------------------------------------------|
| `1`   | On Video Completion or when Terminated by User                                                            |
| `2`   | On Leaving Viewport or when Terminated by User                                                            |
| `3`   | On Leaving Viewport Continues as a Floating/Slider Unit until Video Completion or when Terminated by User |

#### Video Plcmt Subtypes

{: .table .table-bordered .table-striped }
| Value | Description                                              |
|-------|----------------------------------------------------------|
| `1`   | Instream                                               |
| `2`   | Accompanying Content                                              |
| `3`   | Interstitial                                               |
| `4`   | No Content/Standalone                                                  |

#### Video Placement Types

{: .table .table-bordered .table-striped }
| Value | Description                                              |
|-------|----------------------------------------------------------|
| `1`   | In-Stream                                                |
| `2`   | In-Banner                                                |
| `3`   | In-Article                                               |
| `4`   | In-Feed                                                  |
| `5`   | Interstitial/Slider/Floating                             |

#### Video Linearity

{: .table .table-bordered .table-striped }
| Value | Description                                              |
|-------|----------------------------------------------------------|
| `1`   | Linear                                                   |
| `2`   | Non-Linear                                               |

#### Video StartDelay

{: .table .table-bordered .table-striped }
| Value | Description                                              |
|-------|----------------------------------------------------------|
| `0`   | Pre-Roll                                                 |
| `>0`   | Mid-Roll (value indicates start delay in second)                                       |
| `-1`   | Generic Mid-Roll                                        |
| `-2`   | Generic Post-Roll                                   |

#### Ad Position

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

#### API Frameworks

{: .table .table-bordered .table-striped }
| Value | Description |
|-------|-------------|
| `1`   | VPAID 1.0   |
| `2`   | VPAID 2.0   |
| `3`   | MRAID-1     |
| `4`   | ORMMA       |
| `5`   | MRAID-2     |
| `6`   | MRAID-3     |
| `7`   | OMID-1      |

#### Creative Attributes

{: .table .table-bordered .table-striped }
| Value | Description |
|-------|-------------|
| `1`   | Audio Ad Auto Play |
| `2`   | Audio Ad User Initiated |
| `3`   | Expandable (Automatic) |
| `4`   | Expandable (User Initiated - Click) |
| `5`   | Expandable (User Initiated - Rollover) |
| `6`   | In-Banner Video Ad Auto Play |
| `7`   | In-Banner Video Ad User Initiated |
| `8`   | Pop (e.g., Over, Under, or Upon Exit) |
| `9`   | Provocative or Suggestive Imagery |
| `10`  | Shaky, Flashing, Flickering, Extreme Animation, Smileys |
| `11`  | Surveys |
| `12`  | Text Only |
| `13`  | User Interactive (e.g., Embedded Games) |
| `14`  | Windows Dialog or Alert Style |
| `15`  | Has Audio On/Off Button |
| `16`  | Ad Provides Skip Button (e.g., VPAID-rendered skip button on pre-roll video) |
| `17`  | Adobe Flash |
