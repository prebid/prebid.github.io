---
layout: bidder
title: TripleLift
description: Prebid TripleLift Bidder Adapter

top_nav_section: dev_docs
nav_section: reference
hide: true

biddercode: triplelift
biddercode_longer_than_12: false
---

### bid params

{: .table .table-bordered .table-striped }

| Name            | Scope    | Description                                                                          | Example               | Type     |
|-----------------|----------|--------------------------------------------------------------------------------------|-----------------------|----------|
| `inventoryCode` | required | TripleLift inventory code for this ad unit (provided to you by your partner manager) | `'pubname_main_feed'` | `string` |
| `floor`         | optional | Bid floor                                                                            | `1.00`                | `float`  |
