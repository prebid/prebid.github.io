---
layout: bidder
title: Gamoshi
description: Prebid Gamoshi Bidder Adaptor
biddercode: gamoshi
pbjs: true
pbs: true
media_types: banner, video
tcfeu_supported: true
tcf2_supported: true
schain_supported: true
usp_supported: true
userIds: id5Id, unifiedId
gvl_id: 644
sidebarType: 1
---

### Bid params

{: .table .table-bordered .table-striped }
| Name              | Scope    | Description                                                   | Example              | Type     |
|-------------------|----------|---------------------------------------------------------------|----------------------|----------|
| `supplyPartnerId` | required | ID of the supply partner you created in the Gamoshi dashboard. | `'12345'`            | `string` |
| `rtbEndpoint`     | optional | If you have a whitelabel account on Gamoshi, specify it here. | `'rtb.mybidder.com'` | `string` |

This adapter only requires you to provide your supply partner ID, and optionally your RTB endpoint, in order to request
bids from your Gamoshi account.
