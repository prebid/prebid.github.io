---
layout: bidder
title: Gamoshi
description: Prebid Gamoshi Bidder Adaptor
biddercode: gamoshi
pbjs: true
pbs: true
media_types: banner, video
gdpr_supported: false
tcf2_supported: false
schain_supported: true
usp_supported: true
userIds: id5Id, unifiedId
gvl_id: 644
sidebarType: 1
---

Note: This bidder appears to only consider gdprApplies if a consent string is available.. This may result in some incorrect GDPR processing, such as when the consent string is not yet available but the publisher has decided GDPR always applies. See https://github.com/prebid/Prebid.js/issues/7775

### Bid params

{: .table .table-bordered .table-striped }
| Name              | Scope    | Description                                                   | Example              | Type     |
|-------------------|----------|---------------------------------------------------------------|----------------------|----------|
| `supplyPartnerId` | required | ID of the supply partner you created in the Gamoshi dashboard. | `'12345'`            | `string` |
| `rtbEndpoint`     | optional | If you have a whitelabel account on Gamoshi, specify it here. | `'rtb.mybidder.com'` | `string` |

This adapter only requires you to provide your supply partner ID, and optionally your RTB endpoint, in order to request
bids from your Gamoshi account.
