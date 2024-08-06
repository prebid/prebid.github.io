---
layout: bidder
title: Geniee SSP
description: Geniee SSP Bidder Adapter
biddercode: ssp_geniee
userId: imuId
media_types: banner, native
safeframes_ok: false
floors_supported: true
multiformat_supported: will-bid-on-one
ortb_blocking_supported: true
sidebarType: 1
tcfeu_supported: false
gvl_id: none
usp_supported: false
coppa_supported: false
gpp_sids: none
schain_supported: false
dchain_supported: false
deals_supported: false
fpd_supported: false
pbjs: true
pbs: false
prebid_member: false
---
### Note

This is [Geniee](https://geniee.co.jp) Bidder Adapter for Prebid.js.
(This is Geniee *SSP* Bidder Adapter. The another adapter named "Geniee Bid Adapter" is Geniee *DSP* Bidder Adapter.)

Please contact us before using the adapter.

### Bid Params

{: .table .table-bordered .table-striped }
|     Name     |  Scope   |      Description                                |  Example  |   Type    |
|--------------|----------|-------------------------------------------------|-----------|-----------|
|  `zoneId`    | required |    Zone ID                                      |  `123456` | `integer` |
|  `currency`  | Optional | Currency setting (`'JPY'`(Default) or `'USD'`)  | `'JPY'`   | `string`  |
