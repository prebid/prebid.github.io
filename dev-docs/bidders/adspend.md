---
layout: bidder
title: AdSpend
description: Prebid AdSpend Bidder Adaptor
pbjs: true
biddercode: adspend
media_types: banner
gdpr_supported: false
---


### Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                                                | Example                | Type            |
|---------------|----------|----------------------------------------------------------------------------|------------------------|-----------------|
| `pubcid`      | required | Publisher ID.                                                      		| `0`                    | `string`        |
| `bidfloor`	| required | Minimum bid for this impression expressed in CPM. 							| `0.03`                 | `float`         |

Please note that cookie support is required
