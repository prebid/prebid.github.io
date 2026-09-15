---
layout: bidder
title: PGAM Direct
description: Server-to-server OpenRTB 2.6 adapter from PGAM Media (self-hosted). Dynamic floors, transparent margins, schain integrity. Related — pgamssp (legacy, TeqBlaze-hosted).
redirect_from:
  - /dev-docs/bidders/pgam
  - /dev-docs/bidders/pgammedia
biddercode: pgamdirect
media_types: banner, video, native
gvl_id: 1353
prebid_member: false
schain_supported: true
tcfeu_supported: true
gpp_sids: tcfeu, usnat, usstate_all
usp_supported: true
coppa_supported: true
pbjs: true
pbs: false
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: true
userIds: all
multiformat_supported: will-bid-on-any
ortb_blocking_supported: partial
privacy_sandbox: paapi
sidebarType: 1
---

## Note

PGAM Direct is the self-hosted server-to-server OpenRTB adapter operated by PGAM Media LLC. For the legacy TeqBlaze-hosted integration, see [pgamssp](/dev-docs/bidders/pgamssp.html). We plan to migrate publishers from pgamssp to pgamdirect over 2026; both will coexist on the bidders list during that window.

Key differences from pgamssp:

- Canonical OpenRTB 2.5/2.6 (not a proprietary envelope)
- Dynamic rolling-quantile floor pricing on our bidder, published per `(dsp × placement × geo × device)` cell
- Transparent margin enforcement (5% hard floor, compile-time enforced, never zeroable from config)
- schain integrity — `pgamssp.com,1353` appears verified on every outbound request; complete=1 enforced
- HMAC-signed `burl` / `nurl` to defeat pixel replay
- Account onboarding via `orgId` issued by PGAM Media; reach out to your account manager for yours

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                              | Example                    | Type      |
|---------------|----------|--------------------------------------------------------------------------|----------------------------|-----------|
| `orgId`       | required | Your publisher identifier at PGAM Media. Issued during onboarding.       | `'pgam-acme-publisher'`    | `string`  |
| `placementId` | optional | Free-text placement identifier; mapped to `imp.tagid` on the bid request | `'leaderboard-728x90'`     | `string`  |
| `bidfloor`    | optional | Per-placement USD bidfloor; bidder still enforces its own minimum        | `1.25`                     | `number`  |

## Example — Banner

```javascript
pbjs.addAdUnits([{
  code: 'ad-slot-1',
  mediaTypes: {
    banner: { sizes: [[300, 250], [728, 90]] }
  },
  bids: [{
    bidder: 'pgamdirect',
    params: {
      orgId: 'pgam-acme-publisher',
      placementId: 'leaderboard-728x90'
    }
  }]
}]);
```

## Example — Video (instream)

```javascript
pbjs.addAdUnits([{
  code: 'video-adunit',
  mediaTypes: {
    video: {
      playerSize: [[640, 480]],
      mimes: ['video/mp4', 'application/javascript'],
      protocols: [2, 3, 5, 6],
      api: [1, 2],
      minduration: 5,
      maxduration: 30,
      placement: 1,
      plcmt: 1,
      linearity: 1
    }
  },
  bids: [{
    bidder: 'pgamdirect',
    params: {
      orgId: 'pgam-acme-publisher',
      placementId: 'preroll-15s'
    }
  }]
}]);
```

## Example — Native

```javascript
pbjs.addAdUnits([{
  code: 'native-adunit',
  mediaTypes: {
    native: {
      image: { required: true, sizes: [150, 50] },
      title: { required: true, len: 80 },
      sponsoredBy: { required: true }
    }
  },
  bids: [{
    bidder: 'pgamdirect',
    params: { orgId: 'pgam-acme-publisher' }
  }]
}]);
```

## Privacy

The adapter forwards only what Prebid.js supplies:

- `source.ext.schain` — the publisher's supply-chain object, if set
- `user.ext.eids` — registered Prebid User-ID modules
- `regs.ext.gdpr` / `regs.ext.gdpr_consent` — TCF v2 if `consentManagement` is enabled
- `regs.ext.us_privacy` — CCPA if `consentManagementUSP` is enabled
- `regs.gpp` / `regs.gpp_sid` — GPP if configured
- `regs.coppa` — from `ortb2.regs.coppa`

No cookies are set on the publisher's domain by this adapter.

## Migrating from pgamssp

Publishers already integrated via [pgamssp](/dev-docs/bidders/pgamssp.html) can run both adapters in parallel during the migration window:

```javascript
bids: [
  { bidder: 'pgamssp',    params: { placementId: 'your-placement' } },
  { bidder: 'pgamdirect', params: { orgId: 'pgam-your-slug', placementId: 'your-placement' } }
]
```

Prebid's auction picks the higher bid per impression, so you get the best of both while you evaluate.
