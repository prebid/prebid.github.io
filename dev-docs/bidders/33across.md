---
layout: bidder
title: 33Across
description: Prebid 33Across Bidder Adapter
pbjs: true
pbs: true
biddercode: 33across
gdpr_supported: true
schain_supported: true
usp_supported: true
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                    | Example    | Type     |
|-------------|----------|--------------------------------------------------------------------------------------------------------------------------------|------------|----------|
| `siteId`    | required | Publisher  GUID from 33Across                                                                                                  | `'examplePub123'` | `string` |
| `productId` | required | 33Across Product ID that the Publisher has registered for (use `'siab'` for standard supply and `'inview'` for renderer) | `'siab'`   | `string` |
