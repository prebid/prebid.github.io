---
layout: bidder
title: VideoByte
description: Prebid VideoByte Bidder Adaptor
pbjs: true
pbs: true
biddercode: videobyte
media_types: display, video
gdpr_supported: true
usp_supported: true
schain_supported: true
sidebarType: 1
---

### Note

The VideoByte Prebid.js client adapter only supports video ads while our Prebid Server adapter supports both display and video.

See [Videobyte Prebid Client Documentation](https://videobyte.readme.io/reference/vbx-integration-prebid-client)
for more details about Prebid Client integration.

See [Videobyte Prebid Server Documentation](https://videobyte.readme.io/reference/vbx-integration-prebid-server)
for more details about Prebid Server integration.

### Bid Params

{: .table .table-bordered .table-striped }
| Name    | Scope    | Description  | Example  | Type     |
|---------|----------|--------------|----------|----------|
| `pubId` | required | Publisher ID | `'vb12345'` | `string` |
| `placementId` | optional | Placement ID | `'1234567'` | `string` |
| `nid` | optional | Network ID | `'1234'` | `string` |
