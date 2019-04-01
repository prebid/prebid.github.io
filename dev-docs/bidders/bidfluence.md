---
layout: bidder
title: Bidfluence
description: Bidfluence Adaptor for Prebidjs
hide: true
biddercode: bidfluence
biddercode_longer_than_12: false
gdpr_supported: true
---

### bid params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description  | Example                                  | Type     |
|----------------|----------|--------------|------------------------------------------|----------|
| `placementId`     | required | Placement Id       | `'1000'` | `string` |
| `publisherId`        | required | Publisher Id | `'1000'` | `string` |
| `reservePrice` | optional | Floor price  | `'0.5"`                                  | `string` |
