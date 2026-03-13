---
layout: bidder
title: AdSmartX
description: Prebid.js bidder adapter for AdSmartX
biddercode: adsmartx
media_types:
  - banner
  - video
gdpr_supported: true
usp_supported: true
gpp_supported: true
user_sync: true
schain_supported: true
pbjs: true
pbs: true
---

### Overview

AdSmartX is a digital advertising platform that supports banner and video ads through its Prebid.js adapter. The adapter uses OpenRTB standards for request and response formatting.

### Bid Params

{: .table .table-bordered .table-striped }
| Name         | Scope              | Type             | Description                                | Example                 |
|--------------|--------------------|------------------|--------------------------------------------|-------------------------|     
| `bidFloor`   | optional           | string           | Bid Floor                                  | `'0.01'`|
| `testMode`   | optional           | string           | Parameter to indicate prebid test mode                                  | `'1'`|
| `sspId`      | optional           | string           | Supply Partner ID                                  | `'111111'`|
| `siteId`      | optional           | string           | Supply Partner Site ID                                  | `'222222'`|
