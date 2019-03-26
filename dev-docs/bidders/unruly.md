---
layout: bidder
title: Unruly
description: Prebid Unruly Bidder Adaptor
hide: true
biddercode: unruly
biddercode_longer_than_12: false
media_types: native, video
gdpr_supported: true
---

### bid params

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description                                                                                 | Example                                  | Type      |
|-----------------|----------|---------------------------------------------------------------------------------------------|------------------------------------------|-----------|
| `siteId`        | required | The site ID from Unruly. This will be provided to you by your Unruly account manager        | `123456`                                 | `integer` |
| `targetingUUID` | required | The targeting UUID from Unruly. This will be provided to you by your Unruly account manager | `'766220b5-3d02-46c5-aa8b-2bc60c6f7418'` | `string`  |
