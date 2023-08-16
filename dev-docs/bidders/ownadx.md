---
layout: bidder
title: OwnAdX
description: Prebid OwnAdX Bidder Adaptor
biddercode: ownadx
tcfeu_supported: false
usp_supported: false
coppa_supported: false
gpp_supported: false
schain_supported: false
dchain_supported: false
userId:
media_types: banner, video
safeframes_ok: false
deals_supported: false
floors_supported: true
fpd_supported: false
pbjs: false
pbs: true
pbs_app_supported: true
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: false
---

### Note:

The OwnAdX Bidding adapter requires setup before beginning. Please contact us at support@techbravo.com

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example                    | Type      |
|---------------|----------|-----------------------|----------------------------|-----------|
| `sspId`       | required | Supply side ID        | `'1816w0'`                 | `string`  |
| `seatId`      | required | Seat Id               | `'4'`                      | `string`  |
| `tokenId`     | required | Token Id              | `'QjBZdHs6bhFHBT1nd1AJ'`   | `string`  |
