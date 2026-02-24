---
layout: bidder
title: SmartyAds
description: Prebid SmartyAds Bidder Adapter
biddercode: smartyads
gvl_id: 534
tcfeu_supported: true
usp_supported: true
gpp_sids: usnat, usstate_all, usp
coppa_supported: true
schain_supported: true
media_types: banner, video, native
safeframes_ok: true
deals_supported: true
fpd_supported: false
pbjs: true
pbs: true
multiformat_supported: will-bid-on-one
sidebarType: 1
---

### Note

The Example Bidding adapter requires setup before beginning. Please contact us at <sales@smartyads.com>

### Prebid.JS Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `sourceid`  | required | placement ID                 | `'0'`      | `string` |
| `host`      | required | const value, set to "prebid" | `'prebid'` | `string` |
| `accountid` | optional | publisher ID                 | `'1901'`   | `string` |
| `traffic`   | optional | Configures the mediaType that should be used. Values can be `'banner'`, `'native'` or `'video'` | `'banner'` | `string`|

### Prebid Server Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `host`      | required | Region id   | `'ns1'`       | `string` |
| `sourceid`  | required | Partner id  | `'smartyads'` | `string` |
| `accountid` | required | Endpoint id | `'hash'`      | `string` |
