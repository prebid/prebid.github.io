---
layout: bidder
title: Ozone Project
description: Prebid Ozone Project Bidder Adaptor
biddercode: ozone 
pbjs: true
media_types: banner
gdpr_supported: true
userIds: criteo, id5Id, tdid, identityLink, liveIntentId, parrableId, pubCommonId, lotamePanoramaId, sharedId, fabrickId
gvl_id: 524
deals_supported: true
schain_supported: true
coppa_supported: true
usp_supported: true
floors_supported: true
prebid_member: true

---

#### Bid Params

{: .table .table-bordered .table-striped }

| Name      | Scope    | Description               | Example    | Type     |
|-----------|----------|---------------------------|------------|----------|
| `siteId`    | required | The site ID from ozone.  | `"OZONENUK0001"` | `string` |
| `publisherId`    | required | The publisher ID.  | `"4204204201"` | `string` |
| `placementId`    | required | The placement ID.  | `"0420420421"` | `string` |
| `customData`     | optional | publisher key-values used for targeting | `[{"settings":{},"targeting":{"key1": "value1", "key2": "value2"}}], ` | `array` |
