---
layout: bidder
title: MediaFuse Lift
description: Prebid MediaFuse Lift Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
pbjs: true
biddercode: mediafuseLift
aliasCode : orbitsoft
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                          | Example                             | Type      |
|----------------|----------|----------------------------------------------------------------------|-------------------------------------|-----------|
| `placementId`  | required | The placement ID (site channel ID)                                   | `142`                               | `integer` |
| `requestUrl`   | required | Url to perform search request                                        | `'http://adserver.com/ads/show/hb'` | `string`  |
| `style`        | optional | Creative styles. Actual only for text ads                            |                                     | `string`  |
| `customParams` | optional | Permits passing any publisher key-value pairing into the bid request | `{"macro_name": "macro_value" }`     | `object`  |

