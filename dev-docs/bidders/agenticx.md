---
layout: bidder
title: AgenticX
description: Prebid.js bidder adapter for AgenticX
biddercode: agenticx
redirect_from:
  - /dev-docs/bidders/adsmartx.html
media_types:
  - banner
  - video
  - audio
gdpr_supported: true
usp_supported: true
gpp_supported: true
user_sync: true
schain_supported: true
pbjs: true
sidebarType: 1
---

## Overview

AgenticX is a digital advertising platform that supports banner, video & audio ads through its Prebid.js adapter. The adapter uses OpenRTB standards for request and response formatting.

{% include alerts/alert_note.html content="AgenticX was formerly known as AdsmartX. The bidder code has been renamed from `adsmartx` to `agenticx`; existing integrations using `adsmartx` should be updated accordingly." %}

## Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Type   | Description                             | Example      |
|-------------|----------|--------|-----------------------------------------|--------------|
| `bidFloor`  | optional | string | Bid Floor                               | `'0.01'`     |
| `testMode`  | optional | string | Parameter to indicate prebid test mode  | `'1'`        |
| `sspId`     | optional | string | Supply Partner ID                       | `'111111'`   |
| `siteId`    | optional | string | Supply Partner Site ID                  | `'222222'`   |
