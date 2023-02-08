---
layout: bidder
title: Go2Net
description: Prebid Go2Net Bidder Adaptor
pbjs: true
biddercode: go2net
aliasCode: admixer
media_types: video
sidebarType: 1
---

### bid params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                                                                    | Example                                | Type     |
|---------------|----------|----------------------------------------------------------------------------------------------------------------|----------------------------------------|----------|
| `zone`        | required | The unique identifier of the ad placement. Could be obtained from the Go2Net UI or from your account manager.  | "e5ff8e48-4bd0-4a2c-9236-55530ab8981d" | `string` |
| `kvTargeting` | optional | Key/Value - a pair of the unique values that will be used for the custom targeting option.                     | {key1: value2, key2: value2}           | `object` |
