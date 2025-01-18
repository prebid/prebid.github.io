---
layout: bidder
title: CondorX
description: Prebid CondorX Bidder Adapter
media_type: native, banner
biddercode: condorx
pbjs: true
tcfeu_supported: false
sidebarType: 1
---

### Note

The CondorX Bidding adapter requires setup before beginning. Please contact us at [CondorX](https://condorx.io).

### Bid params

| Name     | Scope    | Description                                                 | Example              |
|----------|----------|-------------------------------------------------------------|----------------------|
| `widget` | required | The widget ID, by CondorX                                  | `12345`              |
| `website`| required | The website ID, by Condorx                                  | `12345`              |
| `url`    | optional | Current url                                                 | `https://condorx.io` |

### Example Ad Unit

```javascript
var adUnits = [{
    code: 'condorx-container-id',
    mediaTypes: {
        banner: {
            sizes: [[300, 250]],  
        }
    },
    bids: [{
        bidder: "condorx",
        params: {
            widget: 'widget id by CondorX',
            website: 'website id by CondorX',
            url:'current url'
        }
    }]
}];
