---
layout: bidder
title: Aceex
description: Prebid Aceex Bidder Adapter
biddercode: aceex
gvl_id: 1387
tcfeu_supported: false
usp_supported: true
coppa_supported: true
schain_supported: true
media_types: banner, video, native
safeframes_ok: true
deals_supported: false
pbjs: true
pbs: true
multiformat_supported: will-bid-on-one
sidebarType: 1
---

### Note

The Example Bidding adapter requires setup before beginning. Please contact us at <tech@aceex.io>

### Aceex Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `bidfloor`    | required | General bids floor price                | `0.2`      | `number` |
| `internalKey` | required | Internal hash of publisher | `'1nn3p089Fs87m21'` | `string` |
| `publisherId` | required | Publisher ID               | `'2308'`   | `string` |
| `trafficType` | required | Configures the mediaType that should be used. Values can be `'banner'`, `'native'` or `'video'` | `'banner'` | `string`|
