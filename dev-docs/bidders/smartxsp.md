---
layout: bidder
title: SmartXSP
description: Prebid SmartXSP Bidder Adaptor
pbjs: true
biddercode: smartxsp
media_types: banner
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description              | Example      | Type     |
|-----------------|----------|--------------------------|--------------|----------|
| `widgetId`   | required | Unique identificator per widget integration provided by customer | `'sc.demo.oursblanc.io'` | `string` |
| `accountId`   | required | Unique identificator per customer provided by SmartXSP | `'29Md1Mx1x2MpM7Me` | `string` |
| `region`    | optional | Creative region alias   | `'paris'` | `string` |
| `regions`    | optional | Creative region aliases list   | `['paris', 'strasbourg']` | `Array<string>` |
| `bannerFormat`    | optional | Specific banner format alias  | `'medium_rectangle'` | `string` |
| `language`    | optional | Two letter language code | `'dr'` | `string` |

### Note

The Smartico bidder adaptor requires setup and approval from the SmartXSP team. Please reach out to [pbjs@smartxsp.io](mailto:pbjs@smartxsp.io) for more information.<br>
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
                    bidder: "smartxsp",
                    params: {
                        widgetId: 'sc.demo.oursblanc.io', //required
                        accountId: "29Md1Mx1x2MpM7Me", // required
			            region: "sample-region-code-1", // optional
                        regions: ["sample-region-code-1","sample-region-code-2"], // optional 
                        bannerFormat: "medium_rectangle", // optional 
                        language:"fr" // optional 
                    }
                }
            ]
        }
    ]
``` 
