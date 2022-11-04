---
layout: bidder
title: MobFox
description: Prebid MobFox Bidder Adaptor
pbjs: true
biddercode: mobfox
media_types: video
enable_download: false
pbjs_version_notes: not ported to 5.x
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                            | Example                              | Type      |
|-------------|----------|------------------------------------------------------------------------|--------------------------------------|-----------|
| `s`         | required | The hash of your inventory to identify which app is making the request | `'267d72ac3f77a3f447b32cf7ebf20673'` | `string`  |
| `imp_instl` | optional | set to 1 if using interstitial otherwise delete or set to 0            | `1`                                  | `integer` |
