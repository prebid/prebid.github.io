---
layout: bidder
title: seedtag
description: Prebid Seedtag Bidder Adapter
pbjs: true
gdpr_supported: true
usp_supported: true
schain_supported: true
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
| `placement`       | required            | Adunit placement, posibles values: inScreen, inArticle              | `string` |


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
