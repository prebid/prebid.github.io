---
layout: bidder
title: RhythmOne
description: Prebid RhythmOne Bidder Adaptor
pbjs: true
pbs: true
biddercode: rhythmone
media_types: video
gdpr_supported: true
schain_supported: true
gvl_id: 36
sidebarType: 1
enable_download: false
---

{: .alert.alert-warning :}
The rhythmone bidder is deprecated, and will be removed in a future release of Prebid.js and Prebid Server.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                 | Example | Type      |
|---------------|----------|---------------------------------------------|---------|-----------|
| `placementId` | required | The ID issued by RhythmOne to the publisher | `'34887'` | `string`  |
| `zone` | optional | Optional string issued by RhythmOne to the publisher | `'1r'` | `string` |
| `path` | optional | Optional string issued by RhythmOne to the publisher | `'mvo'` | `string` |
