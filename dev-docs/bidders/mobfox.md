---
layout: bidder
title: MobFox
description: Prebid MobFox Bidder Adaptor
hide: true
biddercode: mobfox
biddercode_longer_than_12: false
media_types: video
---

### bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                            | Example                              | Type      |
|-------------|----------|------------------------------------------------------------------------|--------------------------------------|-----------|
| `s`         | required | The hash of your inventory to identify which app is making the request | `'267d72ac3f77a3f447b32cf7ebf20673'` | `string`  |
| `imp_instl` | optional | set to 1 if using interstitial otherwise delete or set to 0            | `1`                                  | `integer` |
