---
layout: bidder
title: Eywamedia
description: Prebid Eywamedia Bidder Adaptor
pbjs: true
biddercode: eywamedia
media_types: display
gdpr_supported: false
sidebarType: 1
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                                | Example                    | Type           |
|--------------|----------|--------------------------------------------|----------------------------|----------------|
| `publisherId`| required | Given by Eywamedia                         | `'1234_abcd'`              | `string`       |
| `bidFloor`   | optional | Floor bid price                            | `'0.50'`                   | `string`       |
| `cats`       | optional | IAB Categories of the web page             | `'["iab1-1","iab23-2"]'`   | `Array<string>`|
| `keywords`   | optional | Categogy Keywords of the web page          | `'["sports", "cricket"]'`  | `Array<string>`|
| `lat`        | optional | Latitude                                   | `'12.33333'`               | `float`        |
| `lon`        | optional | Longitude                                  | `'77.33333'`               | `float`        |
| `locn`       | optional | Location in country$region$city$zip format | `'ind$ka$bengaluru$560001'`| `string`       |
