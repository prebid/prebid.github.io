---
layout: bidder
title: BigoAd
description: Prebid BigoAd Bidder Adapter
biddercode: bigoad
tcfeu_supported: false
gvl_id: none
usp_supported: false
coppa_supported: true
gpp_sids: none
schain_supported: true
dchain_supported: false
userId: none
media_types: banner, video, native
safeframes_ok: false
deals_supported: false
floors_supported: false
fpd_supported: false
pbjs: false
pbs: true
pbs_app_supported: false
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: true
privacy_sandbox: no
---

### Registration

The BigoAd Bidding adapter requires setup before beginning. Please contact us at <BigoAds@bigo.sg>

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example    | Type     |
|---------------|----------|--------------|------------|----------|
| `sspid`       | required | Ssp ID       | `"123"`    | `string` |
| `host`        | required | host         | `"abc.com"`| `string` |
