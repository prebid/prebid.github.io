---
layout: bidder
title: VideoByte
description: Prebid VideoByte Bidder Adaptor
pbjs: true
biddercode: videobyte
media_types: video
gdpr_supported: true
usp_supported: true
schain_supported: true
---

### Note:

VideoByte adapter only supports video ads.

### Bid Params

{: .table .table-bordered .table-striped }
| Name    | Scope    | Description  | Example  | Type     |
|---------|----------|--------------|----------|----------|
| `pubId` | required | Publisher ID | `'vb12345'` | `string` |
| `placementId` | optional | Placement ID | `'1234567'` | `string` |
| `nid` | optional | Network ID | `'1234'` | `string` |
