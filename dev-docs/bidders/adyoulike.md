---
layout: bidder
title: Adyoulike
description: Prebid Adyoulike Bidder Adaptor
pbjs: true
pbs: true
media_types: banner, video, native
biddercode: adyoulike
userIds: criteo, sharedId
gdpr_supported: true
gvl_id: 259
usp_supported: true
floors_supported: true
---

### Note:
The Adyoulike Header Bidding adaptor requires setup and approval from the Adyoulike team. Please reach out to your account manager or prebid@adyoulike.com for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                      | Example                              | Type     |
|-------------|----------|----------------------------------|--------------------------------------|----------|
| `placement` | required | The placement ID from Adyoulike. | `'194f787b85c829fb8822cdaf1ae64435'` | `string` |


Same 'placement' parameter can be used from either prebid JS or prebid server.
