---
layout: bidder
title: 33Across
description: Prebid 33Across Bidder Adapter
hide: true
biddercode: 33across
biddercode_longer_than_12: false
gdpr_supported: true
---


### bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                    | Example    | Type     |
|-------------|----------|--------------------------------------------------------------------------------------------------------------------------------|------------|----------|
| `siteId`    | required | Publisher  GUID from 33Across                                                                                                  | `'examplePub123'` | `string` |
| `productId` | required | 33Across Product ID that the Publisher has registered for (use `'siab'` for standard supply and `'inview'` for renderer) | `'siab'`   | `string` |
