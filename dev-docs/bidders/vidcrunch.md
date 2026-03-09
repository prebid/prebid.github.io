---
layout: bidder
title: VidCrunch
description: Prebid VidCrunch Bidder Adapter
pbjs: true
biddercode: vidcrunch
aliasCode: aniview
media_types: banner, video
gpp_sids: tcfeu, tcfca, usnat, usstate_all, usp
ortb_blocking_supported: true
multiformat_supported: will-bid-on-any
tcfeu_supported: true
floors_supported: true
usp_supported: true
schain_supported: true
safeframes_ok: true
gvl_id: 780 (aniview)
sidebarType: 1
userIds: all
---

### Note

For more information about [VidCrunch](https://vidcrunch.com/), please contact <info@vidcrunch.com>.

### Bid Params

{: .table .table-bordered .table-striped }
| Name             | Scope    | Description           | Example              | Type     |
|------------------|----------|-----------------------|----------------------|----------|
| `AV_PUBLISHERID` | required | Publisher/Network ID  | `'Get from VidCrunch'` | `string` |
| `AV_CHANNELID`   | required | Channel ID            | `'Get from VidCrunch'` | `string` |

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
    bidder: 'vidcrunch',
    params: {
      // Required
      AV_PUBLISHERID: 'Get from VidCrunch',
      AV_CHANNELID: 'Get from VidCrunch',
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
    bidder: 'vidcrunch',
    params: {
      // Required
      AV_PUBLISHERID: 'Get from VidCrunch',
      AV_CHANNELID: 'Get from VidCrunch',
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
    bidder: 'vidcrunch',
    params: {
      // Required
      AV_PUBLISHERID: 'Get from VidCrunch',
      AV_CHANNELID: 'Get from VidCrunch',
    },
  }],
}];
```

### Bidder specific configs

```javascript
pbjs.setBidderConfig({
  bidders: ['vidcrunch'],
  config: {
    ortb2: {
      ext: {
        vidcrunch: {
          // Additional data to send to the Ad Server
        },
      },
    },
  },
}, true);
```

### User Sync example

```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      // Iframe and Image
      all: {
        bidders: ['vidcrunch'],
        filter: 'include',
      },
        
      // Or you can specify which type should be enabled/disabled:
      iframe: {
        bidders: ['vidcrunch'],
        filter: 'include',
      },
      image: {
        bidders: '*', // '*' represents all bidders
        filter: 'include', // or 'exclude'
      },
    },
  },
});
```
