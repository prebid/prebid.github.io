---
layout: bidder
title: videonow
description: Prebid Videonow Bidder Adaptor
biddercode: videonow
pbjs: true
media_types: banner
---

### Note:

The Videonow Bidder Adapter requires setup and approval from Videonow.
Please reach out to <info@videonow.ru> for more information.


### Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                | Example                           | Type     | 
|-------------|----------|----------------------------------------------------------------------------|-----------------------------------|----------|
| pId         | required | profile ID                                                                 | `'5468'`                          | `string` |                                        
| currency    | Optional | Currency                                                                   | `'RUB'`                           | `string` |
| url         | Optional | for debug, bidder url                                                      | `'https://adx.videonow.ru/yhb'`   | `string` |
| codeType    | Optional | for debug, yhb codeType                                                    | `'combo'`                         | `string` |
