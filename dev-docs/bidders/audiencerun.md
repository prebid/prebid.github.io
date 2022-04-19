---
layout: bidder
title: AudienceRun
description: Prebid AudienceRun Bidder Adaptor
pbjs: true
biddercode: audiencerun
media_types: banner
gvl_id: 944
gdpr_supported: true
usp_supported: true
schain_supported: true
safeframes_ok: false
prebid_member: false
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, pubProvidedId, sharedId, unifiedId
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description | Example | Type     |
|---------------|----------|-------------|---------|----------|
| `zoneId`      | required |             |         | `string` |

### Description

Module that connects to AudienceRun demand sources.

Use `audiencerun` as bidder.

`zoneId` is required and must be 10 alphanumeric characters.

### AdUnits configuration example
```
    var adUnits = [{
      code: 'test-div',
      sizes: [[300, 600]],
      bids: [{
          bidder: 'audiencerun',
          params: { 
              zoneId: 'xtov2mgij0'
          }
      }]
    }];
```
