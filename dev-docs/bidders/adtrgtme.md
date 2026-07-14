---
layout: bidder
title: Adtarget.me
description: Prebid Adtarget.me bidder adapter
biddercode: adtrgtme
tcfeu_supported: false
gvl_id: none
usp_supported: true
gpp_sids: usnat, usp
coppa_supported: true
schain_supported: true
dchain_supported: false
media_types: banner, video, native
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: true
pbjs: true
pbs: false
pbs_app_supported: true
prebid_member: false
multiformat_supported: will-bid-on-any
sidebarType: 1
---

### Note

The Adtrgtme bidding adapter requires setup before beginning. Please contact us at <support@adtarget.me>

### Bid Params

| Name          | Scope    | Description                | Example                                  | Type              |
|---------------|----------|----------------------------|------------------------------------------|-------------------|
| `sid`         | required | Site ID                    | `"1234567890"`                           | `string`          |
| `zid`         | optional | Zone ID                    | `1234567890`                             | `string`/`number` |
| `bidOverride` | optional | Manual impression fallback | `{imp:{bidfloor:1.5,bidfloorcur:'USD'}}` | `object`          |
