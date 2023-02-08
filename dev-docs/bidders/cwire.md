---
layout: bidder
title: C-WIRE
description: C-WIRE Prebid Bidder Adapter
pbjs: true
biddercode: cwire
gdpr_supported: false
usp_supported: false
schain_supported: false
userIds: uid2Id
enable_download: true
media_types: banner, video
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `pageId`      | required | C-WIRE page id        | `2453`    | `integer` |
| `placementId` | required | C-WIRE placement id   | `113244`  | `integer` |
| `cwcreative` | required | C-WIRE creative id to force   | `42`  | `integer` |
| `refgroups` | required | C-WIRE group name to force   | `'test-user'`  | `string` |
| `cwapikey` | required | C-WIRE API key for integration testing   | `'xxx-yyy-some-uuid'`  | `string` |
