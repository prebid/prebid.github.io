---
layout: bidder
title: Onebidtech
description: Prebid Onebidtech Bidder Adaptor
pbjs: true
pbs: false
media_types: banner, video
biddercode: onebidtech
userIds: criteo, sharedId
tcfeu_supported: true
gvl_id: 149
usp_supported: true
floors_supported: true
schain_supported: true
sidebarType: 1
safeframes_ok: true
multiformat_supported: will-bid-on-one
---

## Note

The Onebidtech Header Bidding adaptor requires setup and approval from the Onebidtech team. Please reach out to your account manager or <support@onebidtech.com> for more information.

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                   | Example                              | Type     |
|---------------|----------|---------------------------------------------------------------|--------------------------------------|----------|
| `placementId` | required | The placement ID from Onebidtech.                             | `'354f787b85c829fb83g2cdaf1ae64435'` | `string` |
| `bidFloor`    | optional | Static floor, used when the Price Floors module returns none. | `0.5`                                | `number` |
| `currency`    | optional | Floor currency. Defaults to `USD`.                            | `'USD'`                              | `string` |
