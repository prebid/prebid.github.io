---
layout: bidder
title: Orbitsoft
description: Prebid Orbitsoft Bidder Adaptor
pbjs: true
biddercode: orbitsoft
sidebarType: 1
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                          | Example                             | Type      |
|----------------|----------|----------------------------------------------------------------------|-------------------------------------|-----------|
| `placementId`  | required | The placement ID (site channel ID)                                   | `142`                               | `integer` |
| `requestUrl`   | required | Url to perform search request                                        | `'http://adserver.com/ads/show/hb'` | `string`  |
| `style`        | optional | Creative styles. Actual only for text ads                            |                                     | `string`  |
| `customParams` | optional | Permits passing any publisher key-value pairing into the bid request | `{"macro_name": "macro_value" }`     | `object`  |

Example:

``` bash
{
    bidder: "orbitsoft",
    params: {
        placementId: 142,
        requestUrl: "https://orbitsoft.com/php/ads/hb.php",
        style: {
            title: {
                family: "Tahoma",
                size: "medium",
                weight: "normal",
                style: "normal",
                color: "0053F9"
            },
            description: {
                family: "Tahoma",
                size: "medium",
                weight: "normal",
                style: "normal",
                color: "0053F9"
            },
            url: {
                family: "Tahoma",
                size: "medium",
                weight: "normal",
                style: "normal",
                color: "0053F9"
            },
            colors: {
                background: "ffffff",
                border: "E0E0E0",
                link: "5B99FE"
            }
        }
        customParams: {
            macro_name: "macro_value"
        }
    }
}
```
