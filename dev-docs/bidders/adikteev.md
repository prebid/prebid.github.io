---
layout: bidder
title: Adikteev
description: Prebid Adikteev Bidder Adaptor

top_nav_section: dev_docs
nav_section: reference

hide: true

biddercode: adikteev

biddercode_longer_than_12: false

---

### Bid params

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description                       | Example  | Type      |
|-----------------|----------|-----------------------------------|----------|-----------|
| `placementId`   | required | Identifies specific ad placement  |  `12345` | `int`     |
| `bidFloorPrice` | required | The bid floor                     |  `1.23`  | `decimal` |
