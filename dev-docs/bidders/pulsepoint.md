---
layout: bidder
title: PulsePoint
description: Prebid PulsePoint Bidder Adaptor
biddercode: pulsepoint
tcfeu_supported: true
usp_supported: true
schain_supported: true
media_types: banner, video, native
userIds: all
pbjs: true
pbs: true
gvl_id: 81
sidebarType: 1
safeframes_ok: true
coppa_supported: true
floors_supported: true
pbs_app_supported: true
fpd_supported: true
ortb_blocking_supported: true
multiformat_supported: will-bid-on-one
---

### Prebid Server Note

{% include dev-docs/pbjs-adapter-required-for-pbs.md %}

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                           | Example                      | Type                |
|------------|----------|-------------------------------------------------------|------------------------------|---------------------|
| `cp`       | required | Publisher Id                                          | `12345`                      | `integer`           |
| `ct`       | required | Ad Tag Id                                             | `12345`                      | `integer`           |
| `battr`    | optional | Blocked Creative Attributes                           | `[ 1, 2, 5 ]`                | `array of integers` |
| `deals`    | required | Required for PMP requests. Array of OpenRTB Deal object.    | `[{ id: 'DEAL_ONE', bidfloor: 1.23 }, ...]`         | `array of objects`            |
