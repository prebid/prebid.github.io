---
layout: bidder
title: Clickio
description: Clickio Bidder Adapter
biddercode: clickio
pbjs: true
pbs: false
gvl_id: 1500
tcfeu_supported: true
usp_supported: true
gpp_sids: tcfeu, usnat
coppa_supported: true
schain_supported: true
userId: all
media_types: banner
floors_supported: true
safeframes_ok: true
multiformat_supported: will-bid-on-one
ortb_blocking_supported: false
privacy_sandbox: no
prebid_member: false
sidebarType: 1
---

## Note

The Clickio bid adapter connects to Clickio's demand platform using OpenRTB 2.5 standard. This adapter supports banner advertising.

The Clickio bidding adapter requires initial setup before use. Please contact us at [support@clickio.com](mailto:support@clickio.com).
To get started, simply replace the ``said`` with the ID assigned to you.

## Bid Params

| Name   | Scope    | Description  | Example   | Type     |
|--------|----------|--------------|-----------|----------|
| `said` | required | Site Area ID | `'11111'` | `string` |
