---
layout: bidder
title: SmartyAds
description: Prebid SmartyAds Bidder Adaptor
biddercode: smartyads
gvl_id: 534
gdpr_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
media_types: banner, video, native
safeframes_ok: true
deals_supported: true
fpd_supported: false
pbjs: true
pbs: true
multiformat_supported: will-bid-on-one
---

### Note:

The Example Bidding adapter requires setup before beginning. Please contact us at sales@smartyads.com 

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `placementId` | required (for prebid.js) | placement Id | `'0'` | `string` |
| `host`      | required (for prebid-server) | Region id               | `'ns1'`    | `string` |
| `sourceid`      | required  (for prebid-server) | Partner id | `'smartyads'`    | `string` |
| `accountid`      | required  (for prebid-server) | Endpoint id | `'hash'`    | `string` |
| `traffic`     | optional (for prebid.js) | Configures the mediaType that should be used. Values can be `banner`, `native` or `video` | `native` | `string` 
