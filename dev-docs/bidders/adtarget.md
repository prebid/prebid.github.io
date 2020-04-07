---
layout: bidder
title: adtarget
description: Prebid adtarget Bidder Adaptor
biddercode: adtarget
hide: true
media_types: banner, video
gdpr_supported: true
schain_supported: true
usp_supported: true
userIds: id5Id, unifiedId
aliasCode: gamoshi
---

### Bid params

{: .table .table-bordered .table-striped }
| Name              | Scope    | Description                                                   | Example              | Type     |
|-------------------|----------|---------------------------------------------------------------|----------------------|----------|
| `supplyPartnerId` | required | ID of the supply partner you created in the adtarget dashboard. | `'12345'`            | `string` |
