---
layout: bidder
title: AdSpend
description: Prebid AdSpend Bidder Adaptor
hide: true
biddercode: adspend
biddercode_longer_than_12: false
media_types: banner
gdpr_supported: false
---


### bid params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                                                | Example                | Type            |
|---------------|----------|----------------------------------------------------------------------------|------------------------|-----------------|
| `pubcid`      | required | Publisher ID.                                                      		| `0`                    | `string`        |
| `bidfloor`	| required | Minimum bid for this impression expressed in CPM. 							| `0.03`                 | `float`         |

Please note that cookie support is required