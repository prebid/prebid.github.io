---
layout: bidder
title: Insticator
description: Prebid Insticator Bidder Adapter
biddercode: insticator
tcfeu_supported: true
dsa_supported: true
gpp_sids: tcfeu, usnat, usstate_all, usp
usp_supported: true
coppa_supported: true
gdpr_supported: true
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

#### First Party Data

In release 8.44 and later, Insticator has added support for first party data which are optional and partners can send us. The following fields are supported:

* ortb2.site.keywords
* ortb2.site.content.*
* ortb2.site.search
* ortb2.site.cat
* ortb2.site.pagecat
* ortb2.site.sectioncat
* ortb2.user.ext.*
* ortb2.user.data.*


Here is an example first party data that insticator support.

```javascript
pbjs.setConfig({
  ortb2: {
    site: {
      keywords: "kw1,kw2",   
      content: {
        title: 'title',
        genre: 'rock',
      },
      cat: ['IAB1-1'],
      pagecat: ['IAB1-1'],
      sectioncat: ['IAB1-1'],           
      ext: {
        data: {
           prodtype: ["a","b"]  
        }
      }
    },
    user: {
      ext: {
        data: {
          ucat:["anything"]                 
        }
      }
    }
  }
};
```

### Media Types 
#### Video parameters

{: .table .table-bordered .table-striped }
| Name                   | Scope       | Description                                                     | Example                       |
|------------------------|-------------|-----------------------------------------------------------------|-------------------------------|
| `video.mimes`          | required    | Video MIME types                                                | `['application/javascript',`<br/>`'video/mp4',`<br/>`'video/ogg',`<br/>`'video/webm',`<br/>`'video/mpeg']` |
| `video.w`              | recommended | Width of the video player in device independent pixels (DIPS).  | `640`                         |
| `video.h`              | recommended | Height of the video player in device independent pixels (DIPS). | `480`                         |
| `video.placement`      | recommended | Video placement type. (see OpenRTB v2.5 section 5.9 for options)  | `3` |
| `video.plcmt`          | recommended | Placement type for the impression. (See [OpenRTB v2.6](https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/develop/AdCOM%20v1.0%20FINAL.md) Plcmt Subtypes - Video)          | `5`                           |
| `video.playerSize`     | optional    | Array of supported sizes of the player.                         | `[[300, 250], [300, 600]]`    |
| `video.playbackmethod` | optional    | Playback methods that may be in use.(see OpenRTB v2.5 section 5.10 for options)  | `[1, 2, 3, 4]`                           |
| `video.protocols`      | optional    | Supported video bid response protocol values are 2, 3, 5, 6, 7, 8. (see OpenRTB v2.5 section 5.8 for options) | `[2, 3, 5, 6, 7, 8]`                       |
| `video.maxduration`    | optional    | Maximum video ad duration in seconds                            | `30`                          |
| `video.minduration`    | optional    | Minimum video ad duration in seconds                            | `1`                          |
| `video.skip`           | optional    | Indicates if the player will allow the video to be skipped, where 0 = no, 1 = yes | `0` |
| `video.skipafter`      | optional    | Number of seconds a video must play before skipping is enabled  | `5`                           |
| `video.startdelay`     | optional    | Indicates the start delay in seconds for pre-roll, mid-roll, or post-roll ad placements. (see OpenRTB v2.5 section 5.12 for options)    | `0` |
| `video.linearity`      | optional    | Indicates if the impression must be linear, nonlinear, etc. (see OpenRTB v2.5 section 5.7 for options)   | `1` |
| `video.skipmin`        | optional    | Only if the ad is skippable. Videos of total duration greater than this number of seconds can be skippable | `5` |
| `video.sequence`       | optional    | For multiple ad in the same bid request. This value allow will for the coordinated delivery of multiple ad | `1` |
| `video.battr`          | optional    | Blocked creative attributes. (see OpenRTB v2.5 section 5.3 for options)                                 | `[1]`                         |
| `video.maxextended`    | optional    | Max extended ad duration beyond the maxduration if extension is allowed. Blank or 0 - blocked. -1 - allowed without time limit | `30` |
| `video.minbitrate`     | optional    | Minimum bit rate in Kbps                                        | `5`                           |
| `video.maxbitrate`     | optional    | Maximum bit rate in Kbps                                        | `10000`                           |
| `video.playbackend`    | optional    | The event that causes playback to end. (see OpenRTB v2.5 section 5.11 for options)  | `1` |
| `video.delivery`       | optional    | Supported delivery methods (1 = streaming, 2 = progressive, 3 = download). If none specified, assume all are supported. | `[1, 2]`                      |
| `video.pos`            | optional    | Ad position on screen. (see OpenRTB v2.5 section 5.4 for options)     | `1`                           |
| `video.api`            | optional    | List of supported API frameworks for this impression. Supported API frameworks are between 1-7 (See [OpenRTB v2.6](https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/develop/AdCOM%20v1.0%20FINAL.md) List API Frameworks) | `[2, 7]`                   |

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
