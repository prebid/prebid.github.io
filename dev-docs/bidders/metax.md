---
layout: bidder
title: MetaX
description: MetaX Prebid Bidder Adapter
biddercode: metax
tcfeu_supported: true
gvl_id: 1301
usp_supported: true
coppa_supported: true
gpp_sids: tcfeu, usp
schain_supported: true
dchain_supported: false
userIds: all
media_types: banner, video, native, audio
floors_supported: false
pbjs: false
pbs: true
prebid_member: false
multiformat_supported: will-bid-on-one
safeframes_ok: false
sidebarType: 1
---

### Note

The MetaX Bidding adapter requires setup before beginning. Please contact us at <adops@metaxsoft.com>

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example    | Type      |
| ------------- | -------- | --------------------- | ---------- | --------- |
| `publisherId` | required | MetaX's publisher ID. | `12345678` | `integer` |
| `adunit`      | required | MetaX's AdUnit.       | `223344`   | `integer` |
