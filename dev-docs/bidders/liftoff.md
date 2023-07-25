---
layout: bidder
title: liftoff
description: Prebid liftoff Bidder Adapter
biddercode: liftoff
gvl_id: 667
gdpr_supported: true
coppa_supported: true
schain_supported: false
media_types: video
safeframes_ok: false
deals_supported: false
pbjs: false
pbs: true
pbs_app_supported: true
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
