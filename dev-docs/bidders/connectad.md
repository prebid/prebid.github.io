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
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
prebid_member: true
safeframes_ok: true
floors_supported: true
pbjs: true
pbs: true
gvl_id: 138
sidebarType: 1
---

### Prebid Server Note

Please reach out to your ConnectAd Account Manager before configuring the S2S adapter for approval and setup.

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                    | Example | Type      |
|-------------|----------|--------------------------------|---------|-----------|
| `siteId`    | required | The site ID from ConnectAd.    | 12345   | integer   |
| `networkId` | required | The network ID from ConnectAd. | 10047   | integer   |
| `bidfloor`  | optional | Requested Floorprice           | 0.15    | number    |
