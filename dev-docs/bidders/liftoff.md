---
layout: bidder
title: liftoff
description: Prebid liftoff Bidder Adapter
biddercode: liftoff
tcfeu_supported: false
gdpr_supported: true
usp_supported: false
gpp_supported: false
coppa_supported: true
schain_supported: true
dchain_supported: false
media_types: video
safeframes_ok: false
pbjs: false
pbs: true
pbs_app_supported: true
deals_supported: true
floors_supported: true
fpd_supported: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: partial
prebid_member: false
sidebarType: 1
---

### Note

The Liftoff Bidding adapter requires setup before beginning. Please contact us at <platform-ssp@liftoff.io>.

### Bid Params

{: .table .table-bordered .table-striped }
| Name                     | Scope    | Description             | Example     | Type     |
|--------------------------|----------|-------------------------|-------------|----------|
| bid_token                | required | super token             | 'aaaa123'   | string   |
| app_store_id             | optional | pub appstore id         | '5123400'   | string   |
| placement_reference_id   | optional | placement reference id  | '912340000' | string   |
