---
layout: bidder
title: AdGlare Ad Server
description: Prebid Adapter for AdGlare Ad Server
pbjs: true
biddercode: adglare
media_types: banner
enable_download: false
pbjs_version_notes: not ported to 5.x
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                          | Example                              | Type     |
|-------------|----------|--------------------------------------|--------------------------------------|----------|
| `domain   ` | required | Your (white label) ad serving domain | `'try.engine.adglare.net'`           | `string` |
| `zID`       | required | The zone ID                          | `'475579334'`                        | `string` |
| `type`      | required | The zone type                        | `'banner'`                           | `string` |
