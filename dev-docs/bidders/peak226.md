---
layout: bidder
title: Peak226
description: Prebid Peak226 Bidder Adapter
biddercode: peak226
sidebarType: 1
pbjs: false
pbs: true
pbs_app_supported: true
prebid_member: false
media_types: banner, video, native
multiformat_supported: will-bid-on-any
gvl_id: 1202
tcfeu_supported: true
usp_supported: true
gpp_supported: true
gpp_sids: tcfeu, tcfca, usnat, usstate_all, usp
coppa_supported: true
schain_supported: true
floors_supported: true
fpd_supported: true
deals_supported: true
dchain_supported: false
ortb_blocking_supported: true
---

## Overview

```text
Module Name: Peak226 Bidder Adapter
Module Type: Bidder Adapter
Maintainer: support@edge226.com
```

## Description

The Peak226 adapter connects Prebid Server to the Peak226 SSP (Edge226 Ltd) for **banner**,
**video** and **native** demand, on both `site` and `app` traffic. It speaks OpenRTB 2.6 and
forwards standard signals — first-party data, price floors, `user.eids`, supply chain
(`schain`), deals (`imp.pmp`), blocking (`bcat`, `badv`, `bapp`, `battr`) and consent
(TCF EU, US Privacy, GPP, COPPA) — from the incoming request with no extra configuration.

Requests are routed to a per-data-center endpoint (US, EU or JP).

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                                        | Example       | Type     |
|---------------|----------|------------------------------------------------------------------------------------|---------------|----------|
| `publisherId` | required | Your Peak226 publisher/account ID.                                                 | `'pub-123'`   | `string` |
| `placementId` | required | Placement ID for this impression. Sent as `imp.tagid`.                             | `'plc-456'`   | `string` |
| `region`      | optional | Data center to send the request to: `'us'`, `'eu'` or `'jp'`. Defaults to `'us'`.  | `'eu'`        | `string` |

## Notes

- **Requests are split per region.** `region` selects a data center, so when the impressions in
  a single request mix regions the adapter emits one outgoing request per distinct region — each
  carrying only its own impressions — rather than routing everything to the first impression's
  region. Regions are requested in first-seen order, and each region group resolves its own
  effective `publisherId`.
- **Multiformat impressions are supported.** Banner, video and native may be declared on the
  same impression; all declared formats are forwarded and Peak226 may bid on any of them. No
  format is dropped and there is no preferred-format selection.
- **`${AUCTION_PRICE}` is expanded by the adapter.** Peak226 returns the OpenRTB
  `${AUCTION_PRICE}` macro in `adm` (and `nurl`) as its counting mechanism and relies on the
  demand-side adapter to substitute the clearing price. The adapter resolves it before the bid
  is returned, so no host configuration is needed.
- **Non-bidder impression signals are preserved.** Only the `bidder` key is removed from
  `imp.ext`; signals such as `gpid`, `data` and `tid` are forwarded untouched.
- **Zero-value `device.ifa` is cleared.** When the OS reports the all-zero sentinel IFA
  (`00000000-0000-0000-0000-000000000000`, e.g. after an iOS ATT opt-out) the adapter clears it
  rather than forwarding it as though it were a real device ID.
- **No cookie sync.** The adapter does not declare a `userSync` endpoint. GVL 1202 is registered
  as "Edge226 Ltd" but declares `usesCookies: false` and does not include Purpose 1 ("store
  and/or access information on a device"), so a TCF-compliant CMP has no basis to authorize a
  cookie drop. Bidding is unaffected — Purpose 2 (basic ads) is declared.
- Bid floors in a currency other than USD are converted before the request is sent.
