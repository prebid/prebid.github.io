---
layout: bidder
title: iQM
description: Prebid iQM Bidder Adaptor
pbjs: true
biddercode: iqm
---


### Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                | Example                                  | Type      |
|---------------|----------|----------------------------|------------------------------------------|-----------|
| `publisherId` | required | The Publisher ID from iQM. | `'df5fd732-c5f3-11e7-abc4-cec278b6b50a'` | `string`  |
| `tagId`       | required | The Tag ID from iQM.       | `'1c5c9ec2-c5f4-11e7-abc4-cec278b6b50a'` | `string`  |
| `placementId` | required | The Placement ID from iQM. | `'50cc36fe-c5f4-11e7-abc4-cec278b6b50a'` | `string`  |
| `bidfloor`    | required | Bid floor                  | `0.50`                                   | `integer` |
