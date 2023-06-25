---
layout: bidder
title: TrafficGate
description: Prebid TrafficGate Bidder Adaptor
pbs: true
pbjs: true
biddercode: trafficgate
media_types: banner, video, native, audio
gdpr_supported: true
pbs_app_supported: true
multiformat_supported: will-bid-on-any
usp_supported: true
schain_supported: false
coppa_supported: true
dchain_supported: false
deals_supported: true
floors_supported: false
fpd_supported: false
prebid_member: true
sidebarType: 1
---

### Note

The TrafficGate Bidding adapter requires setup before beginning. Please contact us at <support@bidscube.com>

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example     | Type     |
|---------------|----------|--------------|-------------|----------|
| `placementId` | required | Placement ID | `'12345'`   | `string` |
|---------------|----------|--------------|-------------|----------|
| `host`        | required | Host         | `'example'` | `string` |
