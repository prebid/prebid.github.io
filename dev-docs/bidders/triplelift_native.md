---
layout: bidder
title: TripleLift Native
description: Prebid TripleLift Native Bidder Adapter
biddercode: triplelift_native
gdpr_supported: true
tcf2_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
floors_supported: true
media_types: banner, video, native
userIds: criteo, identityLink, unifiedId
prebid_member: true
safeframes_ok: true
deals_supported: true
pbjs: true
pbs: true
pbs_app_supported: true
gvl_id: 28
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description            | Example | Type     |
|------------|----------|------------------------|---------|----------|
| inventoryCode | required | TripleLift inventory code for this ad unit (provided to you by your partner manager) | 'code1' | string |
| floor | optional | the bid floor, in usd | 1.2 | number |
