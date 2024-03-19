---
layout: bidder
title: Lunamedia
description: Lunamedia Bidder Adapter
biddercode: lunamedia
media_types: banner, video
coppa_supported: true
tcfeu_supported: false
usp_supported: true
prebid_member: false
pbjs: false
pbs: true
schain_supported: true
floors_supported: true
multiformat_supported: will-bid-on-any
sidebarType: 1
---

### Prebid Server Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                 | Example                            | Type      |
|-------------|----------|---------------------------------------------|------------------------------------|-----------|
| `pubid`     | required | An id used to identify LunaMedia publisher. | `'d2b5502f83b65719d29ed4fa86e411ea'` | `string`  |
| `placement` | optional | A placement created on adserver.            | `'cs230510321b516f0eb9a10e5913d3b1'` | `string`  |
