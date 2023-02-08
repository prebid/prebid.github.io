---
layout: bidder
title: craft
description: Prebid craft Bidder Adapter
biddercode: craft
media_types: banner
gdpr_supported: false
coppa_supported: false
usp_supported: false
schain_supported: false
pbjs: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                 | Example                          | Type     |
|---------------|----------|-----------------------------|----------------------------------|----------|
| `sitekey`     | required | The site ID from craft      | `'craft-prebid-example'`         | `string` |
| `placementId` | required | The placement ID from craft | `'1234abcd'`                     | `string` |
| `keywords`    | optional | Values can be empty.        | `keywords: ['stress', 'fear']`   | `array`  |
