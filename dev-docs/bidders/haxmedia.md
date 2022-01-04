---
layout: bidder
title: Haxmedia
description: Prebid Haxmedia Bidder Adapter
biddercode: haxmedia
usp_supported: true
schain_supported: true
media_types: banner, video, native
gdpr: true
pbjs: true
pbs: false
enable_download: false
pbjs_version_notes: not in 5.x
---

### Prebid.JS Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                              | Example    | Type      |
|----------------|----------|----------------------------------------------------------|------------|-----------|
| `placementId` | required | Placement Id will be generated on Haxmedia Platform. | `'0'`        | `string` |
