---
layout: bidder
title: SmartyAds
description: Prebid SmartyAds Bidder Adaptor
biddercode: smartyads
gdpr_supported: true
tcf2_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
userId: (list of supported vendors)
media_types: banner, video, native
safeframes_ok: true
bidder_supports_deals: true
pbjs: true
pbs: true
---

### Note:

The Example Bidding adapter requires setup before beginning. Please contact us at sales@smartyads.com 

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `host`      | required | Region id               | `'ns1'`    | `string` |
| `sourceid`      | required | Partner id | `'smartyads'`    | `string` |
| `accountid`      | required | Endpoint id | `'hash'`    | `string` |
