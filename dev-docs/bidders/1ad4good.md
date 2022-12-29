---
layout: bidder
title: 1ad4good
description: Prebid One Ad for Good(1ad4good.org) Bidder Adaptor
pbjs: true
biddercode: 1ad4good
enable_download: false
pbjs_version_notes: not ported to 5.x
sidebarType: 1
---

### Note:
This adapter is for displaying free ads for various not profits. You can find more info at [1ad4good.org])(http://1ad4good.org).

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description | Example | Type     |
|---------------|----------|-------------|---------|----------|
| `placementId` | required |  Meaningless, but required id          | `234234`   | `integer` |
| `cpm`         | optional | forces bidder to insert custom cpm bid            |   0.50      | `decimal`  |
