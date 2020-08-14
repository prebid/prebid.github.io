---
layout: bidder
title: SmartRTB
description: SmartRTB / smrtb.com Bidder Module
biddercode: smartrtb
gdpr_supported: true
media_types: banner, video
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
pbjs: true
pbs: true
---

### bid params

{: .table .table-bordered .table-striped }

| Name     | Scope    | Description | Example                            | Type     |
|----------|----------|-------------|------------------------------------|----------|
| `zoneId` | required |             | `z_261b6c7e7d4d4985393b293cc903d1` | `string` |
| `forceBid` | optional | Returns test bid | true | `boolean` |
