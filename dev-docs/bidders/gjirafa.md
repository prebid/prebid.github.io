
---
layout: bidder
title: Gjirafa
description: Prebid Gjirafa Bidder Adaptor
pbjs: true
biddercode: gjirafa
gdpr_supported: true
---

### Note:
The Gjirafa Header Bidding adapter requires to have: placementId param in place OR minCPM and minCPC params.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                                        | Example  | Type     |
|---------------|----------|------------------------------------------------------------------------------------|----------|----------|
| `placementId` | optional | Your PlacementId (provided by Gjirafa)                                             | `'71-1'` | `string` |
| `minCPM`      | optional | The minCPM for units returned by Gjirafa (required if placementId is not provided) | `0.50`   | `float`  |
| `minCPC`      | optional | The minCPC for units returned by Gjirafa (required if placementId is not provided) | `0.50`   | `float`  |
