---
layout: bidder
title: BigoAd
description: Prebid BigoAd Bidder Adapter
biddercode: {bigoad}
usp_supported: true
coppa_supported: true
schain_supported: true
media_types: banner, video, native
---

### Registration

The BigoAd Bidding adapter requires setup before beginning. Please contact us at BigoAds@bigo.sg

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example    | Type     |
|---------------|----------|--------------|------------|----------|
| `sspid`       | required | Ssp ID       | `"123"`    | `string` |
| `host`        | required | host         | `"abc.com"`| `string` |