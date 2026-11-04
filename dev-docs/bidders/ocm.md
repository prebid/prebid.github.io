---
layout: bidder
title: OCM
description: Prebid OCM Bidder Adapter
biddercode: ocm
media_types: video,banner,native
tcfeu_supported: true
gpp_supported: true
userIds: criteo, id5Id, panoramaId, pubCommonId, unifiedId
schain_supported: true
dchain_supported: true
coppa_supported: true
usp_supported: true
safeframes_ok: false
prebid_member: true
multiformat_supported: will-bid-on-any
ortb_blocking_supported: partial
pbjs: true
pbs: true
pbs_app_supported: true
deals_supported: true
floors_supported: true
gvl_id: 1148
sidebarType: 1
---

## Bid params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                                                       | Example         | Type      |
|----------------|----------|---------------------------------------------------------------------------------------------------|-----------------|-----------|
| `publisherId`  | required | The publisher id (e.g. "domain.tld")                                                              | `"example.com"` | `string`  |
| `placementId`  | required | Domain-wide placement id                                                                          | `"1234567890"`  | `string`  |
| `tmaxBufferMs` | optional | (PBS only) Milliseconds deducted from `tmax` before the request is forwarded. Defaults to `250`.  | `300`           | `integer` |

### Prebid Server

**Prebid Server Note:** OCM is disabled by default. Hosts enable it by setting
`adapters.ocm.disabled` to `false` (or the environment variable
`PBS_ADAPTERS_OCM_DISABLED=false`).

The Prebid Server adapter takes the same two parameters, plus the optional
`tmaxBufferMs`. `placementId` is sent as the impression's stored request id, and
`publisherId` is sent as the request-level publisher id, so every impression in a single
request must use the same `publisherId`.

Both ids must be JSON strings, even when they look numeric: `"placementId": "1234567890"`,
not `"placementId": 1234567890`. Prebid Server checks bid params against the adapter's
schema, and a mismatch rejects the whole auction request, not just the OCM bid.

The OCM endpoint runs its own auction, so the adapter forwards a shorter `tmax` to give the
response time to arrive before the host's deadline. `tmaxBufferMs` sets how much shorter.
`0` turns the buffer off. When impressions set different values, the largest one is used.

### Description

OCM header bidding adapter connects with OCM demand sources in order to fetch bids.
This adapter provides a solution for accessing Video, Display and Native demand.
