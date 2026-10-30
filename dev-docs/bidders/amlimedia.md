---
layout: bidder
title: Amli Media
description: Prebid Amli Media Bidder Adapter
biddercode: amlimedia
tcfeu_supported: false
dsa_supported: false
gvl_id: none
usp_supported: true
coppa_supported: true
gpp_sids: tcfeu, usnat, usstate_all, usp
schain_supported: true
dchain_supported: false
userId: all
media_types: banner, video, native, audio
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: true
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: true
privacy_sandbox: no
sidebarType: 1
---

## Note

The Amli Media adapter needs a placement id (`pid`) for every ad unit. Publishers get one from the
Amli Media dashboard each time they create a new end point. Contact [anand@amlimedia.com](mailto:anand@amlimedia.com) for an account.

Each ad unit is sent to Amli Media as its own OpenRTB request, with first party data,
device data, user ids, supply chain, floors and the GDPR, US Privacy, GPP and COPPA signals.

## Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                                                       | Example      | Type               |
|---------------|----------|-----------------------------------------------------------------------------------|--------------|--------------------|
| `pid`         | required | Placement id from the Amli Media dashboard                                        | `'amli-123'` | `string \| number` |
| `test`        | optional | `1` enables test mode: test creatives, nothing billed, request logged to console  | `1`          | `integer`          |
| `bidfloor`    | optional | Static floor CPM in USD, used only when the floors module did not set one         | `0.5`        | `float`            |

Video and audio settings are read from `mediaTypes.video` and `mediaTypes.audio`.

## Currency

Amli Media bids in USD. Publishers with a non-USD ad server currency should include the
[currency module](/dev-docs/modules/currency.html) so Amli Media bids are converted. Floors in other
currencies are converted to USD with the currency module, or left out when they cannot be converted.

## Example

```javascript
var adUnits = [{
  code: 'div-banner',
  mediaTypes: {
    banner: { sizes: [[300, 250]] }
  },
  bids: [{
    bidder: 'amlimedia',
    params: { pid: 'amli-123', test: 1 }
  }]
}];
```

## User Sync

Amli Media syncs through an iframe, falling back to an image pixel when iframes are not allowed,
so image syncing works without any configuration. To allow the iframe sync:

```javascript
pbjs.mergeConfig({
  userSync: {
    filterSettings: {
      iframe: { bidders: ['amlimedia'], filter: 'include' }
    }
  }
});
```
