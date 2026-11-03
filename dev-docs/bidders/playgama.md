---
layout: bidder
title: Playgama
description: Prebid Playgama Bidder Adapter
biddercode: playgama
tcfeu_supported: true
usp_supported: true
gpp_supported: true
coppa_supported: false
gvl_id: none
schain_supported: true
dchain_supported: false
userIds: all
media_types: banner, video
safeframes_ok: true
floors_supported: true
fpd_supported: true
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-any
sidebarType: 1
---

### Note

The Playgama bidder adapter requires setup before beginning. Please contact <ads@playgama.com> for a publisher ID and ad unit IDs.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                                                | Example               | Type      |
|---------------|----------|--------------------------------------------------------------------------------------------|-----------------------|-----------|
| `publisherId` | required | Publisher ID issued by Playgama                                                            | `'playgama-test'`     | `string`  |
| `adUnitId`    | required | Ad unit ID issued by Playgama                                                              | `'banner-300x250'`    | `string`  |
| `env`         | optional | `'production'` (default) or `'staging'`, Playgama's own pre-production environment          | `'staging'`           | `string`  |

### Storage and external scripts

The adapter stores the Playgama user id returned by the SSP in the first-party cookie `_pgid` (90 days) through the Prebid `StorageManager`, when the publisher allows it with `pbjs.bidderSettings.playgama.storageAllowed = true`. Outstream video and interstitial bids are rendered by Playgama's own renderer scripts, loaded on demand from `https://playgama.com/prebid-renderers/`.
