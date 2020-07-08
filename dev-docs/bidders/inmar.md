---
layout: bidder
title: Inmar
description: Inmar Bidder Adapter

biddercode: inmar
userIds: identityLink, pubCommonId
media_types: banner, video
safeframes_ok: false
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                          | Example                                                   | Type      |
|-------------|----------|--------------------------------------|-----------------------------------------------------------|-----------|
| `pid`       | required | The placement ID from Inmar.         | `'ADb1f40rmi'`                                            | `string`  |
| `supplyType`| required | Define if site or app.               | `'site / app'`                                            | `string`  |
| `ifa`       | optional | Identifier For Advertisers           | `'AAAAAAAAA-BBBB-CCCC-1111-222222220000234234234234234'`  | `string`  |
| `bidfloor`  | optional | Bid Floor                            | `0.80`                                                    | `float`   |
