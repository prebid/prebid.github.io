---
layout: bidder
title: Adfinity
description: Prebid Adfinity Bidder Adaptor
hide: true
biddercode: adfinity
media_types: banner, video, native
gdpr_supported: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                              | Example    | Type      |
|----------------|----------|----------------------------------------------------------|------------|-----------|
| `placement_id` | required | Placement Id will be generated on Adfinity Platform.     | `0`        | `integer` |
| `traffic`      | optional | Type traffic                                             | `'banner'` | `string`  |