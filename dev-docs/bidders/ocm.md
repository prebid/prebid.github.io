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
pbs: false
deals_supported: true
floors_supported: true
gvl_id: 1148
sidebarType: 1
---

## Bid params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                            | Example       | Type     |
|---------------|----------|----------------------------------------|---------------|----------|
| `publisherId` | required | The publisher id (e.g. "domain.tld")   | `example.com` | `string` |
| `placementId` | required | Domain-wide placement id               | `1234567890`  | `string` |

### Description

OCM header bidding adapter connects with OCM demand sources in order to fetch bids.
This adapter provides a solution for accessing Video, Display and Native demand.
