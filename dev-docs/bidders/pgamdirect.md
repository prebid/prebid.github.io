---
layout: bidder
title: PGAM Direct
description: Prebid PGAM Direct Bidder Adapter
redirect_from:
	- /dev-docs/bidders/pgam
	- /dev-docs/bidders/pgammedia
biddercode: pgamdirect
gvl_id: 1353
tcfeu_supported: true
usp_supported: true
coppa_supported: true
gpp_sids: tcfeu, usnat, usstate_all, usp
schain_supported: true
floors_supported: true
deals_supported: true
fpd_supported: true
media_types: banner, video, native
userIds: all
pbjs: true
pbs: false
pbs_app_supported: false
safeframes_ok: true
multiformat_supported: will-bid-on-any
sidebarType: 1
---

### Note

PGAM Direct is PGAM Media LLC's self-hosted SSP adapter, operating against our own OpenRTB 2.6 infrastructure at `rtb.pgammedia.com`. PGAM Media also maintains [`pgamssp`](/dev-docs/bidders/pgamssp.html), our legacy TeqBlaze-hosted integration. Both adapters are actively maintained during the 2026 migration window; new integrations should prefer `pgamdirect`.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                                                           | Example             | Type     |
|---------------|----------|-------------------------------------------------------------------------------------------------------|---------------------|----------|
| `orgId`       | required | Publisher slug issued during onboarding. Passed on every bid request so PGAM can route + report.      | `'pgam-acme-pub'`  | `string` |
| `placementId` | required | Placement reference for the ad slot. Must match a placement configured on the publisher's account.    | `'hdr-300x250'`    | `string` |

### Example

```javascript
var adUnits = [{
  code: 'your-ad-unit-id',
  mediaTypes: {
    banner: { sizes: [[300, 250], [728, 90]] }
  },
  bids: [{
    bidder: 'pgamdirect',
    params: {
      orgId:       'pgam-acme-pub',
      placementId: 'hdr-300x250'
    }
  }]
}];
```

### Privacy + identity

- **TCF v2.2** — consent string forwarded on every request; publishers on EU traffic must supply a valid TCF string.
- **USP / CCPA** — forwarded via `regs.ext.us_privacy`.
- **GPP** — `tcfeu`, `usnat`, `usstate_all`, and `usp` sections all supported.
- **COPPA** — honored; flag forwarded on `regs.coppa`.
- **User IDs** — all EIDs configured in Prebid's User ID module are passed through in `user.ext.eids`, including UID 2.0, ID5, LiveRamp RampID, The Trade Desk EUID, and SharedID.
- **SupplyChain Object** — full multi-hop schain forwarded with our node appended (asi: `pgamssp.com`, sid: publisher-scoped).
- **First-party data** — `ortb2` site, user, and content objects merged into the outbound request.

### Features

- **Multi-format imps** — banner, video (instream + outstream), and native on the same ad unit; we bid on any offered format.
- **Deals (PMP)** — `imp.pmp.deals[]` honored inbound; attention-indexed and curation deals from our marketplace are surfaced outbound.
- **Floors module** — `bidfloor` + `bidfloorcur` from the Prebid floors module are forwarded; PGAM additionally applies a dynamic rolling-quantile server-side floor.
- **Take-rate transparency** — every winning `bid.ext.pgam` carries `take_rate_pct`, `gross_cpm_usd`, and `publisher_payout_cpm_usd` for per-transaction reconciliation.

### Contact

- **Maintainer**: `ppatel@pgammedia.com`
- **Company**: PGAM Media LLC
- **GVL ID**: 1353
