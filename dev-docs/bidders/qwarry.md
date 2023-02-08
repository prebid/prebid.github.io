---
layout: bidder
title: Qwarry
description: Prebid Qwarry Bidder Adaptor
biddercode: qwarry
media_types: banner, video
pbjs: true
sidebarType: 1
---



### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                                                          | Example                                  | Type      |
|-------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------|-----------|
| `zoneToken` | required | The ID issued by Qwarry to the publisher                                                                                                                             | `'8a80d8e9-0cf9-4329-8486-6f5bbcd8a61a'` | `string`  |
| `pos`       | optional | Specify the position of the ad as a relative measure of visibility or prominence. Allowed values: Above the fold: `1`; Below the fold: `3`; Middle of the fold: `7`; | `0`                                      | `integer` |
