---
layout: bidder
title: Gamoshi
description: Prebid Gamoshi Bidder Adaptor
biddercode: gamoshi
biddercode_longer_than_12: false
hide: true
media_types: banner, video
gdpr_supported: true
---

### Bid params

{: .table .table-bordered .table-striped }
| Name              | Scope    | Description                                                   | Example              | Type     |
|-------------------|----------|---------------------------------------------------------------|----------------------|----------|
| `supplyPartnerId` | required | ID of the supply partner you created in the Gamoshi dashboard. | `'12345'`            | `string` |
| `rtbEndpoint`     | optional | If you have a whitelabel account on Gamoshi, specify it here. | `'rtb.mybidder.com'` | `string` |

This adapter only requires you to provide your supply partner ID, and optionally your RTB endpoint, in order to request
bids from your Gamoshi account.
