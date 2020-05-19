---
layout: bidder
title: Rich Audience
description: Prebid Rich Audience Bidder Adapter
hide: true
biddercode: richaudience
userIds: criteo, id5Id, identityLink, liveIntentId, pubCommonId, unifiedId
media_types: banner, video
gdpr_supported: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                          | Example                                                   | Type      |
|-------------|----------|--------------------------------------|-----------------------------------------------------------|-----------|
| `pid`       | required | The placement ID from Rich Audience. | `'ADb1f40rmi'`                                            | `string`  |
| `supplyType`| required | Define if site or app.               | `'site / app'`                                            | `string`  |
| `ifa`       | optional | Identifier For Advertisers           | `'AAAAAAAAA-BBBB-CCCC-1111-222222220000234234234234234'`  | `string`  |
| `bidfloor`  | optional | Bid Floor                            | `0.80`                                                    | `float`   |
