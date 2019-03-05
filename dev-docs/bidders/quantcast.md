---
layout: bidder
title: Quantcast
description: Prebid Quantcast Bidder Adaptor
hide: true
biddercode: quantcast
biddercode_longer_than_12: false
media_types: video
gdpr_supported: true
---

### bid params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                       | Example        | Type             |
|---------------|----------|-------------------------------------------------------------------|----------------|------------------|
| `publisherId` | required | The publisher id provided by Quantcast                            | `'LCOf845vzU'` | `string`         |
| `battr`       | optional | Array of Blocked creative attributes as per OpenRTB Spec List 5.3 | `[6,7]`        | `Array<integer>` |
