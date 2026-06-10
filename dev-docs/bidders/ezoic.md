---
layout: bidder
title: Ezoic
description: Prebid Ezoic Bidder Adapter
biddercode: ezoic
tcfeu_supported: true
gvl_id: 347
usp_supported: true
gpp_sids: tcfeu, usp
coppa_supported: false
schain_supported: true
dchain_supported: false
media_types: banner
safeframes_ok: false
deals_supported: false
floors_supported: true
fpd_supported: true
pbjs: false
pbs: true
pbs_app_supported: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: false
privacy_sandbox: no
sidebarType: 1
---

### Registration

The Ezoic bidder adapter requires approval before use. Bids are returned
only for publisher domains that have been registered and approved by
Ezoic; requests for unapproved inventory receive no-bid responses.
Contact <prebid@ezoic.com> to get set up before adding the bidder.

### Bid Params

The Ezoic adapter requires no parameters.

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example   | Type     |
|---------------|----------|--------------|-----------|----------|
| `placementId` | optional | Placement ID | `'11111'` | `string` |
