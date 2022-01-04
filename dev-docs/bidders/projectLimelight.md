---
layout: bidder
title: Project Limelight
description: Prebid Project Limelight Bidder Adaptor
pbjs: true
biddercode: project-limelight
aliasCode: projectLimeLight
media_types: video
enable_download: false
pbjs_version_notes: not in 5.x
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope      | Description                                                    | Example            |type|
| :-----------   | :--------- | :------------                                                  | :----------------- |:---|
| `host` | required | Ad network's RTB host | `'exchange.ortb.net'` | `string` |
| `adUnitId` | required   | Ad Unit Id will be generated on Limelight Digital Platform. | 0                        |integer|
| `adUnitType`      | required   | Type of Ad Unit (`'video'`, `'banner'`)                                             | `'banner'`                 |string|
