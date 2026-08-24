---
layout: bidder
title: SMB
description: SMB Bidder Adapter
biddercode: SMB
usp_supported: true
coppa_supported: true
schain_supported: true
media_types: banner, video, native
safeframes_ok: true
deals_supported: false
floors_supported: true
fpd_supported: false
pbjs: true
pbs: true
pbs_app_supported: true
multiformat_supported: will-bid-on-any
---


## Bid Params

{:.table .table-bordered .table-striped}
| Name          | Scope    | Description  | Example | Type     |
|---------------|----------|--------------|---------|----------|
| `placementId` | optional | Placement Id | `'0'`   | `string` |
| `endpointId`  | optional | Endpoint Id  | `'0'`   | `string` |

## Note

For the prebid server and prebid.js you only need to use one parameter: either `placementId` or `endpointId`.
