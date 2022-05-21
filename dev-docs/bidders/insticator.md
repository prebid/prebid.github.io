---
layout: bidder
title: Insticator
description: Prebid Insticator Bidder Adapter
biddercode: insticator
gdpr_supported: true
usp_supported: true
schain_supported: true
media_types: banner
pbjs: true
gvl_id: 910
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description               | Example              | Type     |
|---------------|----------|---------------------------|----------------------|----------|
| `adUnitId`    | Required | The ad unit ID provided by Insticator | `'test'` | `string` |
| `yob`         | optional | Year of Birth             | `'1982'`             | `string` |
| `gender`      | optional | Gender                    | `'M'`                | `string` |
| `instl`       | optional | 1 = the ad is interstitial or full screen, 0 = not interstitial.    | `1`    | `number` |
| `pos`         | optional | ad position as per IAB standards       | `1`                | `number` |
