---
layout: bidder
title: AdyoulikeOW
description: Prebid Adyoulike OW Bidder Adaptor
pbjs: true
pbs: true
media_types: banner, video
biddercode: adyoulikeow
userIds: criteo, sharedId
tcfeu_supported: true
gvl_id: 259
usp_supported: true
floors_supported: true
schain_supported: true
sidebarType: 1
---

### Note

The Adyoulike OW Header Bidding adaptor requires setup and approval from the Adyoulike team. Please reach out to your account manager or <prebid-owayl@adyoulike.com> for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|-------------|----------|----------------------------------|--------------------------------------|----------|
| `placement` | required | The placement ID from Adyoulike. | `'354f787b85c829fb83g2cdaf1ae64435'` | `string` |

Same 'placement' parameter can be used from either prebid JS or prebid server.
