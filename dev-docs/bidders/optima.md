---
layout: bidder
title: Optima
description: Prebid Optima Bidder Adapter
biddercode: optima
gvl_id: none
tcfeu_supported: false
dsa_supported: false
usp_supported: true
coppa_supported: true
schain_supported: true
dchain_supported: false
userIds: none
media_types: banner, video
deals_supported: true
floors_supported: true
fpd_supported: false
pbjs: false
pbs: true
pbs_app_supported: true
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: partial
privacy_sandbox: no
sidebarType: 1
---

## Note

The Optima adapter requires setup before beginning. Contact [tech@optima.tech](mailto:tech@optima.tech) to obtain a `supply_id`.

Optima serves in-app inventory only: requests with `site`, or with `app` missing `app.bundle`, are not sent. Impressions are grouped by `supply_id`, one request per key. Impression floors in other currencies are converted to USD; deal floors must be in USD, deals with other floor currencies are ignored. On an impression with both banner and video, Optima bids video.

OpenRTB blocking: `bcat`, `badv` and `battr` are honoured; `bapp` is not.

## Bid Params

{: .table .table-bordered .table-striped }

| Name        | Scope    | Description                                                                 | Example      | Type     |
|-------------|----------|-----------------------------------------------------------------------------|--------------|----------|
| `supply_id` | required | Supply key issued by Optima. 1–64 characters: letters, digits, `_` and `-`. | `'qr7m2xkd'` | `string` |
