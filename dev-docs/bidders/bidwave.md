---
layout: bidder
title: BidWave
description: Prebid BidWave Bidder Adapter
biddercode: bidwave
pbjs: false
pbs: true
pbs_app_supported: true
media_types: banner, video
userIds: all
fpd_supported: true
tcfeu_supported: false
gvl_id: none
usp_supported: true
coppa_supported: true
schain_supported: true
dchain_supported: false
safeframes_ok: true
deals_supported: false
floors_supported: true
prebid_member: false
ortb_blocking_supported: true
multiformat_supported: will-bid-on-one
privacy_sandbox: no
sidebarType: 1
---

### Note

The BidWave bidder adapter requires setup before beginning. Please contact <hello@bidwave.net> for onboarding.

BidWave bids in USD. Prebid Server sends BidWave requests in USD and converts bid floors to USD when currency conversion is configured.

### Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                    | Example                                  | Type     |
|:--------------|:---------|:-------------------------------|:-----------------------------------------|:---------|
| `publisherId` | required | BidWave publisher company UUID | `'11111111-1111-4111-8111-111111111111'` | `string` |
