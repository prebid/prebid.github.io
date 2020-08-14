---
layout: bidder
title: ConnectAd
description: ConnectAd Prebid Adaptor
biddercode: connectad
media_types: banner
gdpr_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
userIds: id5Id, liveIntentId, parrableId, pubCommonId, unifiedId
prebid_member: true
tcf2_supported: true
pbjs: true
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                    | Example | Type      |
|-------------|----------|--------------------------------|---------|-----------|
| `siteId`    | required | The site ID from ConnectAd.    | 12345   | integer   |
| `networkId` | required | The network ID from ConnectAd. | 10047   | integer   |
| `floorprice`| optional | Requested Floorprice           | 0.15    | integer   |
