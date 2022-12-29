---
layout: bidder
title: LEMMA
description: Prebid Lemma Bidder Adapter
pbjs: true
biddercode: lemma
enable_download: false
pbjs_version_notes: not ported to 5.x
sidebarType: 1
---

### Integration Note:

Lemma bidder adapter requires setup and approval from the Lemma team. Please reach out to your account manager for more information and to start using it.

### Bid params

{: .table .table-bordered .table-striped }
| Name                | Scope    | Description                           | Example      | Type      |
| ------------------- | -------- | ------------------------------------- | ------------ | --------- |
| `pubId`       | required | The publisher ID from Lemma          | `1001`       | `integer` |
| `adunitId`             | required | Identifier for specific ad adunit  | `1001`       | `integer` |
| `bidFloor`          | optional | The minimum bid value                 | `1.07`       | `float`   |
