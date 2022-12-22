---
layout: bidder
title: RtbSape
description: Prebid RtbSape Bidder Adaptor
pbjs: true
biddercode: rtbsape
media_types: banner, video
sidebarType: 1
---

### Note:

The RtbSape Header Bidding adaptor requires setup and approval before beginning. Please reach out to <sergey@sape.ru> for more details.


### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description   | Example                | Type      |
|---------------|----------|---------------|------------------------|-----------|
| `placeId`     | required | Place ID.     | `553307`               | `integer` |

### Example

```javascript
    var adUnits = [
        {
            code: 'banner-div',
            sizes: [[300, 250]],
            bids: [
                {
                    bidder: 'rtbsape',
                    params: {
                        placeId: 553307
                    }
                }
            ]
        }, {
           code: 'video-div',
           mediaTypes: {
               video: {
                   context: 'outstream',
                   playerSize: [600, 340]
               }
           },
           bids: [{
               bidder: 'rtbsape',
               params: {
                   placeId: 553309
               }
           }]
       }
    ];
```
