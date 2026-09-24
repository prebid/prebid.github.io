---
layout: bidder
title: MagicBid
description: MagicBid Prebid Bidder Adapter
biddercode: magicbid
tcfeu_supported: false
dsa_supported: false
gvl_id: none
usp_supported: true
coppa_supported: true
gpp_sids: usnat, usstate_all, usp
schain_supported: true
dchain_supported: false
userId: all
media_types: banner, video
safeframes_ok: true
deals_supported: false
floors_supported: false
fpd_supported: false
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: false
privacy_sandbox: no
sidebarType: 1
---

## Note

The MagicBid adapter requires setup before beginning. Please contact us at [support@magicbid.ai](mailto:support@magicbid.ai) to receive your `host` and `adUnitId` values.

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                                    | Example                          | Type      |
| ------------- | -------- | ------------------------------------------------------------------------------ | -------------------------------- | --------- |
| `host`        | required | Publisher-specific RTB host provided by MagicBid (ends with .rtb-magicbid.ai)  | `'ads-2j0kac.rtb-magicbid.ai'`   | `string`  |
| `adUnitId`    | required | Ad Unit ID for this placement, provided by MagicBid                            | `631967104`                      | `integer` |
| `adUnitType`  | optional | Ad format: `'banner'` or `'video'`. Inferred from mediaTypes if omitted.       | `'banner'`                       | `string`  |
| `custom1`     | optional | Custom targeting parameter 1                                                   | `'sports'`                       | `string`  |
| `custom2`     | optional | Custom targeting parameter 2                                                   | `'en'`                           | `string`  |
| `custom3`     | optional | Custom targeting parameter 3                                                   | `'US'`                           | `string`  |
| `custom4`     | optional | Custom targeting parameter 4                                                   | `'premium'`                      | `string`  |
| `custom5`     | optional | Custom targeting parameter 5                                                   | `'homepage'`                     | `string`  |
