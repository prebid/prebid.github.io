---
layout: bidder
title: Colombia
description: Prebid Colombia Bidder Adaptor
biddercode: colombia
media_types: banner, video, native
usp_supported: true
coppa_supported: true
gpp_supported: true
schain_supported: true
dchain_supported: true
floors_supported: true
userIds: all
prebid_member: true
pbjs: true
pbs: false
pbs_app_supported: false
fpd_supported: true
multiformat_supported: will-bid-on-one
---

### Disclosure

This adapter is known to use an HTTP 1 endpoint. Header bidding often generates multiple requests to the same host and bidders are encouraged to change to HTTP 2 or above to help improve publisher page performance via multiplexing.

### Prebid.Server Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                              | Example    | Type      |
|----------------|----------|----------------------------------------------------------|------------|-----------|
| `TagID` | optional | Placement Id will be generated on colombia SSP Platform. | `'0'`        | `string` |
| `groupId` | optional | Group Id will be generated on colombia SSP Platform. | `'0'`        | `string` |

You only need to use one parameter: either TagID or groupId

*For prebidJS parametres, look into colombiassp.md*
