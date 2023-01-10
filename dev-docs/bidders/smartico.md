---
layout: bidder
title: smartico
description: Prebid Smartico Bidder Adaptor
pbjs: true
biddercode: smartico
media_types: banner
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description              | Example      | Type     |
|-----------------|----------|--------------------------|--------------|----------|
| `placementId`   | required | Unique identificator per widget integration provided by customer | `'1234567'` | `string` |
| `token`   | required | Unique 40-symbols identificator per customer provided by smartico | `'FNVzUGZn9ebpIOoheh3kEJ2GQ6H6IyMH39sHXaya` | `string` |
| `region`    | optional | Creative region alias   | `'berlin'` | `string` |
| `regions`    | optional | Creative region aliases list   | `['berlin', 'hamburg']` | `Array<string>` |
| `bannerFormat`    | optional | Specific banner format alias  | `'medium_rectangle'` | `string` |
| `language`    | optional | Two letter language code | `'de'` | `string` |

### Note

The Smartico bidder adaptor requires setup and approval from the Smartico team. Please reach out to [sk@smartico.eu](mailto:sk@smartico.eu) for more information.<br>
<br>
• Parameters <b>'region'</b> and <b>'regions'</b> are used as creatives feed filters, making sure creatives of specified region(s) to be only provided. The complete list of regions aliases must be predefined per each customer during the adapter integration.<br>
• Parameter <b>'regions'</b> can a array of region aliases or a string of comma separated region aliases<br>
• Parameter <b>'bannerFormat'</b> is needed in cases when it is not possible to precisely resolve the banner format by provided sizes as two or more banner formats could match that. The list supported banner formats could vary per customer thus must be predefined during the adapter integration.<br>
• Parameter <b>'language'</b> is used as creatives feed filter, making sure creatives of specified or no language content to be only provided and simultaneously making sure labels of specified language to be displayed inside creatives. The default label language is German.     

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
                    bidder: "smartico",
                    params: {
                          placementId: 'placement123', //required
                          token: "FNVzUGZn9ebpIOoheh3kEJ2GQ6H6IyMH39sHXaya", // required
			  region: "sample-region-code-1", // optional
                          regions: ["sample-region-code-1","sample-region-code-2"], // optional 
                          bannerFormat: "medium_rectangle", // optional 
                          language:"de" // optional 
                    }
                }
            ]
        }
    ]
``` 
