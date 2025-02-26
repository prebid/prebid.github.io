---
layout: bidder
title: Aniview
description: Prebid Aniview Bidder Adapter
pbjs: true
biddercode: aniview
media_types: banner, video
gpp_supported: true
ortb_blocking_supported: true
multiformat_supported: true
tcfeu_supported: true
floors_supported: true
usp_supported: true
schain_supported: true
safeframes_ok: true
gvl_id: 780
sidebarType: 1
userIds: true
---

### Note

For more information about [Aniview Ad Server](https://www.aniview.com/), please contact <info@aniview.com>.

### Bid Params

{: .table .table-bordered .table-striped }
| Name             | Scope    | Description           | Example              | Type     |
|------------------|----------|-----------------------|----------------------|----------|
| `AV_PUBLISHERID` | required | Publisher/Network ID  | `'Get from Aniview'` | `string` |
| `AV_CHANNELID`   | required | Channel ID            | `'Get from Aniview'` | `string` |

### Setup for Video

```javascript
const adUnit = [{
  code: 'videoAdUnit',
  mediaTypes: {
    video: {
      // Required
      playerSize: [[640, 480]],
      context: 'outstream',
      mimes: ['video/mp4', 'video/mpeg', 'application/javascript'],
      
      // Optional
      playbackmethod: [1, 2],
      protocols: [1, 2, 3, 5, 6, 7, 8],
      api: [1, 2],
      maxduration: 60,
      plcmt: 4,
    },
  },
  bids: [{
    bidder: 'aniview',
    params: {
      // Required
      AV_PUBLISHERID: 'Get from Aniview',
      AV_CHANNELID: 'Get from Aniview',
    },
  }],
}];
```

### Setup for Banner

```javascript
const adUnit = [{
  code: 'bannerAdUnit',
  mediaTypes: {
    banner: {
      // Required
      sizes: [[300, 250], [300, 600]],
    },
  },
  bids: [{
    bidder: 'aniview',
    params: {
      // Required
      AV_PUBLISHERID: 'Get from Aniview',
      AV_CHANNELID: 'Get from Aniview',
    },
  }],
}];
```

### Setup for Multi-format (Banner & Video)

```javascript
const adUnit = [{
  code: 'multiformatAdUnit',
  mediaTypes: {
    banner: {
      // Required
      sizes: [[300, 250], [300, 600]],
    },
    video: {
      // Required
      playerSize: [[640, 480]],
      context: 'outstream', 
      mimes: ['video/mp4', 'video/mpeg', 'application/javascript'],
    },
  },
  bids: [{
    bidder: 'aniview',
    params: {
      // Required
      AV_PUBLISHERID: 'Get from Aniview',
      AV_CHANNELID: 'Get from Aniview',
    },
  }],
}];
```

### Floors

```javascript
const adUnit = [{
  code: 'floorsAdUnit',
  mediaTypes: {/*...*/},
  bids: [/*...*/],
  floors: {
    currency: 'USD',
    schema: {
      delimiter: '|',
      fields: ['mediaType', 'size'],
    }, 
    values: {
      'banner|300x250': 0.1,
      'banner|*': 0.05,
      'video|640x360': 0.5,
      'video|*': 0.25,
    },
  },
}];
```

### Cookie sync

```javascript
pbjs.setConfig({
  // Cookie sync (Image & Iframe)
  userSync: {
    filterSettings: {
      all: {
        bidders: '*',
        filter: 'include',
      },
    },
  },
});
```

### Bidder specific configs

```javascript
pbjs.setBidderConfig({
  bidders: ['aniview'],
  config: {
    ortb2: {
      ext: {
        aniview: {
          // Additional data to send to the Ad Server
        },
      },
    },
  },
}, true);
```
