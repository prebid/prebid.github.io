---
layout: bidder
title: PremiumAds
description: PremiumAds Bidder Adapter
pbjs: true
biddercode: premiumads
media_types: banner
tcfeu_supported: false
schain_supported: true
usp_supported: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                    | Example    | Type     |
|-------------|----------|--------------------------------------------------------------------------------------------------------------------------------|------------|----------|
| `adUnitId`    | required | adUnitId provided by PremiumAds                                                                                         | `1123568438` | `number` |
| `floor`    | optional | Bid Floor                                                                                         | `0.5` | `float` |
