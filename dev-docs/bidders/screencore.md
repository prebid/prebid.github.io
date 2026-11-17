---
layout: bidder
title: Screencore
description: Prebid Screencore Bidder Adaptor
biddercode: screencore
tcfeu_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
media_types: banner, video, native
safeframes_ok: true
deals_supported: true
pbjs: true
pbs: true
sidebarType: 1
floors_supported: true
prebid_member: false
fpd_supported: false
gvl_id: 1473
multiformat_supported: will-bid-on-one
ortb_blocking_supported: true
userIds: all
---

## Note

The Screencore Bidding adapter requires setup before beginning. Please contact us at [connect@screencore.io](mailto:connect@screencore.io).
Screencore will bid on first impression in request.

## Bid Params

### Prebid.js

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `sspPlacementId` | required | ssp placement id | `'id'` | `string` |

The legacy `placementId` and `endpointId` params are deprecated in Prebid.js; use `sspPlacementId` instead.

### Prebid Server (PBS-Go)

The PBS-Go Screencore adapter is available once [prebid-server#5005](https://github.com/prebid/prebid-server/pull/5005) is released.

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `sspPlacementId` | required | ssp placement id | `'id'` | `string` |
| `region` | required | target ssp region, one of `us`, `eu`, `asia` | `'us'` | `string` |

### Prebid Server (PBS-Java)

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `accountId` | required | account id | `'account'` | `string` |
| `placementId` | required | placement id | `'placement'` | `string` |
