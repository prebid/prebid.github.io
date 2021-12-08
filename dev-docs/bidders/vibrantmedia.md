---
layout: bidder
title: Vibrant Media
description: Vibrant Media Prebid Bidder Adapter
biddercode: vibrantmedia
gdpr_supported: true
gvl_id: 7
usp_supported: true
media_types: banner, video, native
safeframes_ok: false
pbjs: true
pbjs_version_notes: 6.4.0 and later
---

### Preliminaries

The Vibrant Media Adapter requires set-up before being enabled. Please contact us at intellitxtsupport@vibrantmedia.com.

Note: For video, we support outstream only.

### Bid Params

There are no Vibrant Media-specific bid params required, only Prebid.js-native ones (see examples below).

#### Banner example

```javascript
var adUnits = [{
  code: 'test-banner',
  mediaTypes: {
    banner: {
      sizes: [[300, 250], [300, 600]]
    }
  },
  bids: [{
    bidder: 'vibrantmedia',
    params: {
      placementId: 12345
    }
  }]
}];
```

#### Video example

```javascript
var adUnits = [{
  code: 'test-video-outstream',
  sizes: [[300, 250]],
  mediaTypes: {
    video: {
      playerSize: [[300, 250]],
      context: 'outstream',
      minduration: 1,      // Minimum ad duration, in seconds
      maxduration: 60,     // Maximum ad duration, in seconds
      skip: 0,             // 1 - true, 0 - false
      skipafter: 5,        // Number of seconds before the video can be skipped
      playbackmethod: [2], // Auto-play without sound
      protocols: [1, 2, 3] // VAST 1.0, 2.0 and 3.0
    }
  },
  bids: [{
    bidder: 'vibrantmedia',
    params: {
      placementId: 67890,
      video: {
        skippable: true,
        playback_method: 'auto_play_sound_off'
      }
    }
  }]
}];
```

#### Native example

```javascript
var adUnits = [{
  code: 'test-native',
  mediaTypes: {
    native: {
      image: {
        required: true,
        sizes: [300, 250]
      },
      title: {
        required: true
      },
      sponsoredBy: {
        required: true
      },
      clickUrl: {
        required: true
      },
    }
  },
  bids: [{
    bidder: 'vibrantmedia',
    params: {
      placementId: 13579,
      allowSmallerSizes: true
    }
  }]
}];
```
