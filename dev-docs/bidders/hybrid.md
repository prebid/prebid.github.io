---
layout: bidder
title: Hybrid.ai
description: Prebid Hybrid.ai Bidder Adapter
pbjs: true
media_types: banner, video
biddercode: hybrid
gdpr_supported: true
---

### Note

You can use this adapter to get a bid from Hybrid.ai
Please reach out to your Hybrid.ai account team before using this plugin to get placeId.
The code below returns a demo ad.


### Bid Params

{: .table .table-bordered .table-striped }
| Name                | Scope               | Description                                                       | Example                             | Type     |
|---------------------|---------------------|-------------------------------------------------------------------|-------------------------------------|----------|
| `placeId`           | required            | The place id.                                                     | '5af45ad34d506ee7acad0c26'            | `string` |
| `placement`         | required            | Adunit placement, possible values: banner, video                  | 'banner'                              | `string` |


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
        bidder: "hybrid",
        params: {
            placement: "banner",                  // required
            placeId: "5af45ad34d506ee7acad0c26"   // required
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
            context: 'outstream',    // required, possible values: instream, outstream 
            playerSize: [640, 480]   // required
        }
    },
    bids: [{
        bidder: 'hybrid',
        params: {
            placement: "video",                   // required
            placeId: "5af45ad34d506ee7acad0c26"   // required
        }
    }]
}];
```
