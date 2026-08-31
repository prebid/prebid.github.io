---
layout: bidder
title: Odeeo
description: Prebid Odeeo Bidder Adapter
biddercode: odeeo
tcfeu_supported: true
gvl_id: 1039
usp_supported: true
coppa_supported: true
media_types: banner, video, audio
pbjs: false
pbs: true
pbs_app_supported: true
schain_supported: true
floors_supported: true
prebid_member: false
multiformat_supported: will-bid-on-any
sidebarType: 1
---

## Registration

The Odeeo bid adapter requires setup before use.

Please contact <prebid@odeeo.io> to be onboarded as a Supply Partner and to receive your Supply Partner ID (`sp`) and verification code (`tk`).

## Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope    | Description                    | Example       | Type     |
|------|----------|--------------------------------|---------------|----------|
| `sp` | required | Odeeo Supply Partner ID        | `'123456789'` | `string` |
| `tk` | required | Odeeo-issued verification code | `'a1b2c3d4'`  | `string` |
