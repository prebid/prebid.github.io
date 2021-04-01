---
layout: bidder
title: AMX RTB
description: AMX RTB Prebid Bid Adapter
hide: true
schain_supported: true
gdpr_supported: true
usp_supported: true
coppa_supported: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
biddercode: amx
safeframes_ok: true
media_types: banner, video
pbjs: true
pbs: true
pbs_app_supported: true
gvl_id: 737
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                     | Example                         | Type     |
|-------------|----------|-----------------------------------------------------------------|---------------------------------|----------|
| `testMode`  | optional | Activate 100% fill ads                                          | `true`                          | `boolean`|
| `tagId`     | optional | Tag ID                                                          | `'cHJlYmlkLm9yZw'`              | `string` |
| `adUnitId`  | optional | Ad Unit ID used in reporting. Will default to `bid.adUnitCode`  | `'sticky_banner'`               | `string` |

### Test Parameters

To enable 100% fill test ads, you can use the following `params`:

```javascript
{
  testMode: true,
  tagId: "cHJlYmlkLm9yZw"
}
```

Note that the `tagId` is case-sensitive. This will produce a bid at $10 with a test creative.
