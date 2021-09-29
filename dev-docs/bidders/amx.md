---
layout: bidder
title: AMX RTB
description: AMX RTB Prebid Bid Adapter
hide: true
schain_supported: true
gdpr_supported: true
usp_supported: true
coppa_supported: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId, amxId
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
| `tagId`     | required | Tag ID                                                          | `'cHJlYmlkLm9yZw'`              | `string` |
| `testMode`  | optional | Activate 100% fill ads                                          | `true`                          | `boolean`|
| `adUnitId`  | optional | Ad Unit ID used in reporting. Will default to `bid.adUnitCode`  | `'sticky_banner'`               | `string` |

### Test Parameters

To enable 100% fill test ads, you can use the following `params`:

```javascript
{
  testMode: true,
  tagId: "cHJlYmlkLm9yZw"
}
```

This will produce a bid at $10 with a test creative.

Note that the `tagId` is case-sensitive. Do not use `cHJlYmlkLm9yZw` in production environments: this ID is for testing only.
