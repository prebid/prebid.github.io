---
layout: bidder
title: seedtag
description: Prebid Seedtag Bidder Adapter
pbjs: true
tcfeu_supported: true
usp_supported: true
schain_supported: true
safeframes_ok: true
gvl_id: 157
media_types: banner, video
biddercode: seedtag
coppa_supported: true
ortb_blocking_supported: partial
sidebarType: 1
gpp_supported: true
pbs: true
pbs_app_supported: false
floors_supported: true
---

### Note

Please reach out to your seedtag account team before using this plugin.  
The publisher id 0000-0000-01 returns demo responses.

### Bid Params (pbjs)

{: .table .table-bordered .table-striped }

| Name              | Scope               | Description                                                                    | Example               | Type     |
|-------------------|---------------------|--------------------------------------------------------------------------------|-----------------------|----------|
| `publisherId`     | required            | The publisher id.                                                              | 0000-0000-01          | `string` |
| `adUnitId`        | required            | The adunit id.                                                                 | 00000                 | `string` |
| `placement`       | required            | Adunit placement, posibles values: inScreen, inArticle                         | inScreen              | `string` |

### Bid Params (pbs)

{: .table .table-bordered .table-striped }

| Name              | Scope               | Description                                                                    | Example               | Type     |
|-------------------|---------------------|--------------------------------------------------------------------------------|-----------------------|----------|
| `adUnitId`        | required            | The adunit id.                                                                 | 00000                 | `string` |

### InScreen example

The integration for Seedtag uses banner mediaTypes for all types of creatives (display/video)

```js
const adUnits = [
  {
    code: '/21804003197/prebid_test_320x100',
    mediaTypes: {
      banner: {
        sizes: [[320, 100]]
      }
    },
    bids: [
      {
        bidder: 'seedtag',
        params: {
          publisherId: '0000-0000-01',      // required
          adUnitId: '0000',                 // required
          placement: 'inScreen',            // required
        }
      }
    ]
  }
]
```

### InArticle example

The integration for Seedtag uses banner mediaTypes for all types of creatives (display/video)

```js
const adUnits = [
  {
    code: '/21804003197/prebid_test_300x250',
    mediaTypes: {
      banner: {
        sizes: [[300, 250], [1, 1]]
      }
    },
    bids: [
      {
        bidder: 'seedtag',
        params: {
          publisherId: '0000-0000-01',      // required
          adUnitId: '0000',                 // required
          placement: 'inArticle',           // required
        }
      }
    ]
  }
]
```

### InBanner example

```js
const adUnits = [
  {
    code: '/21804003197/prebid_test_300x250',
    mediaTypes: {
      banner: {
        sizes: [[300, 250]]
      }
    },
    bids: [
      {
        bidder: 'seedtag',
        params: {
          publisherId: '0000-0000-01',      // required
          adUnitId: '0000',                 // required
          placement: 'inBanner',              // required
        }
      }
    ]
  }
]
```

### inStream example

```js
var adUnits = [{
  code: 'video',
  mediaTypes: {
    video: {
      context: 'instream',   // required
      playerSize: [640, 360], // required
      // Video object as specified in OpenRTB 2.5
      mimes: ['video/mp4'], // recommended
      minduration: 5,       // optional
      maxduration: 60,      // optional
      boxingallowed: 1,     // optional
      skip: 1,              // optional
      startdelay: 1,        // optional
      linearity: 1,         // optional
      battr: [1, 2],        // optional
      maxbitrate: 10,       // optional
      playbackmethod: [1],  // optional
      delivery: [1],        // optional
      placement: 1,         // optional
    }
  },
  bids: [
    {
      bidder: 'seedtag',
      params: {
        publisherId: '0000-0000-01',    // required
        adUnitId: '0000',               // required
        placement: 'inStream',          // required
      }
    }
  ]
}];
```
