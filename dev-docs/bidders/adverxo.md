---
layout: bidder
title: Adverxo
description: Prebid Adverxo Bidder Adapter
pbjs: true
pbs: true
pbs_app_supported: true
biddercode: adverxo
userIds: 
media_types: banner, native, video
schain_supported: true
dchain_supported: false
fpd_supported: true
ortb_blocking_supported: true
floors_supported: true
multiformat_supported: will-bid-on-any
sidebarType: 1
---

### Note

The Adverxo Bidding adapter requires setup and approval before beginning. Please reach out to <prebid@adverxo.com> for more details.

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example                   | Type     |
|----------|----------|-----------------------|---------------------------|----------|
| `host`   | required | Ad network host | `'prebidTest.adverxo.com'` | `string` |
| `adUnitId`   | required | Unique identifier for the ad unit in Adverxo platform. | `1` | `integer` |
| `auth`       | required | Authentication token provided by Adverxo platform for the AdUnit. | `'61336e75e414c77c367eq5c47c2599ce80a8032b'` | `string` |
