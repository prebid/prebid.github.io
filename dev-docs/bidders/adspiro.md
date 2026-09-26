---
layout: bidder
title: Adspiro
description: Adspiro Prebid Bidder Adapter
biddercode: adspiro
gvl_id: none
tcfeu_supported: false
dsa_supported: false
usp_supported: true
gpp_sids: usnat, usstate_all, usp
coppa_supported: true
schain_supported: true
dchain_supported: false
userIds: all
media_types: banner, video, native, audio
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: true
endpoint_compression: true
pbjs: true
pbs: true
pbs_app_supported: true
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: true
privacy_sandbox: no
sidebarType: 1
---

## Note

Adspiro is an OpenRTB 2.6 ad exchange for US traffic. To get a `publisherId`, contact [support@adspiro.io](mailto:support@adspiro.io).

Add Adspiro's line to your `ads.txt` (`app-ads.txt` for apps): `adspiro.io, <publisherId>, DIRECT`.

`publisherId: 'test'` returns a test bid for every ad unit — banner, video, native and audio — without calling any buyer. Nothing is recorded or billed.

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                                 | Example                      | Type     |
|---------------|----------|-----------------------------------------------------------------------------|------------------------------|----------|
| `publisherId` | required | Adspiro publisher ID, issued during onboarding. `'test'` returns test bids. | `'6a6f5d5c9597144ec9031765'` | `string` |

The same parameter works in Prebid.js and Prebid Server. Everything else comes from standard locations:

- Floors: the [Price Floors module](/dev-docs/modules/floors.html). Bids and floors are in USD. The Prebid.js adapter leaves a floor in another currency out of the request (Prebid still enforces it on the bid); Prebid Server converts it to USD.
- First party data, `schain`, user IDs and consent: `ortb2` and `ortb2Imp`, passed through.
- Blocking: `bcat`, `badv`, `bapp` and `battr` are enforced on every bid.
- Deals: `ortb2Imp.pmp`.

## Media Types

- **Banner.**
- **Video.** Instream, and outstream when the ad unit has its own renderer (the adapter loads none). Instream bids are VAST XML, so they need [Prebid Cache](/dev-docs/show-video-with-a-dfp-video-tag.html).
- **Native.** OpenRTB native (`mediaTypes.native.ortb`).
- **Audio.** VAST XML, so it also needs Prebid Cache.

Multi-format ad units are welcome: Adspiro bids on any of the formats offered.

## User Sync

Prebid.js registers an iframe sync (`https://rtb.adspiro.io/u/iframe`) when iframes are allowed, otherwise an image sync (`https://rtb.adspiro.io/u/sync`), with the GDPR, US Privacy and GPP signals. It registers none when COPPA applies. Prebid.js allows only image syncs by default; to allow the iframe:

```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: { bidders: ['adspiro'], filter: 'include' }
    }
  }
});
```

Prebid Server uses a redirect sync and skips it when GDPR applies.

## Privacy

- US traffic only. Adspiro is not registered with IAB Europe (no GVL ID), so Prebid's TCF enforcement blocks the adapter where TCF applies.
- US Privacy, GPP (US national and state sections), Global Privacy Control and COPPA are honoured: user identifiers are removed before buyers see the request, and no user sync happens.
- Prebid.js [data deletion requests](/dev-docs/modules/consentManagementUsp.html) (`onDataDeletionRequest`) are supported.
- Users can opt out at <https://rtb.adspiro.io/u/optout>. Privacy policy: <https://adspiro.io/privacy>.

## Prebid Server

```json
"imp": [{
  "ext": {
    "prebid": {
      "bidder": {
        "adspiro": { "publisherId": "test" }
      }
    }
  }
}]
```
