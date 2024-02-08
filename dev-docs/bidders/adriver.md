---
layout: bidder
title: adriver
description: Adriver adapter
biddercode: adriver
pbjs: true
deals_supported: true
userIds: sharedId, id5Id, uid2Id, adriverId
floors_supported: true
sidebarType: 1
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                | Example               | Type      |
|---------------|----------|--------------------------------------------|-----------------------|-----------|
| `siteid`      | required | The publisher site ID                      | `216200`              | `integer` |
| `placementId` | required | Your placement ID (provided by undertone)  | `'55:test_placement'` | `string`  |
| `dealid`      | optional | Deal ID                                    | `'dealidTest'`        | `string`  |
