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
pbs: false
pbs_app_supported: false
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: true
privacy_sandbox: 'no'
sidebarType: 1
---

## Note

Adspiro is an ad exchange for US traffic. To get a `publisherId`, contact [connect@adspiro.io](mailto:connect@adspiro.io), then add `adspiro.io, <publisherId>, DIRECT` to your `ads.txt` (`app-ads.txt` for apps).

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                                 | Example                      | Type     |
|---------------|----------|-----------------------------------------------------------------------------|------------------------------|----------|
| `publisherId` | required | Adspiro publisher ID, issued during onboarding. `'test'` returns test bids. | `'6a6f5d5c9597144ec9031765'` | `string` |

- Floors: set with the [Price Floors module](/dev-docs/modules/floors.html). Bids and floors are in USD; a floor in another currency is left out of the request, and Prebid still enforces it on the bids.
- First party data: everything in `ortb2` and `ortb2Imp` is passed on.
- Blocking: `bcat`, `badv`, `bapp` and `battr` are enforced on every bid.

## Test Parameters

`publisherId: 'test'` returns a $0.50 test bid for every media type without calling any buyer. Nothing is recorded or billed.

```javascript
var adUnits = [{
  code: 'banner-div',
  mediaTypes: {
    banner: { sizes: [[300, 250]] }
  },
  bids: [{
    bidder: 'adspiro',
    params: { publisherId: 'test' }
  }]
}];
```

## Video and Audio

Bids are VAST XML, so video and audio need [Prebid Cache](/dev-docs/show-video-with-a-dfp-video-tag.html). For outstream video, the ad unit must bring its own renderer.

## User Sync

We recommend [allowing iframe syncs](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Configure-User-Syncing) for `adspiro`: the iframe syncs all our buyers at once, while the image sync does one buyer per page view.

## Privacy

Users can opt out at <https://rtb.adspiro.io/u/optout>. Prebid.js [data deletion requests](/dev-docs/modules/consentManagementUsp.html) are supported. Privacy policy: <https://adspiro.io/privacy>.
