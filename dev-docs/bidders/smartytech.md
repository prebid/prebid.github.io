---
layout: bidder
title: SmartyTech
description: Prebid SmartyTech Bidder Adaptor
pbjs: true
biddercode: smartytech
media_types: banner, video
multiformat_supported: will-bid-on-one
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description  | Example | Type      |
|--------------|----------|--------------|---------|-----------|
| `endpointId` | required | Endpoint ID. | `14`    | `integer` |

### Sample Banner Ad Unit Example

```
var adUnits = [{
    code: '/123123123/prebidjs-banner',
    mediaTypes: {
        banner: {
            sizes: [
                [300, 301],
                [300, 250]
            ]
        }
    },
    bids: [{
        bidder: 'smartytech',
        params: {
            endpointId: 14
        }
    }]
}];
```

### Sample Video Ad Unit Example

```
var videoAdUnit = {
    code: '/123123123/video-vast-banner',
    mediaTypes: {
        video: {
            context: 'instream',
            playerSize: [640, 480],
            mimes: ['video/mp4'],
        }
    },
    bids: [{
        bidder: 'smartytech',
        params: {
            endpointId: 14
        }
    }]
};
```
