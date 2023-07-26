---
layout: bidder
title: VOX
description: Prebid VOX Bidder Adapter
pbjs: true
media_types: banner, video
biddercode: vox
tcfeu_supported: false
sidebarType: 1
---

### Note

You can use this adapter to get a bid from partners.hybrid.ai
Please reach out to your partners account team before using this plugin to get placementId.

### Bid Params

{: .table .table-bordered .table-striped }
| Name                | Scope                  | Description                                                       | Example                              | Type     |
|---------------------|------------------------|-------------------------------------------------------------------|--------------------------------------|----------|
| `placementId`       | required               | The place id.                                                     | '5af45ad34d506ee7acad0c26'           | `string` |
| `placement`         | required               | Adunit placement, possible values: banner, video, inImage         | 'banner'                             | `string` |
| `imageUrl`          | required for inImage   | URL of the image on which the banner will be displayed            | '<https://hybrid.ai/images/image.jpg>' | `string` |

### Sample Banner Ad Unit

```js
var adUnits = [{
    code: 'banner_ad_unit',
    mediaTypes: {
        banner: {
            sizes: [[728, 90]]
        }
    },
    bids: [{
        bidder: "vox",
        params: {
            placement: "banner",                      // required
            placementId: "5af45ad34d506ee7acad0c26"   // required
        }
    }]
}];
```

### Sample Video Ad Unit

```js
var adUnits = [{
    code: 'video_ad_unit',
    mediaTypes: {
        video: {
            context: 'outstream',      // required, possible values: instream, outstream 
            playerSize: [[640, 480]]   // required
        }
    },
    bids: [{
        bidder: "vox",
        params: {
            placement: "video",                       // required
            placementId: "5af45ad34d506ee7acad0c26"   // required
        }
    }]
}];
```

### Sample In-Image Ad Unit

```js
var adUnits = [{
    code: 'test-div',
    mediaTypes: {
        banner: {
            sizes: [0, 0]
        }
    },
    bids: [{
        bidder: "vox",
        params: {
            placement: "inImage",
            placementId: "102030405060708090000020",
            imageUrl: "https://hybrid.ai/images/image.jpg"
        }
    }]
}];
```
