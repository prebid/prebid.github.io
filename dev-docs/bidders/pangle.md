---
layout: bidder
title: Pangle
description: Prebid Pangle Bidder Adapter
biddercode: pangle
tcfeu_supported: false
coppa_supported: true
schain_supported: false
media_types: banner, video, native
safeframes_ok: false
deals_supported: false
pbjs: false
pbs: true
pbs_app_supported: true
prebid_member: false
sidebarType: 1
---

### Note

The Pangle Bidding adapter requires setup before beginning. Please contact us at <pangle_dsp@bytedance.com>.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                           | Example     | Type     |
|---------------|----------|-------------------------------------------------------|-------------|----------|
| token         | required | access token                                          | 'aaaa123'   | string   |
| appid         | optional | app id (must be used in conjunction with placementid) | '5123400'   | string   |
| placementid   | optional | placement id (must be used in conjunction with appid) | '912340000' | string   |
