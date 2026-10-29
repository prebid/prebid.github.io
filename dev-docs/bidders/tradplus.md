---
layout: bidder
title: TradPlus
description: Prebid TradPlus Bidder Adapter
biddercode: tradplus
tcfeu_supported: false
usp_supported: true
gpp_supported: false
coppa_supported: true
schain_supported: true
dchain_supported: false
media_types: banner, video, native
safeframes_ok: false
pbjs: false
pbs: true
pbs_app_supported: true
deals_supported: true
floors_supported: true
fpd_supported: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: partial
prebid_member: false
sidebarType: 1
---

### Note

The TradPlus Bidding adapter requires setup before beginning. Please contact us at <tpxcontact@tradplus.com>.

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description    | Example     | Type     |
|----------------|----------|----------------|-------------|----------|
| `accountId`    | required | Account ID     | `'aaaa1'`   | `string` |
| `zoneId`       | optional | Zone ID        | `'51230'`   | `string` |
