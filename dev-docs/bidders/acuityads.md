---
layout: bidder
title: AcuityAds
description: Prebid AcuityAds Bidder Adaptor
biddercode: acuityads
gdpr_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
userId: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
media_types: banner, video, native
safeframes_ok: true
deals_supported: true
pbjs: false
pbs: true
---

### Note:

The Example Bidding adapter requires setup before beginning. Please contact us at rafi.babler@acuityads.com

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `host`      | required | Region id               | `'ep1'`    | `string` |
| `accountid`      | required | Endpoint id | `'hash'`    | `string` |
