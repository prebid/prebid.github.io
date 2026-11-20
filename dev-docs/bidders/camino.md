---
layout: bidder
title: Camino
description: Prebid Camino Bidder Adapter
biddercode: camino
media_types: banner, video
tcfeu_supported: true
gvl_id: 1670
usp_supported: true
gpp_sids: usnat, usstate_all, usp
coppa_supported: true
schain_supported: true
userIds: all
floors_supported: true
pbjs: true
pbs: true
pbs_app_supported: false
sidebarType: 1
---

## Overview

The Camino bidder adapter supports display and video advertising through Prebid.js and Prebid Server.

Setup and approval are required before using the adapter. To get started, please contact <publishers@camino-labs.com>.

## Bid Params

### Banner

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| ---- | ----- | ----------- | ------- | ---- |
| `publisherId` | required | Camino publisher identifier | `'1122334455'` | `string` |
| `placementId` | optional | Camino placement identifier | `'12345'` | `string` |

### Video

Camino bid params for video mediaTypes are identical to banner. The following `mediaTypes.video` fields are required for a video bid request to be considered valid. See the [Ad Unit Reference](/dev-docs/adunit-reference.html#adunitmediatypesvideo) for more info.

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| ---- | ----- | ----------- | ------- | ---- |
| `adUnit.mediaTypes.video.context` | required | `'instream'` or `'outstream'`. Outstream needs the publisher to define a `renderer` on the ad unit | `'instream'` | `string` |
| `adUnit.mediaTypes.video.playerSize` | required | Video player dimensions in pixels | `[[640, 480]]` | `integer array` |
| `adUnit.mediaTypes.video.mimes` | required | Supported content MIME types | `['video/mp4']` | `string array` |
| `adUnit.mediaTypes.video.protocols` | required | Supported video protocols (OpenRTB list) | `[2, 3, 5, 6]` | `integer array` |
| `adUnit.mediaTypes.video.plcmt` | optional | Video plcmt type (OpenRTB list; defaults to `2`) | `1` | `integer` |
| `adUnit.mediaTypes.video.placement` | optional | Video placement type (OpenRTB list) | `1` | `integer` |
| `adUnit.mediaTypes.video.startdelay` | optional | Start delay in seconds (defaults to `0` for instream) | `0` | `integer` |

An ad unit with both banner and video sends its banner to Camino. To bid on video, use a video-only ad unit.

## Example Configuration

### Banner Configuration

```javascript
var adUnits = [
  {
    code: "banner-div",
    mediaTypes: {
      banner: {
        sizes: [
          [300, 250],
          [300, 600],
        ],
      },
    },
    bids: [
      {
        bidder: "camino",
        params: {
          publisherId: "1122334455",
          placementId: "12345",
        },
      },
    ],
  },
];
```

### Video (Instream)

```javascript
var videoAdUnit = {
  code: "video-div",
  mediaTypes: {
    video: {
      context: "instream",
      playerSize: [[640, 480]],
      mimes: ["video/mp4"],
      protocols: [2, 3, 5, 6],
      api: [2],
      maxduration: 30,
    },
  },
  bids: [
    {
      bidder: "camino",
      params: {
        publisherId: "1122334455",
        placementId: "12345",
      },
    },
  ],
};
```
