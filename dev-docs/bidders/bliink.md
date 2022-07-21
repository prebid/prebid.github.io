---
layout: bidder
title: BLIINK
description: Prebid BLIINK Bidder Adaptor
pbjs: true
pbs: true
media_types: video, banner
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
| `imageUrl` | optional | The image url on which the ad is displayed in case of in-image ad. | `'https://image.png'` | `string` |
