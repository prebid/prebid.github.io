---
layout: bidder
title: adriver
description: Adriver adapter
biddercode: adriver
bidder_supports_deals: true
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                | Example             | Type      |
|---------------|----------|--------------------------------------------|---------------------|-----------|
| `siteid`      | required | The publisher site ID                      | `216200`            | `integer` |
| `placementId` | required | Your placement ID (provided by undertone)  | `'55:test_placement'` | `string`  |
| `bidfloor`    | optional | The minimum bid value desired              | `1`                 | `float`   |
| `dealid`      | optional | Deal ID                                    | `'dealidTest'`        | `string`  |
