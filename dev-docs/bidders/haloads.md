---
layout: bidder
title: Halo Ads
description: Halo Ads Bidder Adapter
biddercode: haloads
usp_supported: true
coppa_supported: true
schain_supported: true
media_types: banner, video, native
safeframes_ok: true
deals_supported: false
floors_supported: true
fpd_supported: false
userIds: all
pbjs: true
pbs: false
multiformat_supported: will-bid-on-any
sidebarType: 1
---


## Bid Params

{:.table .table-bordered .table-striped}
| Name          | Scope    | Description  | Example | Type     |
|---------------|----------|--------------|---------|----------|
| `placementId` | required | Placement Id | `'123'` | `string` |
| `accountId`   | required | Account Id   | `'456'` | `string` |

## Note

Both `placementId` or `accountId` are mandatory.
