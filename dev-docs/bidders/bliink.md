---
layout: bidder
title: BLIINK
description: Prebid BLIINK Bidder Adaptor
pbjs: true
pbs: true
media_types: video, banner, native
biddercode: bliink
gdpr_supported: true
usp_supported: false
---

### Note:
The BLIINK Header Bidding adaptor requires setup and approval from the BLIINK team. Please reach out to your account manager for more informations.

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                      | Example                              | Type     |
|-------------|----------|----------------------------------|--------------------------------------|----------|
| `tagId` | required | The TagID from BLIINK. | `'32'` | `string` |
| `placement` | required | The placement from BLIINK. | `'video'` | `string` |


Same 'placement' parameter can be used from either prebid JS or prebid server.
