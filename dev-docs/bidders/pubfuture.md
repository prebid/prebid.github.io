---
layout: bidder
title: PubFuture
description: Prebid PubFuture Bidder Adapter
biddercode: pubfuture
tcfeu_supported: false
usp_supported: true
gpp_sids: usstate_all
coppa_supported: true
dsa_supported: true
schain_supported: true
media_types: banner, video
multiformat_supported: will-bid-on-one
safeframes_ok: true
deals_supported: false
floors_supported: true
fpd_supported: true
pbjs: true
pbs: false
sidebarType: 1
---

## Note

The PubFuture bidding adapter requires setup before beginning. Please contact
us at [support@pubfuture.com](mailto:support@pubfuture.com).

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                      | Example                      | Type     |
|---------------|----------|----------------------------------|------------------------------|----------|
| `adUnitId`    | required | PubFuture ad unit / placement id | `'691373631fa32d00272c7283'` | `string` |
| `publisherId` | optional | PubFuture publisher account id   | `'pub-app-id-1687'`          | `string` |
| `bidfloor`    | optional | CPM floor (USD)                  | `0.05`                       | `float`  |
