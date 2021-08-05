---
layout: bidder
title: Bidfluence
description: Bidfluence Adaptor for Prebidjs
pbjs: true
biddercode: bidfluence
gdpr_supported: true
pbjs_version_notes: not in 5.x
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description  | Example                                  | Type     |
|----------------|----------|--------------|------------------------------------------|----------|
| `placementId`     | required | Placement Id       | `'1000'` | `string` |
| `publisherId`        | required | Publisher Id | `'1000'` | `string` |
| `reservePrice` | optional | Floor price  | `'0.5"`                                  | `string` |
