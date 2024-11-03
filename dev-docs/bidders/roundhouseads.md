---
layout: bidder
title: RoundhouseAds
description: RoundhouseAds Prebid Bidder Adapter
biddercode: roundhouseads
tcfeu_supported: false
usp_supported: true
coppa_supported: true
schain_supported: true
media_types: banner, video, native
floors_supported: true
pbjs: true
sidebarType: 1
---

### Overview

The RoundhouseAds Bidder Adapter connects to RoundhouseAds' advertising platform, enabling bids for display, video, and native ad formats. Please contact: [info@roundhouseads.com](mailto:info@roundhouseads.com) to get started.

### Bid Parameters

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                             | Example                | Type    |
|----------------|----------|---------------------------------------------------------|------------------------|---------|
| `placementId`  | required | Unique placement identifier provided by RoundhouseAds    | `'12345'`              | string  |
| `video`        | optional | Video-specific settings (only for video ad units)       | `{ language: 'en' }`   | object  |

### Test Parameters

To test the RoundhouseAds adapter, use the following example ad units:

```javascript
var adUnits = [
  {
    code: 'banner-ad-unit',
    mediaTypes: {
      banner: {
       sizes: [[300, 250]]
      }
    },
    bids: [
      {
       bidder: 'roundhouseads',
       params: {
         placementId: 'your-placement-id'
        }
      }
    ]
  },
  {
    code: 'native-ad-unit',
    mediaTypes: {
      native: {
        title: { required: true },
        body: { required: true },
        image: { required: true },
        icon: { required: false }
      }
    },
    bids: [
      {
        bidder: 'roundhouseads',
        params: {
          placementId: 'your-placement-id'
        }
      }
    ]
  },
  {
    code: 'video-ad-unit',
    mediaTypes: {
      video: {
        context: 'instream',
        playerSize: [640, 480],
        mimes: ['video/mp4'],
        protocols: [2, 5],
        maxduration: 30,
        linearity: 1,
        api: [2]
      }
    },
    bids: [
      {
        bidder: 'roundhouseads',
        params: {
          placementId: 'your-placement-id',
          video: {
            language: 'en'
          }
        }
      }
    ]
  }
];

### Additional Information.

- **Maintainer Contact**: [info@roundhouseads.com](mailto:info@roundhouseads.com).

- **Supported Media Types**: Banner, Video, Native.

- **GDPR**: The adapter does not currently support TCFv2 (`tcfeu_supported: false`).

- **USP**: The adapter supports US Privacy (`usp_supported: true`).

- **COPPA**: This adapter respects the COPPA flag if enabled (`coppa_supported: true`).

- **Schain**: The adapter supports supply chain object (`schain_supported: true`).

- **Floor Module**: Supports the Prebid Floors Module (`floors_supported: true`).
