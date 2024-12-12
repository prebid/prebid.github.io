---
layout: bidder
title: EClickAds
description: EClickAds Bidder Adaptor
biddercode: eclickads
media_types: native
sidebarType: 1
pbjs: true
pbs: false
tcfeu_supported: false
usp_supported: false
coppa_supported: false
schain_supported: false
dchain_supported: false
safeframes_ok: false
deals_supported: false
floors_supported: false
prebid_member: false
ortb_blocking_supported: false
fpd_supported: true
multiformat_supported: will-bid-on-one
---

### Note

The EClickAds adapter requires setup and approval from the EClick Team. Please contact us via <sales@eclick.vn> for detail.

### Bid params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description    | Example   | Type     |
|-------|----------|----------------|-----------|----------|
| `zid` | required | The Zone Id    | `'7096'`  | `string` |

### First Party Data

Publishers should use the `ortb2` method of setting First Party Data. The following fields are supported:

- ortb2.site.ext.data.*
