---
layout: bidder
title: Matterfull RTB
description: Matterfull RTB Prebid Server Adapter
biddercode: matterfullrtb
tcfeu_supported: false
dsa_supported: false
usp_supported: false
coppa_supported: true
schain_supported: true
floors_supported: true
media_types: banner, video
userIds: none
prebid_member: false
safeframes_ok: false
deals_supported: true
pbjs: false
pbs: true
pbs_app_supported: true
fpd_supported: false
ortb_blocking_supported: false
multiformat_supported: will-not-bid
---

Matterfull RTB is a separately provisioned direct OpenRTB integration.

## Prebid Server Bid Params

{: .table .table-bordered .table-striped }

| Name  | Scope    | Description                    | Example                | Type     |
|-------|----------|--------------------------------|------------------------|----------|
| `pid` | required | Matterfull RTB publisher token | `LUN2gcJFHRwysZVTm8p3` | `string` |
