---
layout: bidder
title: Yieldmo
description: Prebid Yieldmo Bidder Adaptor
biddercode: yieldmo
media_types: banner, video
userIds: pubCommonId, unifiedId, criteo, sharedId
gvl_id: 173
gdpr_supported: true
usp_supported: true
schain_supported: true
prebid_member: true
pbjs: true
pbs: true
sidebarType: 1
---

### Registration

Note: In order to use Yieldmo adapter please reach out to your Yieldmo account's person or <support@yieldmo.com> for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description            | Example                | Type     |
|---------------|----------|------------------------|------------------------|----------|
| `placementId` | required |  Yieldmo placement id  | `'825209316101005155'` | `string` |
| `bidFloor`    | optional |       Bid Floor        |         `0.1`          | `float`  |
| `lr_env`      | optional | Live Ramp ATS envelope |  `e3b0c44298fc1c149a`  | `string` |

### video parameters

The Yieldmo adapter supports in-stream video as of Prebid v4.18. Out-stream will be supported as of Prebid v4.35.0.

{: .table .table-bordered .table-striped }
| Name              | Scope    | Description                                            | Example         | Type      |
|-------------------|----------|--------------------------------------------------------|-----------------|-----------|
| `placement`       | required | Video placement type. In-Stream: `1`; Out-stream types: In-Article - `3`: In-Feed - `4`; Interstitial - `5`; <br/><br/>Currently we are not supporting `2` - in-banner. <br/><br/>See [OpenRTB 2.5 specification](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf), List 5.9 for more details | `1` | `integer` |
| `maxduration`     | required | Maximum ad duration in seconds                         | `20`            | `integer` |
| `minduration`     | optional | Minimum ad duration in seconds                         | `5`             | `integer` |
| `pos`             | optional | Ad position on screen; see [OpenRTB 2.5 specification](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf), List 5.4 for more details | `1`  | `integer` |
| `startdelay`      | required for in-stream | Duration offset (in second) from the start of the content for showing the video ad before the start of the Video. Pre-roll: `0` (default); Mid-roll: `>0`; Default mid-roll: `-1`; Post-roll: `-2`; <br/><br/> For out-stream is' always `0`| `5`  | `integer` |
| `protocols`       | required | Supported video bid response protocols. VAST 1.0: `1`; VAST 2.0: `2`; VAST 3.0: `3`; VAST 1.0 Wrapper: `4`; VAST 2.0 Wrapper: `5`; VAST 3.0 Wrapper: `6`; | `[2, 3]`        | `Array<integer>` |
| `api`             | required | API frameworks supported. VPAID 1.0: `1`; VPAID 2.0: `2`; MRAID-1: `3`; ORMMA: `4`; MRAID-2: `5`; MRAID-3: `6`;                                         | `[1, 2]`        | `Array<integer>` |
| `playbackmethod`  | required | Playback methods that may be in use; see [OpenRTB 2.5 specification](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf), List 5.10 for more details. Out-stream is only always `2` | `[2,6]`  | `Array<integer>` |
| `skippable`       | optional | If 'true', user can skip ad                            | `true`          | `boolean` |
| `skipafter`       | optional | Number of seconds a video must play before skipping is enabled; only applicable if the ad is `skippable` | `5`  | `integer` |
| `mimes`           | required | List of the content MIME types supported by the player | `["video/mp4"]` | `Array<string>`  |

Following video parameters might be also defined in `mediaTypes.video` in order to simplify bidders configuration. If the same parameters was also defined in `params.video` it will be overriten by `params.video`. More details - <https://docs.prebid.org/dev-docs/adunit-reference.html>

In addition, Yieldmo adapter relies on parameters specified in the `mediaTypes.video` definition of the video ad-units, namely:

{: .table .table-bordered .table-striped }
| Name              | Scope    | Description                                            | Example         | Type             |
|-------------------|----------|--------------------------------------------------------|-----------------|------------------|
| `playerSize`      | required | Width and height of the player                         | `[640, 480]`    | `Array<integer>` |
| `context`         | required | `instream` or `outstream` are only supported                           | `instream`      | `string`         |

### Example of in-stream Video Ad-unit

```javascript
var videoAdUnits = [{
  code: 'div-video-ad-1234567890',
  mediaTypes: {
    video: {
      playerSize: [640, 480],           // required
      context: 'instream',
      mimes: ['video/mp4'],             // required, array of strings
      placement: 1,                     // required, integer
      maxduration: 30,                  // required, integer
      minduration: 15,                  // optional, integer
      pos: 1,                           // optional, integer
      startdelay: 10,                   // required if placement == 1
      protocols: [2, 3],                // required, array of integers
      api: [2, 3],                      // required, array of integers
      playbackmethod: [2,6],            // required, array of integers
      skip: 1,                          // optional, boolean
      skipafter: 10                     // optional, integer
    }
  },
  bids: [{
    bidder: 'yieldmo',
    params: {
      placementId: '1524592390382976659',// required,
    }
  }]
}];
```

### Example of out-stream Video Ad-unit

```javascript
var videoAdUnit = [{
  code: 'div-video-ad-1234567890',
  mediaTypes: {
      video: {
          playerSize: [640, 480],        // required
          context: 'outstream',
          mimes: ['video/mp4'],          // required, array of strings
          placement: 3,                  // required, integer ( 3,4,5 )
          maxduration: 30,               // required, integer
          protocols: [2, 3],             // required, array of integers
          api: [2, 3],                   // required, array of integers
          playbackmethod: [1,2]          // required, array of integers
      }
  },
  bids: [{
    bidder: 'yieldmo',
    params: {
      placementId: '1524592390382976659',  // required
    }
  }]
}];
```

> [Prebid out-stream demo](https://prebid-outstream-qa.yieldmo.com/prebid-outstream.html)
