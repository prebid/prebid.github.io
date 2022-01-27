---
layout: bidder
title: Sovrn
description: Prebid Sovrn Bidder Adaptor
pbjs: true
pbs: true
biddercode: sovrn
gdpr_supported: true
usp_supported: true
userIds: all
prebid_member: true
schain_supported: true
gvl_id: 13
floors_supported: true
fpd_supported: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description          | Example    | Type     |
|------------|----------|----------------------|------------|----------|
| `tagid`    | required | The sovrn Ad Tag ID  | `'315045'` | `string` |
| `bidfloor` | optional | Bid floor in dollars | `'0.04'`   | `string` |
