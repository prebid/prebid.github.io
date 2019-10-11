---
layout: bidder
title: SmartRTB
description: SmartRTB / smrtb.com Bidder Module
hide: true
biddercode: smartrtb
aliasCode: smrtb
biddercode_longer_than_12: false
gdpr_supported: true
media_types: banner, video (required publisher provided renderer)
userIds: unifiedId/pubCommonId/id5id/digitrust
---

### bid params

{: .table .table-bordered .table-striped }

| Name     | Scope    | Description | Example                            | Type     |
|----------|----------|-------------|------------------------------------|----------|
| `zoneId` | required |             | `z_261b6c7e7d4d4985393b293cc903d1` | `string` |
| `forceBid` | optional | Returns test bid | true | `boolean` |
