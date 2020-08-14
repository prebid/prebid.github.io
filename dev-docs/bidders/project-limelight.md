---
layout: bidder
title: Project Limelight
description: Prebid Project Limelight Bidder Adaptor
pbjs: true
biddercode: project-limelight
aliasCode: projectLimeLight
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope      | Description                                                    | Example            |type|
| :-----------   | :--------- | :------------                                                  | :----------------- |:---|
| `host` | required | Ad network's RTB host | `'ads.project-limelight.com'` | `string` |
| `adUnitId` | required   | Ad Unit Id will be generated on Project Limelight Platform. | 0                        |integer|
| `adUnitType`      | required   | Type of Ad Unit ('video', 'banner')                                             | 'banner'                 |string|
