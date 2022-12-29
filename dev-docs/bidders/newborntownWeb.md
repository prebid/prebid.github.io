---
layout: bidder
title: newborntownWeb
description: Prebid newborntownWeb Bidder Adaptor
pbjs: true
biddercode: newborntownWeb
enable_download: false
pbjs_version_notes: not ported to 5.x
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description | Example | Type     |
|---------------|----------|-------------|---------|----------|
| `publisher_id` | required |  Publisher ID which is obtained from sfp.solomath.com    | `'1238122'`   | `string` |
| `slot_id` | required |  Ad Slot ID which is obtained from sfp.solomath.com         | `'123123'`   | `string` |
| `bidfloor` | required |  As a min CPM of this inventory sold         | `0.2`   | `float` |
