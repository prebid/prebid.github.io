---
layout: bidder
title: COSMOS
description: Prebid COSMOS Bidder Adapter
pbjs: true
biddercode: cosmos
enable_download: false
pbjs_version_notes: not in 5.x
---

### Integration Note:

Cosmos bidder adapter requires setup and approval from the Cosmos team. Please reach out to your account manager for more information and to start using it.

### Bid params

{: .table .table-bordered .table-striped }

| Name                | Scope    | Description                           | Example      | Type      |
| ------------------- | -------- | ------------------------------------- | ------------ | --------- |
| `publisherId`       | required | The publisher ID from Cosmos          | `1001`       | `integer` |
| `tagId`             | optional | Identifier for specific ad placement  | `1001`       | `integer` |
| `bidFloor`          | optional | The minimum bid value                 | `1.07`       | `float`   |
