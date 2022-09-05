---
layout: bidder
title: ShowHeroes
description: Prebid ShowHeroes Bidder Adapter
pbjs: true
biddercode: showheroes-bs
media_types: video, banner
gdpr_supported: true
---



### bid params

{: .table .table-bordered .table-striped }
| Name        | Scope                            | Description                         | Example                                  | Type      |
|-------------|----------------------------------|-------------------------------------|------------------------------------------|-----------|
| `playerId`  | required (if not send unitId)    | VideoLibrary player ID              | `'0151f985-fb1a-4f37-bb26-cfc62e43ec05'` | `string`  |
| `unitId`    | required (if not send playerId)  | Monetize unit ID                    | `'AACBTwsZVANd9NlB'`                     | `string`  |
| `vpaidMode` | optional                         | Vpaid wrapper; default: `false`.    | `true`                                   | `boolean` |
