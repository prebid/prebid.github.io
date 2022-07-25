---
layout: bidder
title: seedtag
description: Prebid Seedtag Bidder Adapter
pbjs: true
gdpr_supported: true
usp_supported: true
gvl_id: 157
media_types: banner, video
biddercode: seedtag
---

### Note

Please reach out to your seedtag account team before using this plugin.  
The publisher id 0000-0000-01 returns demo responses.


### Bid Params

{: .table .table-bordered .table-striped }
| Name              | Scope               | Description                                                                    | Example               | Type     |
|-------------------|---------------------|--------------------------------------------------------------------------------|-----------------------|----------|
| `publisherId`     | required            | The publisher id.                                                              | 0000-0000-01          | `string` |
| `adUnitId`        | required            | The adunit id.                                                                 | 00000                 | `string` |
| `placement`       | required            | Adunit placement, posibles values: banner, video, inImage, inScreen, inArticle | banner                | `string` |
| `adPosition`      | optional            | 0 - Below the Fold, 1 - Above the Fold                                         | 0                     | `number` |
| `video`           | optional for video  | Video targeting parameters. See the video section below.                       | {}                    | `object` |


### Video Param

All parameters are optional and correspond to the the OpenRTB 2.5 specification.

{: .table .table-bordered .table-striped }
| Name                | Example       |
|---------------------|---------------|
| `mimes`             | ['video/mp4'] |
| `minduration`       | 5             |
| `maxduration`       | 60            |
| `boxingallowed`     | 1             |
| `skip`              | 1             |
| `startdelay`        | 1             |
| `linearity`         | 1             |
| `battr`             | [1, 2]        |
| `maxbitrate`        | 10            |
| `playbackmethod`    | [1]           |
| `delivery`          | [1]           |
| `placement`         | 1             |

### Banner example

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
          placement: 'banner',              // required
          adPosition: 0                     // optional
        }
      }
    ]
  }
]
```

### Video InStream Example

```js
var adUnits = [{
  code: 'video',
  mediaTypes: {
    video: {
      context: 'instream',   // required
      playerSize: [600, 300] // required
    }
  },
  bids: [
    {
      bidder: 'seedtag',
      params: {
        publisherId: '0000-0000-01',    // required
        adUnitId: '0000',               // required
        placement: 'video',             // required
        adPosition: 0,                  // optional
        // Video object as specified in OpenRTB 2.5
        video: {
          mimes: ['video/mp4'],         // recommended
          minduration: 5,               // optional
          maxduration: 60,              // optional
          boxingallowed: 1,             // optional
          skip: 1,                      // optional
          startdelay: 1,                // optional
          linearity: 1,                 // optional
          battr: [1, 2],                // optional
          maxbitrate: 10,               // optional
          playbackmethod: [1],          // optional
          delivery: [1],                // optional
          placement: 1,                 // optional
        }
      }
    }
  ]
}];
```
