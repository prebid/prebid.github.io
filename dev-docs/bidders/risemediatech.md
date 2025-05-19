---
layout: bidder
title: RiseMediaTech
description: Prebid.js bidder adapter for RiseMediaTech
biddercode: risemediatech
media_types:
  - banner
  - video
gdpr_supported: true
usp_supported: true
gpp_supported: true
user_sync:
  iframe: true
  image: true
schain_supported: true
pbjs: true
pbs: true
---

# Overview

RiseMediaTech is a digital advertising platform that supports banner and video ads through its Prebid.js adapter. The adapter supports GDPR, CCPA (USP), and GPP regulations and uses OpenRTB standards for request and response formatting.

# Bid Params

| Name         | Scope              | Type             | Description                                | Example                 |
|--------------|--------------------|------------------|--------------------------------------------|-------------------------|
| `publisherId`| required           | string           | Unique identifier for the publisher        | `'1234'`                |
| `mimes`      | required for video | array of strings | Supported MIME types for video creatives   | `['video/mp4']`         |
| `minduration`| optional           | number           | Minimum video duration (in seconds)        | `5`                     |
| `maxduration`| optional           | number           | Maximum video duration (in seconds)        | `30`                    |
| `startdelay` | optional           | number           | Start delay of the video ad                | `0`                     |
| `maxseq`     | optional           | number           | Maximum number of ads in a pod             | `1`                     |
| `poddur`     | optional           | number           | Total duration of the pod (in seconds)     | `60`                    |
| `protocols`  | optional           | array of numbers | Supported video protocols                  | `[2, 3, 5, 6]`          |

# Example Ad Units

### Banner

```javascript
var adUnits = [{
  code: 'banner-div',
  mediaTypes: {
    banner: {
      sizes: [[300, 250], [728, 90]]
    }
  },
  bids: [{
    bidder: 'risemediatech',
    params: {
      publisherId: '1234'
    }
  }]
}];
