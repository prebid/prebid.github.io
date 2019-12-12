---
layout: bidder
title: TripleLift
description: Prebid TripleLift Bidder Adapter
hide: true
gdpr_supported: true
biddercode: triplelift
userIds: unifiedId/tradedesk
---

### Bid Params

{: .table .table-bordered .table-striped }

| Name            | Scope    | Description                                                                          | Example               | Type     |
|-----------------|----------|--------------------------------------------------------------------------------------|-----------------------|----------|
| `inventoryCode` | required | TripleLift inventory code for this ad unit (provided to you by your partner manager) | `'pubname_main_feed'` | `string` |
| `floor`         | optional | Bid floor                                                                            | `1.00`                | `float`  |
