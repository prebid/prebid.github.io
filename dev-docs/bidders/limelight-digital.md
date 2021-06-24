---
layout: bidder
title: Limelight Digital
description: Prebid Limelight Digital Bidder Adaptor
pbjs: true
biddercode: limelightDigital
aliasCode: pll
media_types: video
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope      | Description                                                    | Example            |type|
| :-----------   | :--------- | :------------                                                  | :----------------- |:---|
| `host` | required | Ad network's RTB host | `'exchange.ortb.net` | `string` |
| `adUnitId` | required   | Ad Unit Id will be generated on Limelight Digital Platform. | 0                        |integer|
| `adUnitType`      | required   | Type of Ad Unit ('video', 'banner')                                             | 'banner'                 |string|
