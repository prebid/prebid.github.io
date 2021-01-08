---
layout: bidder
title: Ozone Project
description: Prebid Ozone Project Bidder Adaptor
biddercode: ozone 
pbjs: true
media_types: banner
gdpr_supported: true
userIds: criteo, id5Id, identityLink, liveIntentId, parrableId, pubCommonId
---

#### Bid Params

{: .table .table-bordered .table-striped }

| Name      | Scope    | Description               | Example    | Type     |
|-----------|----------|---------------------------|------------|----------|
| `siteId`    | required | The site ID from ozone.  | `"OZONENUK0001"` | `string` |
| `publisherId`    | required | The publisher ID.  | `"4204204201"` | `string` |
| `placementId`    | required | The placement ID.  | `"0420420421"` | `string` |
| `customData`     | optional | publisher key-values used for targeting | `[{"settings":{},"targeting":{"key1": "value1", "key2": "value2"}}], ` | `array` |
| `lotameData`     | optional | lotame key-values used for targeting | `{"key1": "value1", "key2": "value2"}` | `string` |
