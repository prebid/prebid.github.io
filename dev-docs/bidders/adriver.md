---
layout: bidder
title: adriver
description: Adriver adapter
biddercode: adriver
pbjs: true
bidder_supports_deals: true
userIds: sharedId, id5Id, uid2Id
getFloor: true
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                | Example               | Type      |
|---------------|----------|--------------------------------------------|-----------------------|-----------|
| `siteid`      | required | The publisher site ID                      | `216200`              | `integer` |
| `placementId` | required | Your placement ID (provided by undertone)  | `'55:test_placement'` | `string`  |
| `dealid`      | optional | Deal ID                                    | `'dealidTest'`        | `string`  |
