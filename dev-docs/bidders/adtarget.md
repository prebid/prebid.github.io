---
layout: bidder
title: adtarget
description: Prebid adtarget Bidder Adaptor
biddercode: gamoshi
hide: true
media_types: banner, video
gdpr_supported: true
userIds: unifiedId/tradedesk, id5Id
---

### Bid params

{: .table .table-bordered .table-striped }
| Name              | Scope    | Description                                                   | Example              | Type     |
|-------------------|----------|---------------------------------------------------------------|----------------------|----------|
| `supplyPartnerId` | required | ID of the supply partner you created in the adtarget dashboard. | `'12345'`            | `string` |
| `rtbEndpoint`     | optional | If you have a whitelabel account on adtarget, specify it here. | `'rtb.mybidder.com'` | `string` |

This adapter only requires you to provide your supply partner ID, and optionally your RTB endpoint, in order to request
bids from your adtarget account.
