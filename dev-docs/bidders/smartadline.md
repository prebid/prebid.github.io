---
layout: bidder
title: smartadline
description: Prebid Smartadline Bidder Adaptor
pbjs: true 
pbs: false
biddercode: smartadline
media_types: banner
deals_supported: false
floors_supported: false
fpd_supported: false
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description              | Example      | Type     |
|-----------------|----------|--------------------------|--------------|----------|
| `publisherId`   | required | Unique identificator per widget integration provided by Smartadline team | `'1234567'` | `string` |

### Note

The Smartadline bidder adaptor requires setup and approval from the Smartadline team. Please reach out to [smartadline@gmail.com](mailto:smartadline@gmail.com) for more information.<br>

### Banner - Ad Unit Setup
```javascript
var adUnits = [
        {
            code: 'slot123',
            mediaTypes: {
                banner: {
                    sizes: [[300, 250]],  // a display size
                }
            },
            bids: [
                {
                    bidder: "smartadline",
                    params: {
                          publisherId: '1234567', //required
                    }
                }
            ]
        }
    ]
``` 
