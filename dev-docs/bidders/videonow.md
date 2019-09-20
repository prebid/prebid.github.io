---
layout: bidder
title: videonow
description: Prebid Videonow Bidder Adaptor
hide: true
media_types: banner
---

### Note:

The Videonow Bidder Adapter requires setup and approval from Videonow.
Please reach out to <info@videonow.ru> for more information.


### Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                | Example  | 
|-------------|----------|----------------------------------------------------------------------------|----------|
| pId         | required | profile ID                                                                 | `'5468'` |                                        
| placementId | required | identifier of the element on the page to which the banner will be attached | `'EUR'`  |
| currency    | Optional | Currency                                                                   | `'RUB'`  |
| bidFloor    | Optional | Bid floor rate                                                             | `'1.25'` |
