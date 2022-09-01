---
layout: bidder
title: MediaGo
description: MediaGo Prebid Bidder Adapter
biddercode: mediago
media_types: banner
pbjs: true
floors_supported: true
pbjs_version_notes: not ported to 5.x, added back 7.13
---
### Modules

pubCommonId.js: We need you to include pubCommonId.js module,which is used to get prebid user commonid.It can better differentiating users to bid on ads.

### Note:

The MediaGo Bidding adapter requires setup before beginning. Please contact us at <ext_mediago_cm@baidu.com>

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `token`      | required | publisher token        | `'1e100887dd614b7f69fdd1360437'`    | `string` |
| bidfloor | recommend | Sets a floor price for the bid | 0.05 | float |
| placementId | recommend | The AD placement ID | 12341234 | string |
